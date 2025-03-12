
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import { FileText, BookOpen, Users, Target, LineChart, Layers, Building } from 'lucide-react';

interface CompanyProfileInfoProps {
  companyData: {
    profile_about: string;
    profile_values: string;
    profile_mission: string;
    profile_vision: string;
    profile_value_chain: string;
    profile_value_creation_factors: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const CompanyProfileInfo: React.FC<CompanyProfileInfoProps> = ({ 
  companyData, 
  handleInputChange 
}) => {
  return (
    <GlassmorphicCard>
      <div className="flex items-center mb-4">
        <FileText className="mr-2 h-5 w-5 text-green-500" />
        <h2 className="text-xl font-semibold">Company Profile</h2>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="profile_about" className="flex items-center">
            <BookOpen className="mr-2 h-4 w-4" />
            Chi Siamo
          </Label>
          <Textarea
            id="profile_about"
            name="profile_about"
            value={companyData.profile_about || ''}
            onChange={handleInputChange}
            placeholder="Descrizione dell'azienda, storia e attività principali..."
            className="min-h-[120px]"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="profile_values" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Valori
          </Label>
          <Textarea
            id="profile_values"
            name="profile_values"
            value={companyData.profile_values || ''}
            onChange={handleInputChange}
            placeholder="I valori fondamentali che guidano la vostra azienda..."
            className="min-h-[120px]"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="profile_mission" className="flex items-center">
            <Target className="mr-2 h-4 w-4" />
            Mission
          </Label>
          <Textarea
            id="profile_mission"
            name="profile_mission"
            value={companyData.profile_mission || ''}
            onChange={handleInputChange}
            placeholder="La missione della vostra azienda..."
            className="min-h-[120px]"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="profile_vision" className="flex items-center">
            <LineChart className="mr-2 h-4 w-4" />
            Vision
          </Label>
          <Textarea
            id="profile_vision"
            name="profile_vision"
            value={companyData.profile_vision || ''}
            onChange={handleInputChange}
            placeholder="La visione a lungo termine della vostra azienda..."
            className="min-h-[120px]"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="profile_value_chain" className="flex items-center">
            <Layers className="mr-2 h-4 w-4" />
            Catena del Valore
          </Label>
          <Textarea
            id="profile_value_chain"
            name="profile_value_chain"
            value={companyData.profile_value_chain || ''}
            onChange={handleInputChange}
            placeholder="Descrizione della catena del valore dell'azienda..."
            className="min-h-[120px]"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="profile_value_creation_factors" className="flex items-center">
            <Building className="mr-2 h-4 w-4" />
            Fattori Chiave per la Creazione del Valore
          </Label>
          <Textarea
            id="profile_value_creation_factors"
            name="profile_value_creation_factors"
            value={companyData.profile_value_creation_factors || ''}
            onChange={handleInputChange}
            placeholder="I fattori strategici che contribuiscono alla creazione di valore..."
            className="min-h-[120px]"
          />
        </div>
      </div>
    </GlassmorphicCard>
  );
};

export default CompanyProfileInfo;
