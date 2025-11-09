import { createClient } from "@supabase/supabase-js";
import { type mesa } from "./utils/models";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(url, key);

export const getMesas = async (): Promise<mesa[]> => {
  const { data, error } = await supabase
    .from("mesa")
    .select("*")
    .order("id", { ascending: true }); 

  if (error) {
    console.error("Error al obtener mesas:", error);
    throw error;
  }
  return data || [];
};

export async function mesaTienePedido(mesaId: number) {
  const { data, error } = await supabase
    .from("pedido_enc")
    .select("pedido_enc_id")
    .eq("num_mesa", mesaId)
    .order("pedido_enc_id", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error consultando pedido:", error);
    return null;
  }

  return data ? data.pedido_enc_id : null;
}

export const ocuparMesa = async (mesa: mesa) => {
  const { error: errorMesa } = await supabase
    .from("mesa")
    .update({ estado: true }) 
    .eq("id", mesa.id);

  if (errorMesa) {
    console.error("Error al ocupar la mesa:", errorMesa);
    throw errorMesa;
  }

  console.log(`Mesa ${mesa.numero} ocupada.`);
  return { success: true };
};



export const liberarMesa = async (mesaId: number) => {

  // 1. Marcar la mesa como "Disponible" (estado = false)
  const { error: errorMesa } = await supabase
    .from("mesa")
    .update({ estado: false })
    .eq("id", mesaId);

  if (errorMesa) {
    console.error("Error al liberar la mesa:", errorMesa);
    throw errorMesa;
  }

  console.log(`Mesa ${mesaId} liberada.`);
  return { success: true };
};