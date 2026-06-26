/**
 * Supabase database types — auto-generate the real version with:
 *   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.ts
 *
 * This file is a typed placeholder that matches the schema defined in Phase 2.
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
          email: string | null;
          linkedin_url: string | null;
          github_url: string | null;
          cv_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["profile"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["profile"]["Insert"]>;
      };
      experience: {
        Row: {
          id: string;
          role: string;
          company: string;
          start_date: string;
          end_date: string | null;
          description: string | null;
          order: number;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["experience"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["experience"]["Insert"]>;
      };
      education: {
        Row: {
          id: string;
          institution: string;
          degree: string;
          field: string;
          start_year: number;
          end_year: number | null;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["education"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["education"]["Insert"]>;
      };
      skills: {
        Row: {
          id: string;
          name: string;
          category: string;
          level: "beginner" | "intermediate" | "advanced" | "expert";
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["skills"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["skills"]["Insert"]>;
      };
      certifications: {
        Row: {
          id: string;
          name: string;
          issuer: string;
          year: number;
          url: string | null;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["certifications"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["certifications"]["Insert"]
        >;
      };
      projects: {
        Row: {
          id: string;
          title: string;
          description: string;
          tech_stack: string[];
          url: string | null;
          image_url: string | null;
          featured: boolean;
          order: number;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["projects"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["projects"]["Insert"]>;
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
export type Profile = Database["public"]["Tables"]["profile"]["Row"];
export type Experience = Database["public"]["Tables"]["experience"]["Row"];
export type Education = Database["public"]["Tables"]["education"]["Row"];
export type Skill = Database["public"]["Tables"]["skills"]["Row"];
export type Certification = Database["public"]["Tables"]["certifications"]["Row"];
export type Project = Database["public"]["Tables"]["projects"]["Row"];
