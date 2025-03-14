
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatAddress } from '../address/addressUtils';
import { LocationItemProps } from './types';

const LocationItem: React.FC<LocationItemProps> = ({ 
  location,
  index,
  onEdit,
  onRemove
}) => {
  const getLocationTypeLabel = (type: string) => {
    switch (type) {
      case 'sede_legale': return 'Sede Legale';
      case 'sede_operativa': return 'Sede Operativa';
      case 'stabilimento': return 'Stabilimento';
      case 'magazzino': return 'Magazzino';
      case 'ufficio': return 'Ufficio';
      case 'altro': return 'Altro';
      default: return type;
    }
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium">
            {getLocationTypeLabel(location.location_type)}
          </p>
          <p className="text-sm mt-2">{formatAddress(location)}</p>
        </div>
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onEdit(index)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onRemove(index)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default LocationItem;
