
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Check, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const DataUploader = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [municipalitiesFile, setMunicipalitiesFile] = useState<File | null>(null);
  const [postalCodesFile, setPostalCodesFile] = useState<File | null>(null);
  const [clearExisting, setClearExisting] = useState(true);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleMunicipalitiesFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMunicipalitiesFile(e.target.files[0]);
    }
  };

  const handlePostalCodesFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPostalCodesFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!municipalitiesFile) {
      toast.error('Seleziona il file dei comuni');
      return;
    }

    setIsUploading(true);
    setUploadStatus('idle');

    try {
      // Read municipalities file
      const municipalitiesText = await municipalitiesFile.text();
      const municipalities = JSON.parse(municipalitiesText);

      // Read postal codes file if provided
      let postalCodes = null;
      if (postalCodesFile) {
        const postalCodesText = await postalCodesFile.text();
        postalCodes = JSON.parse(postalCodesText);
      }

      // Prepare data for upload
      const customData = {
        municipalities,
        postalCodes
      };

      // Call the Supabase Edge Function
      const toastId = toast.loading('Caricamento dei dati geografici in corso...');
      
      const { data, error } = await supabase.functions.invoke('populate-italian-locations', {
        body: { 
          customData,
          clearExisting
        }
      });

      if (error) {
        console.error('Error uploading location data:', error);
        toast.error('Errore nel caricamento dei dati geografici', { id: toastId });
        setUploadStatus('error');
      } else {
        console.log('Location data upload result:', data);
        toast.success(`Dati geografici caricati con successo: ${data.count} comuni`, { id: toastId });
        setUploadStatus('success');
      }
    } catch (error) {
      console.error('Error processing files:', error);
      toast.error('Errore nel processare i file JSON');
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Carica dati geografici</CardTitle>
        <CardDescription>
          Carica il tuo database JSON di comuni italiani e CAP per popolare il database
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="municipalities-file">File dei comuni (JSON)</Label>
          <div className="flex items-center gap-2">
            <input
              id="municipalities-file"
              type="file"
              accept=".json"
              onChange={handleMunicipalitiesFileChange}
              className="max-w-xs"
            />
            {municipalitiesFile && <Check className="h-4 w-4 text-green-500" />}
          </div>
          <p className="text-xs text-muted-foreground">
            Formato previsto: [{"{name: 'Nome Comune', province_code: 'XX', postal_codes: ['00000']}"}]
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="postal-codes-file">File dei CAP (opzionale)</Label>
          <div className="flex items-center gap-2">
            <input
              id="postal-codes-file"
              type="file"
              accept=".json"
              onChange={handlePostalCodesFileChange}
              className="max-w-xs"
            />
            {postalCodesFile && <Check className="h-4 w-4 text-green-500" />}
          </div>
          <p className="text-xs text-muted-foreground">
            Formato previsto: {"{'Nome Comune': '00000'}"}
          </p>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Checkbox 
            id="clear-existing" 
            checked={clearExisting}
            onCheckedChange={(checked) => setClearExisting(checked as boolean)}
          />
          <Label htmlFor="clear-existing">Cancella dati esistenti prima del caricamento</Label>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {uploadStatus === 'success' && (
          <div className="flex items-center text-green-600">
            <Check className="mr-1 h-4 w-4" /> Caricamento completato con successo
          </div>
        )}
        {uploadStatus === 'error' && (
          <div className="flex items-center text-red-600">
            <AlertCircle className="mr-1 h-4 w-4" /> Si è verificato un errore
          </div>
        )}
        {uploadStatus === 'idle' && <div />}
        <Button 
          onClick={handleUpload} 
          disabled={isUploading || !municipalitiesFile}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Caricamento in corso...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Carica dati
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DataUploader;
