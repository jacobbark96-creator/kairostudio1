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
      profiles: {
        Row: {
          id: string
          email: string | null
          role: 'user' | 'admin'
          created_at: string
        }
        Insert: {
          id: string
          email?: string | null
          role?: 'user' | 'admin'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          role?: 'user' | 'admin'
          created_at?: string
        }
      }
      site_content: {
        Row: {
          key: string
          value: string
          updated_at: string | null
        }
        Insert: {
          key: string
          value: string
          updated_at?: string | null
        }
        Update: {
          key?: string
          value?: string
          updated_at?: string | null
        }
      }
      offers: {
        Row: {
          id: string
          title: string
          description: string | null
          max_claims: number
          current_claims: number
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          max_claims?: number
          current_claims?: number
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          max_claims?: number
          current_claims?: number
          active?: boolean
          created_at?: string
        }
      }
    }
  }
}
