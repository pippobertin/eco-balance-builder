
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import { CheckCircle2, Building, FileText, BookOpen, Target, Users, Layers, LineChart } from 'lucide-react';
import { Company } from '@/context/types';
import { useToast } from '@/hooks/use-toast';
import { supabase, withRetry } from '@/integrations/supabase/client';

interface CompanyInformationProps {
  currentCompany: Company | null;
  onNext: () => void;
}

const CompanyInformation: React.FC<CompanyInformationProps> = ({ 
  currentCompany,
  onNext
}) => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  const [companyData, setCompanyData] = useState({
    name: '',
    vat_number: '',
    sector: '',
    ateco_code: '',
    nace_code: '',
    legal_form: '',
    collective_agreement: '',
    profile_about: '',
    profile_values: '',
    profile_mission: '',
    profile_vision: '',
    profile_value_chain: '',
    profile_value_creation_factors: ''
  });

  useEffect(() => {
    if (currentCompany) {
      // Load the company data
      const loadCompanyDetails = async () => {
        try {
          const { data, error } = await withRetry(() => 
            supabase
              .from('companies')
              .select('*')
              .eq('id', currentCompany.id)
              .single()
          );

          if (error) {
            throw error;
          }

          if (data) {
            setCompanyData({
              name: data.name || '',
              vat_number: data.vat_number || '',
              sector: data.sector || '',
              ateco_code: data.ateco_code || '',
              nace_code: data.nace_code || '',
              legal_form: data.legal_form || '',
              collective_agreement: data.collective_agreement || '',
              profile_about: data.profile_about || '',
              profile_values: data.profile_values || '',
              profile_mission: data.profile_mission || '',
              profile_vision: data.profile_vision || '',
              profile_value_chain: data.profile_value_chain || '',
              profile_value_creation_factors: data.profile_value_creation_factors || ''
            });
          }
        } catch (error) {
          console.error('Error loading company details:', error);
          toast({
            title: 'Errore',
            description: 'Impossibile caricare i dettagli aziendali',
            variant: 'destructive'
          });
        }
      };

      loadCompanyDetails();
    }
  }, [currentCompany]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCompanyData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveCompanyInfo = async () => {
    if (!currentCompany) return;
    
    setIsSaving(true);
    
    try {
      const { error } = await withRetry(() => 
        supabase
          .from('companies')
          .update({
            name: companyData.name,
            vat_number: companyData.vat_number,
            sector: companyData.sector,
            ateco_code: companyData.ateco_code,
            nace_code: companyData.nace_code,
            legal_form: companyData.legal_form,
            collective_agreement: companyData.collective_agreement,
            profile_about: companyData.profile_about,
            profile_values: companyData.profile_values,
            profile_mission: companyData.profile_mission,
            profile_vision: companyData.profile_vision,
            profile_value_chain: companyData.profile_value_chain,
            profile_value_creation_factors: companyData.profile_value_creation_factors
          })
          .eq('id', currentCompany.id)
      );

      if (error) {
        throw error;
      }

      toast({
        title: 'Informazioni salvate',
        description: 'Le informazioni aziendali sono state salvate con successo',
      });
      
      onNext();
    } catch (error) {
      console.error('Error saving company information:', error);
      toast({
        title: 'Errore',
        description: 'Impossibile salvare le informazioni aziendali',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const containerAnimation = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  if (!currentCompany) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Nessuna azienda selezionata</p>
      </div>
    );
  }

  return (
    <motion.div variants={containerAnimation} initial="hidden" animate="visible" className="space-y-6">
      <GlassmorphicCard>
        <div className="flex items-center mb-4">
          <Building className="mr-2 h-5 w-5 text-blue-500" />
          <h2 className="text-xl font-semibold">Informazioni Generali dell'Azienda</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="name">Denominazione</Label>
            <Input
              id="name"
              name="name"
              value={companyData.name}
              onChange={handleInputChange}
              placeholder="Nome azienda"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="vat_number">Partita IVA</Label>
            <Input
              id="vat_number"
              name="vat_number"
              value={companyData.vat_number || ''}
              onChange={handleInputChange}
              placeholder="Partita IVA"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sector">Settore</Label>
            <Input
              id="sector"
              name="sector"
              value={companyData.sector || ''}
              onChange={handleInputChange}
              placeholder="Settore di attività"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ateco_code">Codice ATECO</Label>
            <Input
              id="ateco_code"
              name="ateco_code"
              value={companyData.ateco_code || ''}
              onChange={handleInputChange}
              placeholder="Codice ATECO"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="nace_code">Codice NACE</Label>
            <Input
              id="nace_code"
              name="nace_code"
              value={companyData.nace_code || ''}
              onChange={handleInputChange}
              placeholder="Codice NACE"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="legal_form">Forma Societaria</Label>
            <Input
              id="legal_form"
              name="legal_form"
              value={companyData.legal_form || ''}
              onChange={handleInputChange}
              placeholder="Forma societaria"
            />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="collective_agreement">Contratto Collettivo Applicato</Label>
            <Input
              id="collective_agreement"
              name="collective_agreement"
              value={companyData.collective_agreement || ''}
              onChange={handleInputChange}
              placeholder="Contratto collettivo applicato"
            />
          </div>
        </div>
      </GlassmorphicCard>
      
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
      
      <div className="flex justify-end">
        <Button 
          onClick={saveCompanyInfo} 
          className="bg-blue-500 hover:bg-blue-600"
          disabled={isSaving}
        >
          {isSaving ? 'Salvataggio in corso...' : 'Salva informazioni e continua'}
          <CheckCircle2 className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default CompanyInformation;
