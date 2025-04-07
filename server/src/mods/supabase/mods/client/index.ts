import { createClient } from "@supabase/supabase-js";
import { Database } from "../types";

export const supabase = createClient<Database>("https://vqceovbkcavejkqyqbqd.supabase.co", process.env.SUPABASE_KEY!)