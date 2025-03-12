
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StakeholderBasicInfoProps {
  name: string;
  category: string;
  email: string;
  stakeholderCategories: string[];
  onNameChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onEmailChange: (value: string) => void;
}

const StakeholderBasicInfo: React.FC<StakeholderBasicInfoProps> = ({
  name,
  category,
  email,
  stakeholderCategories,
  onNameChange,
  onCategoryChange,
  onEmailChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="stakeholderName">Nome dello stakeholder</Label>
        <Input
          id="stakeholderName"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Es. Associazione Consumatori Italiani"
        />
      </div>
      
      <div>
        <Label htmlFor="stakeholderCategory">Categoria</Label>
        <Select
          value={category}
          onValueChange={onCategoryChange}
        >
          <SelectTrigger id="stakeholderCategory">
            <SelectValue placeholder="Seleziona una categoria" />
          </SelectTrigger>
          <SelectContent>
            {stakeholderCategories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="md:col-span-2">
        <Label htmlFor="stakeholderEmail" className="flex items-center">
          Email <span className="text-red-500 ml-1">*</span>
        </Label>
        <Input
          id="stakeholderEmail"
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="email@esempio.com"
          required
          className="border-red-200 focus-visible:ring-red-300"
        />
        <p className="text-xs text-red-500 mt-1">
          Campo obbligatorio per l'invio dei sondaggi di materialità
        </p>
      </div>
    </div>
  );
};

export default StakeholderBasicInfo;
