/**
 * Quick Supabase connection test
 * Run from the project root:
 *   node supabase/test_connection.mjs
 *
 * Requires .env.local to have your real NEXT_PUBLIC_SUPABASE_URL
 * and NEXT_PUBLIC_SUPABASE_ANON_KEY values.
 */

import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

// Manually parse .env.local (no dotenv needed)
const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => l.split("=").map((s) => s.trim()))
);

const url = env["NEXT_PUBLIC_SUPABASE_URL"];
const key = env["NEXT_PUBLIC_SUPABASE_ANON_KEY"];

if (!url || url.includes("placeholder")) {
  console.error("❌  Missing NEXT_PUBLIC_SUPABASE_URL in .env.local");
  process.exit(1);
}

const supabase = createClient(url, key);

async function test() {
  console.log("🔌  Connecting to:", url, "\n");

  const checks = [
    { table: "profile",        label: "Profile" },
    { table: "education",      label: "Education" },
    { table: "experience",     label: "Experience" },
    { table: "skills",         label: "Skills" },
    { table: "certifications", label: "Certifications" },
    { table: "projects",       label: "Projects" },
  ];

  let allOk = true;

  for (const { table, label } of checks) {
    const { data, error } = await supabase.from(table).select("*");
    if (error) {
      console.error(`❌  ${label}: ${error.message}`);
      allOk = false;
    } else {
      console.log(`✅  ${label}: ${data.length} row(s)`);
    }
  }

  console.log(allOk ? "\n🎉  All tables OK!" : "\n⚠️   Some tables failed — check errors above.");
}

test();
