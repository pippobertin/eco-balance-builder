
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useReport } from '@/context/ReportContext';
import { Company } from '@/context/types';

interface AddCompanyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddCompanyDialog = ({ open, onOpenChange }: AddCompanyDialogProps) => {
  const { toast } = useToast();
  const { createCompany } = useReport();
  
  const [newCompany, setNewCompany] = useState<Omit<Company, 'id'>>({
    name: '',
    vat_number: '',
    country: '',
    address: '',
    contact_email: '',
    contact_phone: ''
  });

  const handleCreateCompany = async () => {
    if (!newCompany.name.trim()) {
      toast({
        title: "Errore",
        description: "Il nome dell'azienda è obbligatorio",
        variant: "destructive"
      });
      return;
    }
    
    const companyId = await createCompany(newCompany);
    if (companyId) {
      setNewCompany({
        name: '',
        vat_number: '',
        country: '',
        address: '',
        contact_email: '',
        contact_phone: ''
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Aggiungi Nuova Azienda</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="company-name">Nome Azienda *</Label>
            <Input 
              id="company-name" 
              value={newCompany.name} 
              onChange={(e) => setNewCompany(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Nome dell'azienda" 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="vat-number">Partita IVA</Label>
            <Input 
              id="vat-number" 
              value={newCompany.vat_number || ''} 
              onChange={(e) => setNewCompany(prev => ({ ...prev, vat_number: e.target.value }))}
              placeholder="Partita IVA" 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="country">Paese</Label>
            <Input 
              id="country" 
              value={newCompany.country || ''} 
              onChange={(e) => setNewCompany(prev => ({ ...prev, country: e.target.value }))}
              placeholder="Paese" 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="address">Indirizzo</Label>
            <Input 
              id="address" 
              value={newCompany.address || ''} 
              onChange={(e) => setNewCompany(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Indirizzo completo" 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="contact-email">Email di contatto</Label>
              <Input 
                id="contact-email" 
                type="email"
                value={newCompany.contact_email || ''} 
                onChange={(e) => setNewCompany(prev => ({ ...prev, contact_email: e.target.value }))}
                placeholder="Email" 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="contact-phone">Telefono di contatto</Label>
              <Input 
                id="contact-phone" 
                value={newCompany.contact_phone || ''} 
                onChange={(e) => setNewCompany(prev => ({ ...prev, contact_phone: e.target.value }))}
                placeholder="Telefono" 
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-3">
          <DialogClose asChild>
            <Button variant="outline">Annulla</Button>
          </DialogClose>
          
          <DialogClose asChild>
            <Button onClick={handleCreateCompany}>Salva Azienda</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCompanyDialog;
