import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          plan_type: 'monthly' | 'semester' | 'annual' | null
          plan_status: 'active' | 'inactive' | 'cancelled' | null
          plan_expires_at: string | null
          hotmart_transaction_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          plan_type?: 'monthly' | 'semester' | 'annual' | null
          plan_status?: 'active' | 'inactive' | 'cancelled' | null
          plan_expires_at?: string | null
          hotmart_transaction_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          plan_type?: 'monthly' | 'semester' | 'annual' | null
          plan_status?: 'active' | 'inactive' | 'cancelled' | null
          plan_expires_at?: string | null
          hotmart_transaction_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          hotmart_transaction_id: string
          product_id: string
          plan_type: 'monthly' | 'semester' | 'annual'
          amount: number
          status: 'completed' | 'cancelled' | 'refunded'
          webhook_data: any
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          hotmart_transaction_id: string
          product_id: string
          plan_type: 'monthly' | 'semester' | 'annual'
          amount: number
          status: 'completed' | 'cancelled' | 'refunded'
          webhook_data?: any
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          hotmart_transaction_id?: string
          product_id?: string
          plan_type?: 'monthly' | 'semester' | 'annual'
          amount?: number
          status?: 'completed' | 'cancelled' | 'refunded'
          webhook_data?: any
          created_at?: string
        }
      }
    }
  }
}