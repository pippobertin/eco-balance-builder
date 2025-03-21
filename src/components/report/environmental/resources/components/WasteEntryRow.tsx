
import React from 'react';
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface WasteEntryRowProps {
  id: string;
  description: string;
  totalWaste: number | null;
  recycledWaste: number | null;
  disposalWaste: number | null;
  onEdit: () => void;
  onDeleted: () => void;
  isHazardous?: boolean;
}

const WasteEntryRow: React.FC<WasteEntryRowProps> = ({
  id,
  description,
  totalWaste,
  recycledWaste,
  disposalWaste,
  onEdit,
  onDeleted,
  isHazardous = false
}) => {
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('waste_management')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Successo",
        description: "Voce di rifiuto eliminata con successo",
      });
      
      onDeleted();
    } catch (error: any) {
      console.error("Error deleting waste entry:", error);
      toast({
        title: "Errore",
        description: `Errore nell'eliminazione: ${error.message}`,
        variant: "destructive"
      });
    }
  };
  
  return (
    <tr className={`hover:bg-gray-50 ${isHazardous ? 'bg-red-50' : ''}`}>
      <td className="p-2 text-sm">{description}</td>
      <td className="p-2 text-right text-sm">{totalWaste ?? "-"}</td>
      <td className="p-2 text-right text-sm">{recycledWaste ?? "-"}</td>
      <td className="p-2 text-right text-sm">{disposalWaste ?? "-"}</td>
      <td className="p-2 text-right">
        <div className="flex justify-end space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onEdit}
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Eliminare questa voce?</AlertDialogTitle>
                <AlertDialogDescription>
                  Questa azione non può essere annullata. Vuoi procedere con l'eliminazione?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annulla</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                  Elimina
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </td>
    </tr>
  );
};

export default WasteEntryRow;
