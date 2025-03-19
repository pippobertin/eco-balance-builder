
import { EmissionsInput, EmissionsResults, EmissionsDetails } from '../types';
import { performScope1Calculation } from './scope1Calculations';
import { performScope2Calculation } from './scope2Calculations';
import { performScope3Calculation } from './scope3Calculations';

/**
 * Main function to perform emissions calculation across all scopes
 */
export const performEmissionsCalculation = (
  inputs: EmissionsInput,
  scope?: 'scope1' | 'scope2' | 'scope3'
): { results: EmissionsResults; details: EmissionsDetails } => {
  // Initialize results and details
  let results: EmissionsResults = {
    scope1: 0,
    scope2: 0,
    scope3: 0,
    total: 0
  };
  
  let details: EmissionsDetails = {
    scope1Details: '',
    scope2Details: '',
    scope3Details: ''
  };
  
  console.log('Starting emissions calculation for scope:', scope || 'all scopes');
  console.log('Input values:', JSON.stringify(inputs));
  
  // Perform calculation for the requested scope or all scopes
  if (!scope || scope === 'scope1') {
    const scope1Result = performScope1Calculation(inputs, results);
    results = scope1Result.updatedResults;
    details.scope1Details = scope1Result.details;
    console.log('Scope 1 calculation completed. Results:', results);
  }
  
  if (!scope || scope === 'scope2') {
    const scope2Result = performScope2Calculation(inputs, results);
    results = scope2Result.updatedResults;
    details.scope2Details = scope2Result.details;
    console.log('Scope 2 calculation completed. Results:', results);
  }
  
  if (!scope || scope === 'scope3') {
    const scope3Result = performScope3Calculation(inputs, results);
    results = scope3Result.updatedResults;
    details.scope3Details = scope3Result.details;
    console.log('Scope 3 calculation completed. Results:', results);
  }
  
  // Calculate total emissions
  results.total = results.scope1 + results.scope2 + results.scope3;
  
  console.log('Final calculation results:', results);
  
  return { results, details };
};
