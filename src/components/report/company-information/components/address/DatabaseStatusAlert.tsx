
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle } from 'lucide-react';

interface DatabaseStatusAlertProps {
  databaseStatus: 'empty' | 'loading' | 'loaded' | 'error';
  error: string | null;
  populatingData: boolean;
  onPopulateData: () => void;
  onRetry: () => void;
}

const DatabaseStatusAlert: React.FC<DatabaseStatusAlertProps> = ({
  databaseStatus,
  error,
  populatingData,
  onPopulateData,
  onRetry
}) => {
  return (
    <>
      {databaseStatus === 'empty' && (
        <Alert className="mb-4 bg-amber-50 border-amber-200">
          <AlertTitle className="text-amber-800">Database località non inizializzato</AlertTitle>
          <AlertDescription className="text-amber-700">
            <p className="mb-2">Il database delle località italiane (province e comuni) è vuoto.</p>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-white border-amber-300 text-amber-800 hover:bg-amber-100"
              onClick={onPopulateData}
              disabled={populatingData}
            >
              {populatingData ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Caricamento in corso...
                </>
              ) : (
                'Inizializza database località'
              )}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {error && databaseStatus === 'error' && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Errore</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {databaseStatus === 'error' && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Errore di connessione</AlertTitle>
          <AlertDescription>
            <p className="mb-2">Impossibile verificare lo stato del database delle località.</p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onRetry}
              className="bg-white text-destructive border-destructive/50 hover:bg-destructive/10"
            >
              Riprova
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default DatabaseStatusAlert;
