
import { IROData } from '../../types';
import { environmentalIROData } from './environmentalIRO';
import { waterResourcesIROData } from './waterResourcesIRO';
import { biodiversityIROData } from './biodiversityIRO';
import { circularEconomyIROData } from './circularEconomyIRO';
import { workforceIROData } from './workforceIRO';
import { supplyChainIROData } from './supplyChainIRO';
import { communityIROData } from './communityIRO';
import { consumerIROData } from './consumerIRO';

// Combine all IRO data into a single object
export const predefinedIROData: Record<string, IROData> = {
  ...environmentalIROData,
  ...waterResourcesIROData,
  ...biodiversityIROData,
  ...circularEconomyIROData,
  ...workforceIROData,
  ...supplyChainIROData,
  ...communityIROData,
  ...consumerIROData
};
