import type { producto } from "./utils/models";
import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL!;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(url, key);

export async function getArticulos(
  descripcion?: string,
  categoria?: number | "",
  activo?: string | ""
): Promise<producto[]> {
  try {
    let query = supabase
      .from("articulo")
      .select(`*, categoria:categoria_id ( descripcion )`)
      .order("descripcion", { ascending: true });

    // ✅ Filtro por descripción
    if (descripcion && descripcion.trim().length > 0) {
      query = query.ilike("descripcion", `%${descripcion.trim()}%`);
    }

    // ✅ Filtro por categoría
    if (categoria !== "" && typeof categoria === "number") {
      query = query.eq("categoria_id", categoria);
    }

    // ✅ Filtro por estado
    if (activo === "0") {
      query = query.eq("activo", true);
    } else if (activo === "1") {
      query = query.eq("activo", false);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error al consultar articulos:", error);
      return [];
    }

    return data ?? [];
  } catch (err) {
    console.error("Error inesperado:", err);
    return [];
  }
}

export async function crearArticulo(data: {
  descripcion: string;
  valor_unitario: number;
  precio: number;
  categoria_id: number;
}) {
  try {
    // ✅ 1. Verificar si ya existe un producto con la misma descripción
    const { data: existe, error: errorExiste } = await supabase
      .from("articulo")
      .select("articulo_id")
      .eq("descripcion", data.descripcion.trim())
      .maybeSingle();

    if (errorExiste) {
      console.error("❌ Error verificando existencia:", errorExiste);
      return { status: 400, message: "Error al validar el producto." };
    }

    if (existe) {
      return {
        status: 409,
        message: "Este producto ya está registrado.",
      };
    }

    // ✅ 2. Insertar el nuevo producto
    const { error: insertError } = await supabase.from("articulo").insert({
      descripcion: data.descripcion.trim(),
      valor_unitario: data.valor_unitario,
      precio: data.precio,
      categoria_id: data.categoria_id,
      activo: true, // ✅ activo por defecto
    });

    if (insertError) {
      console.error("❌ Error al insertar artículo:", insertError);
      return { status: 400, message: insertError.message };
    }

    // ✅ 3. Éxito
    return {
      status: 200,
      message: "Producto correctamente registrado.",
    };
  } catch (error) {
    console.error("❌ Error inesperado:", error);
    return {
      status: 500,
      message: "Ocurrió un error inesperado.",
    };
  }
}

export async function getArticuloById(id: number) {
  try {
    const { data, error } = await supabase
      .from("articulo")
      .select(`*`)
      .eq("articulo_id", id)
      .maybeSingle(); // ✅ trae solo uno

    if (error) {
      console.error("❌ Error al consultar artículo:", error);
      return { status: 400, message: "Error al obtener el artículo" };
    }

    if (!data) {
      return { status: 404, message: "Artículo no encontrado" };
    }

    return { status: 200, data };
  } catch (err) {
    console.error("❌ Error inesperado:", err);
    return { status: 500, message: "Error interno del servidor" };
  }
}

export async function updateArticulo(
  id: number,
  data: {
    descripcion: string;
    valor_unitario: number;
    precio: number;
    categoria_id: number;
    activo: boolean;
  }
) {
  try {
    const { error } = await supabase
      .from("articulo")
      .update({
        descripcion: data.descripcion,
        valor_unitario: data.valor_unitario,
        precio: data.precio,
        categoria_id: data.categoria_id,
        activo: data.activo,
      })
      .eq("articulo_id", id);

    if (error) {
      console.error("❌ Error al actualizar artículo:", error);
      return { status: 400, message: "Error al actualizar los datos" };
    }

    return { status: 200, message: "Artículo actualizado correctamente" };
  } catch (err) {
    console.error("❌ Error inesperado:", err);
    return { status: 500, message: "Error interno del servidor" };
  }
}
