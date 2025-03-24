
export type PollutionMedium = {
  id: number;
  name: string;
};

export type PollutantType = {
  id: number;
  name: string;
  description: string;
  release_medium_ids: number[];
  applicable_to?: number[]; // Add this property which might be used instead of release_medium_ids
};

export type PollutionRecord = {
  id?: string;
  report_id: string;
  pollutant_type_id: number;
  release_medium_id: number;
  quantity: number;
  unit: string;
  details?: string;
  created_at?: string;
};

// Input/output types for the hook
export interface UsePollutionDataInput {
  reportId?: string;
}

export interface UsePollutionDataOutput {
  mediums: PollutionMedium[];
  pollutants: PollutantType[];
  filteredPollutants: PollutantType[];
  records: PollutionRecord[];
  isLoading: boolean;
  isSubmitting: boolean;
  selectedMedium: number | null;
  setSelectedMedium: (id: number | null) => void;
  editingRecord: PollutionRecord | null;
  addRecord: (record: PollutionRecord) => Promise<PollutionRecord | null>;
  updateRecord: (record: PollutionRecord) => Promise<PollutionRecord | null>;
  deleteRecord: (id: string) => Promise<boolean>;
  editRecord: (record: PollutionRecord) => void;
  cancelEdit: () => void;
  refreshRecords: () => Promise<void>;
}
