
import React from 'react';
import { MaterialityProvider } from './context/MaterialityProvider';
import MaterialityContent from './components/MaterialityContent';
import { getStakeholderPriorityColor } from './utils/stakeholderUtils';
import { getSurveyStatusColor, getSurveyStatusText } from './utils/surveyUtils';

interface MaterialityAnalysisContainerProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
}

const MaterialityAnalysisContainer: React.FC<MaterialityAnalysisContainerProps> = ({ 
  formValues, 
  setFormValues 
}) => {
  return (
    <MaterialityProvider 
      formValues={formValues}
      setFormValues={setFormValues}
      getStakeholderPriorityColor={getStakeholderPriorityColor}
      getSurveyStatusColor={getSurveyStatusColor}
      getSurveyStatusText={getSurveyStatusText}
    >
      <MaterialityContent />
    </MaterialityProvider>
  );
};

export default MaterialityAnalysisContainer;
