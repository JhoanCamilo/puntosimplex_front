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
    let query = supabase.from("usuario").select(`
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

export async function createUser(data: {
  nombre_1: string;
  nombre_2?: string;
  apellido_1: string;
  apellido_2?: string;
  usuario: string; // alias generado por tus reglas
  correo: string;
  rol_id: number;
  tempPass: string;
}) {
  // ✅ 1. Generar alias único según BD
  const aliasUnico = await generarAliasUnico(data.usuario);

  // ✅ 2. Crear usuario en Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.correo,
    password: data.tempPass,
  });

  if (authError) {
    console.error("❌ Error Supabase Auth:", authError);
    return { status: 400, message: authError.message };
  }

  const userUuid = authData.user?.id;

  if (!userUuid) {
    return { status: 400, message: "No se pudo obtener el UUID del usuario." };
  }

  // ✅ 3. Guardar en tu tabla usuario
  const { error: insertError } = await supabase.from("usuario").insert({
    auth_id: userUuid,
    rol_id: data.rol_id,
    nombre_1: data.nombre_1,
    nombre_2: data.nombre_2 ?? null,
    apellido_1: data.apellido_1,
    apellido_2: data.apellido_2 ?? null,
    usuario: aliasUnico,
    activo: true,
    correo: data.correo,
  });

  if (insertError) {
    console.error("❌ Error al insertar en usuario:", insertError);
    return { status: 400, message: insertError.message };
  }

  return {
    status: 200,
    message: "Usuario creado correctamente",
    usuario_uuid: userUuid,
    usuario: aliasUnico,
  };
}

async function generarAliasUnico(baseAlias: string): Promise<string> {
  baseAlias = baseAlias.toUpperCase();

  let alias = baseAlias;
  let contador = 1;

  while (true) {
    const { data } = await supabase
      .from("usuario")
      .select("usuario")
      .eq("usuario", alias)
      .maybeSingle();

    if (!data) {
      return alias;
    }

    alias = `${baseAlias}${contador}`;
    contador++;
  }
}

export async function generarAliasUnicoFront(baseAlias: string): Promise<string> {
  baseAlias = baseAlias.toUpperCase();

  let alias = baseAlias;
  let contador = 1;

  while (true) {
    const { data } = await supabase
      .from("usuario")
      .select("usuario")
      .eq("usuario", alias)
      .maybeSingle();

    if (!data) return alias;

    alias = `${baseAlias}${contador}`;
    contador++;
  }
}


