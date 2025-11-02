import type { categoria } from "./utils/models";
import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL!;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(url, key);

export async function getCategorias(
  descripcion?: string,
  activo?: string | ""
): Promise<categoria[]> {
  try {
    let query = supabase.from("categoria_productos").select(`*`);

        // Filtro por descripción (solo si hay texto)
    if (descripcion && descripcion.trim().length > 0) {
      query = query.ilike("descripcion", `%${descripcion.trim()}%`);
    }

    // Filtro por estado (activo == true, inactivo == false)
    if (activo === "0") {
      query = query.eq("activo", true);
    } else if (activo === "1") {
      query = query.eq("activo", false);
    }

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
