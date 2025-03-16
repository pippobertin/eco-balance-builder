
// Types for DataUploader components
export interface ItalianMunicipality {
  denominazione_ita: string;
  cap: string;
  sigla_provincia: string;
  denominazione_provincia: string;
  // Other fields not needed for our implementation
}

export type FileType = 'json' | 'csv';
export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export interface UploadResult {
  count: number;
  message: string;
}

export interface UploadDataProps {
  data?: any[];
  targetTable?: string;
  province?: string;
  clearExisting?: boolean;
}

export interface DataUploaderState {
  isUploading: boolean;
  municipalitiesFile: File | null;
  postalCodesFile: File | null;
  clearExisting: boolean;
  uploadStatus: UploadStatus;
  fileType: FileType;
  setFileType: (value: FileType) => void;
  setClearExisting: (value: boolean) => void;
  handleMunicipalitiesFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePostalCodesFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpload: () => void;
}
