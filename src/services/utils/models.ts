export interface rol{
    rol_id: number
    descripcion: string
    activo: boolean
}
export interface usuario{
    usuario_id: number
    rol: string
    nombre_1: string
    nombre_2?: string
    apellido_1: string
    apellido_2?: string
    usuario: string
    activo: boolean
    correo: string
}
export interface categoria{
    categoria_id: number
    descripcion: string
    activo: boolean
}
export interface producto{
    categoria_id: number
    articulo_id: number
    descripcion: string
    valor_unitario: number
    precio: number
    categoria: string
    activo: boolean
}
export interface mesa {
  id: number;
  estado: boolean;
  numero: string;
}
export interface pedido_enc{
    pedido_enc_id: number
    domicilio: boolean
    titular: string
    num_mesa: number
    direccion_entrega: string
    fecha: string
}
export interface pedido_det{
    pedido_det_id: number
    pedido_enc_id: number
    articulo_id: number
    cantidad: number
    nota: string
    valor_total: number
}