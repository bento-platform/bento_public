interface Tags {
  table_id: string;
  workflow_id: string;
  workflow_metadata: {
    data_type: string;
    id: string;
  };
}

interface Request {
  tags: Tags;
  workflow_type: string;
}

interface RunLog {
  end_time: string;
  id: string;
  start_time: string;
}

export interface ingestionData {
  end_time: string;
  request: Request;
  run_id: string;
  run_log: RunLog;
  state: string;
}

export type LastIngestionResponse = ingestionData[];
