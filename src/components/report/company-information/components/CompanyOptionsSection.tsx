
import React from 'react';
import OptionCheckbox from './OptionCheckbox';

interface CompanyOptionsSectionProps {
  isPartOfGroup: boolean;
  hasMultipleLocations: boolean;
  onCheckboxChange: (name: string, checked: boolean) => void;
}

const CompanyOptionsSection: React.FC<CompanyOptionsSectionProps> = ({
  isPartOfGroup,
  hasMultipleLocations,
  onCheckboxChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
      <OptionCheckbox 
        id="is_part_of_group"
        label="L'azienda fa parte di un gruppo"
        description="Seleziona questa opzione se l'azienda è parte di un gruppo societario"
        checked={isPartOfGroup}
        onCheckedChange={(checked) => onCheckboxChange('is_part_of_group', checked)}
      />

      <OptionCheckbox 
        id="has_multiple_locations"
        label="L'azienda ha più sedi o stabilimenti"
        description="Seleziona questa opzione se l'azienda ha più sedi o stabilimenti oltre alla sede principale"
        checked={hasMultipleLocations}
        onCheckedChange={(checked) => onCheckboxChange('has_multiple_locations', checked)}
      />
    </div>
  );
};

export default CompanyOptionsSection;
