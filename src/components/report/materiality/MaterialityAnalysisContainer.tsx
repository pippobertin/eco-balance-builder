
import React from 'react';
import { MaterialityProvider } from './context/MaterialityProvider';
import MaterialityContent from './components/MaterialityContent';
import { useReport } from '@/hooks/use-report-context';

interface MaterialityAnalysisContainerProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
}

const MaterialityAnalysisContainer: React.FC<MaterialityAnalysisContainerProps> = ({ 
  formValues, 
  setFormValues 
}) => {
  const { currentReport } = useReport();
  const reportId = currentReport?.id || null;

  return (
    <MaterialityProvider reportId={reportId}>
      <MaterialityContent />
    </MaterialityProvider>
  );
};

export default MaterialityAnalysisContainer;
