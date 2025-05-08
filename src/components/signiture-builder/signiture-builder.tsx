import { Component, Host, h, Prop, State, Element, Watch, Event, EventEmitter } from '@stencil/core';
import * as pdfjsLib from 'pdfjs-dist';

interface Field {
  id: string;
  type: string;
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

@Component({
  tag: 'signiture-builder',
  styleUrl: 'signiture-builder.css',
  shadow: true,
})
export class SignitureBuilder {
  @Element() el: HTMLElement;

  @Prop() fileUrl: string;
  @State() pdfDoc: any;
  @State() totalPages: number = 0;
  @State() scale: number = 1.2;
  @State() fields: Field[] = [];
  @State() selectedFieldType: string = null;
  @State() pageDims: Record<number, { width: number; height: number }> = {};

  @Event() fieldsChanged: EventEmitter<Field[]>;

  private draggingField: Field = null;
  private dragOffsetX = 0;
  private dragOffsetY = 0;

  private fieldTypes = [
    { type: 'signature', label: '✍ Signature', width: 150, height: 50 },
    { type: 'text', label: '📝 Text', width: 120, height: 40 },
    { type: 'date', label: '📅 Date', width: 100, height: 40 },
  ];

  componentWillLoad() {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/signiturebuilderwebcomponents/assets/pdf.worker.min.mjs';
    if (this.fileUrl) this.loadPdf();
  }

  @Watch('fileUrl')
  fileUrlChanged() {
    this.loadPdf();
  }

  async loadPdf() {
    const loadingTask = pdfjsLib.getDocument(this.fileUrl);
    this.pdfDoc = await loadingTask.promise;
    this.totalPages = this.pdfDoc.numPages;
    this.pageDims = {};
    await this.renderPages();
  }

  async renderPages() {
    for (let i = 1; i <= this.totalPages; i++) {
      const page = await this.pdfDoc.getPage(i);
      const viewport = page.getViewport({ scale: this.scale });
      this.pageDims[i] = { width: viewport.width, height: viewport.height };
      const canvas = this.el.shadowRoot.querySelector(`#canvas-${i}`) as HTMLCanvasElement;
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      await page.render({ canvasContext: context, viewport }).promise;
    }
  }

  handleAddField(e: MouseEvent, pageNum: number) {
    if (!this.selectedFieldType) return;
    const pageContainer = e.currentTarget as HTMLElement;
    const rect = pageContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const def = this.fieldTypes.find(f => f.type === this.selectedFieldType);
    const newField: Field = {
      id: `${Date.now()}`,
      type: this.selectedFieldType,
      page: pageNum,
      x,
      y,
      width: def.width,
      height: def.height,
    };

    this.fields = [...this.fields, newField];
    this.fieldsChanged.emit(this.fields);
    this.selectedFieldType = null;
  }

  startDrag(e: MouseEvent, field: Field) {
    e.stopPropagation();
    this.draggingField = field;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    this.dragOffsetX = e.clientX - rect.left;
    this.dragOffsetY = e.clientY - rect.top;
    document.addEventListener('mousemove', this.handleDrag);
    document.addEventListener('mouseup', this.stopDrag);
  }

  handleDrag = (e: MouseEvent) => {
    if (!this.draggingField) return;
    const pageContainer = this.el.shadowRoot.querySelector(`.page[data-page="${this.draggingField.page}"]`) as HTMLElement;
    const rect = pageContainer.getBoundingClientRect();
    const newX = Math.min(Math.max(0, e.clientX - rect.left - this.dragOffsetX), rect.width - this.draggingField.width);
    const newY = Math.min(Math.max(0, e.clientY - rect.top - this.dragOffsetY), rect.height - this.draggingField.height);

    this.fields = this.fields.map(f =>
      f.id === this.draggingField.id ? { ...f, x: newX, y: newY } : f
    );
    this.fieldsChanged.emit(this.fields);
  };

  stopDrag = () => {
    this.draggingField = null;
    document.removeEventListener('mousemove', this.handleDrag);
    document.removeEventListener('mouseup', this.stopDrag);
  };

  deleteField(id: string) {
    this.fields = this.fields.filter(f => f.id !== id);
    this.fieldsChanged.emit(this.fields);
  }

  render() {
    return (
      <Host>
        <div class="toolbar">
          {this.fieldTypes.map(ft => (
            <button
              class={{ active: this.selectedFieldType === ft.type }}
              onClick={() => (this.selectedFieldType = ft.type)}
            >
              {ft.label}
            </button>
          ))}
        </div>

        <div class="pdf-container">
          {Array.from({ length: this.totalPages }, (_, i) => i + 1).map(pageNum => (
            <div
              class="page"
              data-page={pageNum}
              onClick={e => this.handleAddField(e, pageNum)}
              style={{
                width: `${this.pageDims[pageNum]?.width || 600}px`,
                height: `${this.pageDims[pageNum]?.height || 800}px`,
              }}
            >
              <canvas id={`canvas-${pageNum}`}></canvas>
              {this.fields
                .filter(f => f.page === pageNum)
                .map(f => (
                  <div
                    class={`field ${f.type}`}
                    style={{
                      left: `${f.x}px`,
                      top: `${f.y}px`,
                      width: `${f.width}px`,
                      height: `${f.height}px`,
                    }}
                    onMouseDown={e => this.startDrag(e, f)}
                  >
                    <span>{f.type}</span>
                    <button onClick={() => this.deleteField(f.id)}>×</button>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </Host>
    );
  }
}
