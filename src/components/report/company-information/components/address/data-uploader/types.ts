// Types for DataUploader components
export interface ItalianMunicipality {
  denominazione_ita: string;
  cap: string;
  sigla_provincia: string;
  denominazione_provincia: string;
  // Other fields not needed for our implementation
}

export type FileType = 'json' | 'csv';
export type UploadStatus = 'idle' | 'success' | 'error';

export interface UploadResult {
  count: number;
  message: string;
}
