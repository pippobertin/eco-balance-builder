
import { EmissionsInput, EmissionsResults, EmissionsDetails } from '../types';
import { performScope1Calculation } from './scope1Calculations';
import { performScope2Calculation } from './scope2Calculations';
import { performScope3Calculation } from './scope3Calculations';

/**
 * Main function to perform emissions calculations across all scopes
 */
export const performEmissionsCalculation = (
  inputs: EmissionsInput,
  scope?: 'scope1' | 'scope2' | 'scope3'
): { results: EmissionsResults; details: EmissionsDetails } => {
  const results: EmissionsResults = {
    scope1: 0,
    scope2: 0,
    scope3: 0,
    total: 0
  };
  
  const details: EmissionsDetails = {
    scope1Details: '',
    scope2Details: '',
    scope3Details: ''
  };
  
  // Calculate Scope 1 emissions if requested or not specified
  if (!scope || scope === 'scope1') {
    const scope1Result = performScope1Calculation(inputs, results);
    Object.assign(results, scope1Result.updatedResults);
    details.scope1Details = scope1Result.details;
  }
  
  // Calculate Scope 2 emissions if requested or not specified
  if (!scope || scope === 'scope2') {
    const scope2Result = performScope2Calculation(inputs, results);
    Object.assign(results, scope2Result.updatedResults);
    details.scope2Details = scope2Result.details;
  }
  
  // Calculate Scope 3 emissions if requested or not specified
  if (!scope || scope === 'scope3') {
    const scope3Result = performScope3Calculation(inputs, results);
    Object.assign(results, scope3Result.updatedResults);
    details.scope3Details = scope3Result.details;
  }
  
  // Calculate total emissions
  results.total = results.scope1 + results.scope2 + results.scope3;
  
  console.log('Risultati finali del calcolo delle emissioni:', {
    scope1: results.scope1,
    scope2: results.scope2,
    scope3: results.scope3,
    total: results.total
  });
  
  return { results, details };
};
