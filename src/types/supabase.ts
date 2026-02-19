export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      invoices: {
        Row: {
          id: string
          created_at: string
          user_id: string
          client_name: string
          amount: number
          status: 'pending' | 'paid' | 'overdue'
          due_date: string | null
          file_url: string | null
          file_path: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          client_name: string
          amount: number
          status?: 'pending' | 'paid' | 'overdue'
          due_date?: string | null
          file_url?: string | null
          file_path?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          client_name?: string
          amount?: number
          status?: 'pending' | 'paid' | 'overdue'
          due_date?: string | null
          file_url?: string | null
          file_path?: string | null
        }
      }
    }
  }
}
