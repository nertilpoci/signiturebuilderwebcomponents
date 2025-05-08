export interface SignatureField {
    fieldId: string;
    type: 'signature' | 'name';
    x: number;
    y: number;
    page: number;
    width: number;
    height: number;
  }