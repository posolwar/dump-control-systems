interface IDumpExtend {
  server_name: string;
  database_name: string;
  id: number;
  database_id: number;
  created_at: string;
  size: number;
  status: string;
  file_path: string;
  scheduled_time: string;
}

export type { IDumpExtend }
