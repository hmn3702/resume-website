/**
 * Supabase database types — matches the schema in supabase/01_create_tables.sql
 *
 * To regenerate from your live project run:
 *   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profile: {
        Row: {
          id: string;
          name: string;
          title: string;
          bio: string | null;
          avatar_url: string | null;
          cv_url: string | null;
          email: string | null;
          linkedin_url: string | null;
          github_url: string | null;
          location: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          title: string;
          bio?: string | null;
          avatar_url?: string | null;
          cv_url?: string | null;
          email?: string | null;
          linkedin_url?: string | null;
          github_url?: string | null;
          location?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          title?: string;
          bio?: string | null;
          avatar_url?: string | null;
          cv_url?: string | null;
          email?: string | null;
          linkedin_url?: string | null;
          github_url?: string | null;
          location?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      experience: {
        Row: {
          id: string;
          role: string;
          company: string;
          location: string | null;
          start_date: string;
          end_date: string | null;
          is_current: boolean;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          role: string;
          company: string;
          location?: string | null;
          start_date: string;
          end_date?: string | null;
          is_current?: boolean;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          role?: string;
          company?: string;
          location?: string | null;
          start_date?: string;
          end_date?: string | null;
          is_current?: boolean;
          description?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      education: {
        Row: {
          id: string;
          institution: string;
          degree: string;
          field: string;
          start_year: number;
          end_year: number | null;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          institution: string;
          degree: string;
          field: string;
          start_year: number;
          end_year?: number | null;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          institution?: string;
          degree?: string;
          field?: string;
          start_year?: number;
          end_year?: number | null;
          description?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      skills: {
        Row: {
          id: string;
          name: string;
          category: string;
          level: "beginner" | "intermediate" | "advanced" | "expert";
          order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: string;
          level: "beginner" | "intermediate" | "advanced" | "expert";
          order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          level?: "beginner" | "intermediate" | "advanced" | "expert";
          order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      certifications: {
        Row: {
          id: string;
          name: string;
          issuer: string;
          year: number;
          credential_url: string | null;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          issuer: string;
          year: number;
          credential_url?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          issuer?: string;
          year?: number;
          credential_url?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          title: string;
          description: string;
          tech_stack: string[];
          live_url: string | null;
          github_url: string | null;
          image_url: string | null;
          featured: boolean;
          order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          tech_stack?: string[];
          live_url?: string | null;
          github_url?: string | null;
          image_url?: string | null;
          featured?: boolean;
          order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          tech_stack?: string[];
          live_url?: string | null;
          github_url?: string | null;
          image_url?: string | null;
          featured?: boolean;
          order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          message: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          message?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      skill_level: "beginner" | "intermediate" | "advanced" | "expert";
    };
  };
}

// Convenience row types
export type Profile       = Database["public"]["Tables"]["profile"]["Row"];
export type Experience    = Database["public"]["Tables"]["experience"]["Row"];
export type Education     = Database["public"]["Tables"]["education"]["Row"];
export type Skill         = Database["public"]["Tables"]["skills"]["Row"];
export type Certification = Database["public"]["Tables"]["certifications"]["Row"];
export type Project       = Database["public"]["Tables"]["projects"]["Row"];
