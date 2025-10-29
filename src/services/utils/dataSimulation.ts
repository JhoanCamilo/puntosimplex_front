interface usuario {
  usuarioid: number;
  rolid: string;
  nombre_1: string;
  nombre_2: string;
  apellido_1: string;
  apellido_2: string;
  activo: boolean;
}
export const usuarios: usuario[] = [
    {
        usuarioid: 1,
        rolid: "Admin",
        nombre_1: "Jhoan",
        nombre_2: "Camilo",
        apellido_1: "Arango",
        apellido_2: "Monsalve",
        activo: true
    },
    {
        usuarioid: 2,
        rolid: "Mesero",
        nombre_1: "Laura",
        nombre_2: "Catalina",
        apellido_1: "Narvaez",
        apellido_2: "García",
        activo: true
    },
    {
        usuarioid: 3,
        rolid: "Cajero",
        nombre_1: "Nicolas",
        nombre_2: "",
        apellido_1: "Paz",
        apellido_2: "Varela",
        activo: true
    }
];