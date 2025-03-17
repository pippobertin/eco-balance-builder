
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface EmissionsResetDialogProps {
  showResetDialog: boolean;
  setShowResetDialog: React.Dispatch<React.SetStateAction<boolean>>;
  resetScope: 'current' | 'all';
  setResetScope: React.Dispatch<React.SetStateAction<'current' | 'all'>>;
  onResetConfirm: () => void;
}

const EmissionsResetDialog: React.FC<EmissionsResetDialogProps> = ({
  showResetDialog,
  setShowResetDialog,
  resetScope,
  setResetScope,
  onResetConfirm
}) => {
  return (
    <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Azzera calcoli delle emissioni</AlertDialogTitle>
          <AlertDialogDescription>
            Questa azione cancellerà tutti i dati di calcolo delle emissioni.
            Vuoi procedere e applicare l'azzeramento solo alla sede corrente o a tutte le sedi?
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="py-4">
          <RadioGroup value={resetScope} onValueChange={(value) => setResetScope(value as 'current' | 'all')}>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="current" id="reset-current" />
              <Label htmlFor="reset-current" className="font-normal">Solo sede corrente</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="reset-all" />
              <Label htmlFor="reset-all" className="font-normal">Tutte le sedi</Label>
            </div>
          </RadioGroup>
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel>Annulla</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onResetConfirm}
            className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
          >
            Conferma azzeramento
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EmissionsResetDialog;
