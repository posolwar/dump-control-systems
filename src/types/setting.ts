interface ISettingOption {
  description: string
  option_name: string
  setting_name: string
}
interface ISetting {
  created_at: string
  id: number | string
  key: string
  value: string
}

export type { ISettingOption, ISetting }
