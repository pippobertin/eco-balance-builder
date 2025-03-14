
import { CompanyLocation } from '../../types';

export interface LocationFormData extends CompanyLocation {}

export interface LocationItemProps {
  location: CompanyLocation;
  index: number;
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
}

export interface LocationFormProps {
  formData: LocationFormData;
  onLocationTypeChange: (value: string) => void;
  onAddressChange: (data: Partial<any>) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isEditing?: boolean;
}
