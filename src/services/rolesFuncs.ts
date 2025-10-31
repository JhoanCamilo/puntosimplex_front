import { createClient } from "@supabase/supabase-js";
import type { rol } from "./utils/models";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(url, key);

export async function getRoles(): Promise<rol[]> {
  try {
    let query = supabase.from("rol").select(`*`);

    const { data, error } = await query;

    console.log(data);
    
    if (error) {
      console.error("Error al consultar roles:", error);
      return [];
    }

    return data ?? [];
  } catch (err) {
    console.error("Error inesperado:", err);
    return [];
  }
}
