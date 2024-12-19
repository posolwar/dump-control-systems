interface IScheduleExtend {
  database_id: number
  database_name: string
  id: number
  last_run: string
  repeat_interval: string
  schedule_time: string
  server_name: string
  status: string
}

export type { IScheduleExtend }
