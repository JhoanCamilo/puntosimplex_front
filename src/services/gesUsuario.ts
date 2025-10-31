import { createClient } from "@supabase/supabase-js";
import { type usuario } from "./utils/models";

const url = import.meta.env.VITE_SUPABASE_URL!;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(url, key);

export async function getUsers(
  nombre?: string,
  rol?: number | "",
  activo?: string | ""
): Promise<usuario[]> {
  try {
    let query = supabase
      .from("usuario")
      .select(`
        *,
        rol:rol_id ( descripcion )
      `);

    // Filtro por nombre (solo si hay texto)
    if (nombre && nombre.trim().length > 0) {
      query = query.ilike("nombre_1", `%${nombre.trim()}%`);
    }

    // Filtro por rol (solo si rol es un number válido)
    if (typeof rol === "number") {
      query = query.eq("rol_id", rol);
    }

    // Filtro por estado (activo == true, inactivo == false)
    if (activo === "0") {
      query = query.eq("activo", true);
    } else if (activo === "1") {
      query = query.eq("activo", false);
    }

    const { data, error } = await query;

    if (error) {
      // Mostrar error completo para debug
      console.error("Error al consultar usuarios:", error);
      return [];
    }

    return (data ?? []) as usuario[];
  } catch (err) {
    console.error("Error inesperado:", err);
    return [];
  }
}
