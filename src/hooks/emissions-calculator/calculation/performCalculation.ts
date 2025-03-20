
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
    console.log('Calculating scope1 with initial results:', results);
    
    try {
      const scope1Result = performScope1Calculation(inputs, results);
      results = scope1Result.updatedResults;
      details.scope1Details = scope1Result.details;
      console.log('Scope 1 calculation completed. Updated results:', results);
    } catch (error) {
      console.error('Error in scope1 calculation:', error);
    }
  }
  
  if (!scope || scope === 'scope2') {
    console.log('Calculating scope2 with results after scope1:', results);
    try {
      const scope2Result = performScope2Calculation(inputs, results);
      results = scope2Result.updatedResults;
      details.scope2Details = scope2Result.details;
      console.log('Scope 2 calculation completed. Updated results:', results);
    } catch (error) {
      console.error('Error in scope2 calculation:', error);
    }
  }
  
  if (!scope || scope === 'scope3') {
    console.log('Calculating scope3 with results after scope1+2:', results);
    try {
      const scope3Result = performScope3Calculation(inputs, results);
      results = scope3Result.updatedResults;
      details.scope3Details = scope3Result.details;
      console.log('Scope 3 calculation completed. Updated results:', results);
    } catch (error) {
      console.error('Error in scope3 calculation:', error);
    }
  }
  
  // Calculate total emissions (should already be accurate from incremental updates)
  results.total = results.scope1 + results.scope2 + results.scope3;
  
  // Make sure all values are numbers
  results.scope1 = Number(results.scope1) || 0;
  results.scope2 = Number(results.scope2) || 0;
  results.scope3 = Number(results.scope3) || 0;
  results.total = Number(results.total) || 0;
  
  console.log('Final calculation results:', results);
  
  return { results, details };
};
