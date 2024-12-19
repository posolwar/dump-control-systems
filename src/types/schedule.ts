interface ISchedule {
  database_id: number
  id: number
  last_run: string
  repeat_interval: string
  schedule_time: string
  status: string
}

export type { ISchedule }
