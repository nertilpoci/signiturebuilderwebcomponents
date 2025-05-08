import { Component, Host, h, Prop, State, Event, EventEmitter, Watch, Method } from '@stencil/core';
import * as pdfjsLib from 'pdfjs-dist';

interface FormField {
  fieldId: string;
  type: 'signature' | 'name';
  x: number;
  y: number;
  page: number;
  width: number;
  height: number;
}

@Component({
  tag: 'signiture-builder',
  styleUrl: 'signiture-builder.css',
  shadow: true,
})
export class SignitureBuilder {
  @Prop() fileUrl: string;

  @State() currentPage: number = 1;
  @State() totalPages: number = 0;
  @State() isLoading: boolean = false;
  @State() error: string = null;
  @State() fields: FormField[] = [];
  @State() activeFieldType: 'signature' | 'name' = null;
  @State() isCanvasReady: boolean = false;

  private canvasRef: HTMLCanvasElement;
  private pdfDocument: any = null;

  @Event() fieldAdded: EventEmitter<FormField>;
  @Event() fieldRemoved: EventEmitter<{ fieldId: string }>;
  @Event() fieldsChanged: EventEmitter<FormField[]>;
  @Event() pdfLoaded: EventEmitter<{ pages: number }>;

  @Method()
  async getFields(): Promise<FormField[]> {
    return [...this.fields];
  }

  @Method()
  async setActiveFieldType(type: 'signature' | 'name'): Promise<void> {
    this.activeFieldType = type;
  }

  componentWillLoad() {
    // Set the worker source
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/assets/pdf.worker.min.mjs';
  }

  componentDidLoad() {
    // Canvas is now available in the DOM
    this.isCanvasReady = true;
    
    // Load PDF if URL was provided
    if (this.fileUrl) {
      this.loadPdf();
    }
  }

  @Watch('fileUrl')
  async watchFileUrl(newUrl: string) {
    if (newUrl && this.isCanvasReady) {
      this.loadPdf();
    }
  }

  async loadPdf() {
    if (!this.fileUrl || !this.isCanvasReady) return;

    this.isLoading = true;
    this.error = null;
    this.fields = []; // Clear existing fields when loading a new PDF

    try {
      const loadingTask = pdfjsLib.getDocument(this.fileUrl);
      this.pdfDocument = await loadingTask.promise;
      this.totalPages = this.pdfDocument.numPages;
      this.currentPage = 1;

      // Emit event that PDF is loaded
      this.pdfLoaded.emit({ pages: this.totalPages });

      // Render the first page
      await this.renderPage(this.currentPage);
    } catch (err) {
      console.error('Error loading PDF:', err);
      this.error = 'Failed to load PDF. Please check the URL and try again.';
    } finally {
      this.isLoading = false;
    }
  }

  async renderPage(pageNumber: number) {
    if (!this.pdfDocument || !this.canvasRef) {
      return;
    }

    try {
      const page = await this.pdfDocument.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 1.0 });

      this.canvasRef.height = viewport.height;
      this.canvasRef.width = viewport.width;

      const renderContext = {
        canvasContext: this.canvasRef.getContext('2d'),
        viewport: viewport,
      };

      await page.render(renderContext).promise;
    } catch (err) {
      console.error('Error rendering page:', err);
      this.error = `Failed to render page ${pageNumber}`;
    }
  }

  private handleCanvasClick = (e: MouseEvent) => {
    if (!this.activeFieldType) return;

    const rect = this.canvasRef.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newField: FormField = {
      fieldId: `field-${Date.now()}`,
      type: this.activeFieldType,
      x,
      y,
      page: this.currentPage,
      width: this.activeFieldType === 'signature' ? 150 : 200,
      height: 50,
    };

    this.fields = [...this.fields, newField];
    this.fieldAdded.emit(newField);
    this.fieldsChanged.emit(this.fields);
  };

  private handleRemoveField = (fieldId: string) => {
    this.fields = this.fields.filter((f) => f.fieldId !== fieldId);
    this.fieldRemoved.emit({ fieldId });
    this.fieldsChanged.emit(this.fields);
  };

  private handlePrevPage = async () => {
    if (this.currentPage > 1) {
      this.currentPage--;
      await this.renderPage(this.currentPage);
    }
  };

  private handleNextPage = async () => {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      await this.renderPage(this.currentPage);
    }
  };

  render() {
    return (
      <Host>
        <div class="signiture-builder">
          <div class="controls">
            <div class="field-buttons">
              <button
                class={{ 'field-button': true, active: this.activeFieldType === 'signature' }}
                onClick={() => this.setActiveFieldType(this.activeFieldType === 'signature' ? null : 'signature')}
                disabled={this.isLoading || !!this.error}
              >
                Signature Field
              </button>
              <button
                class={{ 'field-button': true, active: this.activeFieldType === 'name' }}
                onClick={() => this.setActiveFieldType(this.activeFieldType === 'name' ? null : 'name')}
                disabled={this.isLoading || !!this.error}
              >
                Name Field
              </button>
            </div>

            {this.totalPages > 0 && (
              <div class="page-navigation">
                <button disabled={this.currentPage <= 1 || this.isLoading} onClick={this.handlePrevPage}>
                  Previous
                </button>
                <span>
                  Page {this.currentPage} of {this.totalPages}
                </span>
                <button disabled={this.currentPage >= this.totalPages || this.isLoading} onClick={this.handleNextPage}>
                  Next
                </button>
              </div>
            )}
          </div>

          <div class="pdf-viewer">
            {this.isLoading && <div class="loading">Loading PDF...</div>}
            {this.error && <div class="error">{this.error}</div>}

            <div class="pdf-container" style={{ position: 'relative', visibility: (!this.isLoading && !this.error) ? 'visible' : 'hidden' }}>
              <canvas ref={(el) => (this.canvasRef = el)} onClick={this.handleCanvasClick}></canvas>

              <div class="field-overlay">
                {this.fields
                  .filter((field) => field.page === this.currentPage)
                  .map((field) => (
                    <div
                      key={field.fieldId}
                      class={`field field-${field.type}`}
                      style={{
                        position: 'absolute',
                        left: `${field.x}px`,
                        top: `${field.y}px`,
                        width: `${field.width}px`,
                        height: `${field.height}px`,
                        backgroundColor: 'rgba(255, 255, 0, 0.4)',
                        border: '1px solid #333',
                        cursor: 'move',
                      }}
                    >
                      <div class="field-label">
                        {field.type === 'signature' ? 'Sign Here' : 'Full Name'}
                      </div>
                      <button
                        class="remove-button"
                        style={{
                          position: 'absolute',
                          top: '0',
                          right: '0',
                          background: 'red',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '20px',
                          height: '20px',
                          cursor: 'pointer',
                        }}
                        onClick={() => this.handleRemoveField(field.fieldId)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </Host>
    );
  }
}