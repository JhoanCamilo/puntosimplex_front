import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(url, key);

interface LoginResponse {
  status: number;
  message: string;
  user?: unknown;
}

export async function LoginFunction(
  usuario: string,
  contrasena: string
): Promise<LoginResponse> {
  try {
    // ✅ Paso 1: Obtener usuario + correo + rol.descripcion con JOIN
    const { data: userRow, error: userError } = await supabase
      .from("usuario")
      .select(`
        correo,
        usuario,
        rol:rol_id ( descripcion )
      `)
      .ilike("usuario", usuario.trim())
      .maybeSingle();

    if (userError || !userRow) {
      return { status: 404, message: "Usuario no encontrado" };
    }

    // ✅ Paso 2: Iniciar sesión en Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: userRow.correo,
      password: contrasena,
    });

    if (error) {
      return { status: 401, message: error.message };
    }

    // ✅ Paso 3: Devolver éxito con rol JOIN-eado
    return {
      status: 200,
      message: "Inicio de sesión exitoso",
      user: {
        username: userRow.usuario,
        role: userRow.rol.descripcion,
      },
    };

  } catch (err) {
    console.error(err);
    return { status: 500, message: "Error interno del servidor" };
  }
}
