// types/server.ts
 interface IServer {
  created_at: string;
  id: number;
  ip_address: string;
  location: string;
  name: string;
  port: string;
  status: string;
  updated_at: string;
}

export type { IServer }
