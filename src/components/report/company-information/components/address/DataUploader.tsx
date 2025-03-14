
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUploadTabs, UploadOptions, StatusIndicator, UploadButton, useDataUploader } from './data-uploader';

const DataUploader = () => {
  const {
    isUploading,
    municipalitiesFile,
    postalCodesFile,
    clearExisting,
    uploadStatus,
    fileType,
    setFileType,
    setClearExisting,
    handleMunicipalitiesFileChange,
    handlePostalCodesFileChange,
    handleUpload
  } = useDataUploader();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Carica dati geografici</CardTitle>
        <CardDescription>
          Carica il tuo database di comuni italiani e CAP per popolare il database
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FileUploadTabs
          fileType={fileType}
          setFileType={setFileType}
          municipalitiesFile={municipalitiesFile}
          postalCodesFile={postalCodesFile}
          handleMunicipalitiesFileChange={handleMunicipalitiesFileChange}
          handlePostalCodesFileChange={handlePostalCodesFileChange}
        />

        <UploadOptions
          clearExisting={clearExisting}
          setClearExisting={setClearExisting}
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <StatusIndicator status={uploadStatus} />
        <UploadButton
          isUploading={isUploading}
          isDisabled={!municipalitiesFile}
          onClick={handleUpload}
        />
      </CardFooter>
    </Card>
  );
};

export default DataUploader;
