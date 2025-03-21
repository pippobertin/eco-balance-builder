
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useReport } from '@/context/ReportContext';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useReportContext } from '../hooks/useReportContext';

interface AddReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddReportDialog = ({ open, onOpenChange }: AddReportDialogProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createReport } = useReport();
  const { selectedCompany } = useReportContext();
  
  const [newReportData, setNewReportData] = useState({
    report_year: new Date().getFullYear().toString(),
    report_type: 'A',
    is_consolidated: false
  });

  const handleCreateReport = async () => {
    if (!selectedCompany) {
      toast({
        title: "Errore",
        description: "Seleziona un'azienda prima di creare un report",
        variant: "destructive"
      });
      return;
    }
    
    const reportId = await createReport({
      company_id: selectedCompany.id,
      report_year: newReportData.report_year,
      report_type: newReportData.report_type,
      is_consolidated: newReportData.is_consolidated,
      environmental_metrics: {},
      social_metrics: {},
      conduct_metrics: {},
      status: 'draft'
    });
    
    if (reportId) {
      setNewReportData({
        report_year: new Date().getFullYear().toString(),
        report_type: 'A',
        is_consolidated: false
      });
      
      navigate('/report');
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crea Nuovo Report</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="report-year">Anno di Riferimento</Label>
            <Input 
              id="report-year" 
              type="number"
              value={newReportData.report_year} 
              onChange={(e) => setNewReportData(prev => ({ ...prev, report_year: e.target.value }))}
              placeholder="Anno" 
            />
          </div>
          
          <div className="space-y-3">
            <Label>Tipo di Report</Label>
            <RadioGroup 
              value={newReportData.report_type} 
              onValueChange={(value) => setNewReportData(prev => ({ ...prev, report_type: value }))}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="A" id="option-a" />
                <Label htmlFor="option-a">Opzione A: Modulo Base</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="B" id="option-b" />
                <Label htmlFor="option-b">Opzione B: Modulo Base e Modulo Narrativo-PAT</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="C" id="option-c" />
                <Label htmlFor="option-c">Opzione C: Modulo Base e Modulo Partner commerciali</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="D" id="option-d" />
                <Label htmlFor="option-d">Opzione D: Tutti i moduli</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="is-consolidated" 
              checked={newReportData.is_consolidated}
              onCheckedChange={(checked) => 
                setNewReportData(prev => ({ 
                  ...prev, 
                  is_consolidated: checked === true 
                }))
              }
            />
            <Label htmlFor="is-consolidated">Rendicontazione su base consolidata</Label>
          </div>
        </div>
        
        <div className="flex justify-end gap-3">
          <DialogClose asChild>
            <Button variant="outline">Annulla</Button>
          </DialogClose>
          
          <DialogClose asChild>
            <Button onClick={handleCreateReport}>Crea Report</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddReportDialog;
