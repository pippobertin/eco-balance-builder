
import { IROData } from '../../../types';
import { climateIROData } from './climateIRO';
import { energyIROData } from './energyIRO';
import { pollutionIROData } from './pollutionIRO';
import { substancesIROData } from './substancesIRO';

// Combine all environmental IRO data into a single object
export const environmentalIROData: Record<string, IROData> = {
  ...climateIROData,
  ...energyIROData,
  ...pollutionIROData,
  ...substancesIROData
};
