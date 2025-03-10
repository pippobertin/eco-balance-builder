
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const UserDialog = ({ open, onOpenChange, onSuccess }: UserDialogProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Invoking create-user function');
      
      // Call the Edge Function
      const { data, error } = await supabase.functions.invoke('create-user', {
        body: { email, password },
      });

      console.log('Function response:', { data, error });

      if (error) {
        throw new Error(error.message || 'Failed to create user');
      }

      if (!data) {
        throw new Error('No data returned from the server');
      }

      toast({
        title: "Utente creato con successo",
        description: `Un nuovo utente è stato creato con email: ${email}`,
      });
      
      onSuccess();
      onOpenChange(false);
      setEmail('');
      setPassword('');
    } catch (error: any) {
      console.error('Errore nella creazione dell\'utente:', error);
      toast({
        title: "Errore nella creazione dell'utente",
        description: error.message || 'Si è verificato un errore durante la creazione dell\'utente',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Aggiungi Nuovo Utente</DialogTitle>
          <DialogDescription>
            Inserisci i dettagli per creare un nuovo utente nella piattaforma.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="col-span-3"
                required
                minLength={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} className="bg-esg-blue hover:bg-esg-blue/90">
              {loading ? 'Creazione in corso...' : 'Crea Utente'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserDialog;
