import { createClient } from "@supabase/supabase-js";

let url = import.meta.env.VITE_SUPABASE_URL;
let key = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(url, key);

interface LoginResponse {
  status: number;
  message: string;
  user?: any;
}

export async function LoginFunction(
  usuario: string,
  contrasena: string
): Promise<LoginResponse> {
  try {
    // Paso 1: Buscar el correo asociado al usuario
    const { data: userRow, error: userError } = await supabase
      .from("usuario")
      .select("correo, rol_id, usuario")
      .ilike("usuario", usuario.trim())
      .maybeSingle();

    if (userError || !userRow) {
      return { status: 404, message: "Usuario no encontrado" };
    }

    // Paso 2: Iniciar sesión con Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: userRow.correo,
      password: contrasena,
    });

    if (error) {
      return { status: 401, message: error.message };
    }

    // Paso 3: Devolver respuesta exitosa
    return {
      status: 200,
      message: "Inicio de sesión exitoso",
      user: {
        username: userRow.usuario,
        role: userRow.rol_id,
      },
    };
  } catch (err: any) {
    console.error(err);
    return { status: 500, message: "Error interno del servidor" };
  }
}
