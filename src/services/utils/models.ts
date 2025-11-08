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