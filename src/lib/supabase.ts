import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      user_data: {
        Row: {
          id: string
          user_id: string
          monthly_income: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          monthly_income: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          monthly_income?: number
          created_at?: string
          updated_at?: string
        }
      }
      budget_items: {
        Row: {
          id: string
          user_id: string
          description: string
          category: 'emergency' | 'essential' | 'nonessential'
          value: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          description: string
          category: 'emergency' | 'essential' | 'nonessential'
          value: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          description?: string
          category?: 'emergency' | 'essential' | 'nonessential'
          value?: number
          created_at?: string
          updated_at?: string
        }
      }
      cuts: {
        Row: {
          id: string
          user_id: string
          description: string
          value: number
          category: 'essential' | 'nonessential'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          description: string
          value: number
          category: 'essential' | 'nonessential'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          description?: string
          value?: number
          category?: 'essential' | 'nonessential'
          created_at?: string
          updated_at?: string
        }
      }
      expenses: {
        Row: {
          id: string
          user_id: string
          description: string
          value: number
          date: string
          is_paid: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          description: string
          value: number
          date: string
          is_paid?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          description?: string
          value?: number
          date?: string
          is_paid?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      patrimony_entries: {
        Row: {
          id: string
          user_id: string
          period: string
          bank: number
          brokerage: number
          assets: number
          total: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          period: string
          bank: number
          brokerage: number
          assets: number
          total: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          period?: string
          bank?: number
          brokerage?: number
          assets?: number
          total?: number
          created_at?: string
          updated_at?: string
        }
      }
      annual_balances: {
        Row: {
          id: string
          user_id: string
          period: string
          earned: number
          spent: number
          balance: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          period: string
          earned: number
          spent: number
          balance: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          period?: string
          earned?: number
          spent?: number
          balance?: number
          created_at?: string
          updated_at?: string
        }
      }
      goals: {
        Row: {
          id: string
          user_id: string
          title: string
          target_value: number
          current_value: number
          deadline: string
          is_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          target_value: number
          current_value?: number
          deadline: string
          is_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          target_value?: number
          current_value?: number
          deadline?: string
          is_completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}