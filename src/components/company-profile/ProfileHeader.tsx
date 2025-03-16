
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Building, Upload, Database } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DataUploader } from '@/components/report/company-information/components/address';

interface ProfileHeaderProps {
  companyName: string;
  municipalityCount: number | null;
  onForceLoadData: () => void;
  showDataUploader: boolean;
  setShowDataUploader: (show: boolean) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  companyName,
  municipalityCount,
  onForceLoadData,
  showDataUploader,
  setShowDataUploader
}) => {
  const navigate = useNavigate();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }} 
      className="mb-8"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-2"
            onClick={() => navigate('/companies')}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Indietro
          </Button>
          <h1 className="text-3xl font-bold">Anagrafica Azienda</h1>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onForceLoadData}
          >
            <Upload className="h-4 w-4 mr-1" />
            Ricarica Dati ({municipalityCount !== null ? municipalityCount : '...'} comuni)
          </Button>
          
          <Dialog open={showDataUploader} onOpenChange={setShowDataUploader}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Database className="h-4 w-4 mr-1" />
                Gestione Dati Geografici
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Gestione Dati Geografici</DialogTitle>
              </DialogHeader>
              <DataUploader />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="flex items-center">
        <Building className="h-5 w-5 text-blue-500 mr-2" />
        <p className="text-xl font-semibold text-gray-700">
          {companyName}
        </p>
      </div>
    </motion.div>
  );
};

export default ProfileHeader;
