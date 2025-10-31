import { createClient } from "@supabase/supabase-js";
import { type usuario } from "./utils/models";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(url, key);

export async function getUsers(): Promise<usuario[]> {
  try {
    const { data, error } = await supabase
      .from("usuario")
      .select("*")

    if (error) {
      console.error("Error al consultar usuarios:", error);
      return [];
    }

    return data
  } catch (err) {
    console.error("Error inesperado:", err);
    return [];
  }
}
