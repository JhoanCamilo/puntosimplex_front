import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL!;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(url, key);

// servicio nuevo: meseroService.ts

export async function crearPedidoMesa({
  num_mesa,
  detalles, // array con { articulo_id, cantidad, nota, precio }
}: {
  num_mesa: number;
  detalles: {
    articulo_id: number;
    cantidad: number;
    nota?: string;
    precio: number; // precio unitario obtenido del producto
  }[];
}) {
  try {
    // ✅ 1. Crear encabezado del pedido
    const { data: encData, error: encError } = await supabase
      .from("pedido_enc")
      .insert({
        num_mesa,
        fecha: new Date().toISOString(),
        domicilio: false,
        titular: null,
        direccion_entrega: null,
      })
      .select("pedido_enc_id")
      .single();

    if (encError) {
      console.error("Error creando pedido_enc:", encError);
      return { status: 400, message: "No se pudo crear el pedido." };
    }

    const pedido_enc_id = encData.pedido_enc_id;

    // ✅ 2. Crear detalles del pedido
    const detallesInsert = detalles.map((d) => ({
      pedido_enc_id,
      articulo_id: d.articulo_id,
      cantidad: d.cantidad,
      nota: d.nota || null,
      valor_total: d.cantidad * d.precio,
    }));

    const { error: detError } = await supabase
      .from("pedido_det")
      .insert(detallesInsert);

    if (detError) {
      console.error("Error creando detalles:", detError);
      return {
        status: 400,
        message: "No se pudieron registrar los detalles del pedido.",
      };
    }

    return {
      status: 200,
      message: "Pedido registrado correctamente.",
      pedido_enc_id,
    };
  } catch (error) {
    console.error("Error inesperado:", error);
    return {
      status: 500,
      message: "Error inesperado al registrar el pedido.",
    };
  }
}
