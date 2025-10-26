interface usuario {
  user: string;
  password: string;
  role: string;
}

export const usuarios: usuario[] = [
  { user: "Admin", password: "Admin", role: "Admin" },
  { user: "Jhoan", password: "Jhoan123", role: "Mesero" },
];

interface LoginResponse {
  status: number;
  message: string;
  data?: unknown;
}

export async function LoginFunction(usuario: string, contrasena: string): Promise<LoginResponse> {
//   try {
//     const response = await fetch("https://tu-backend.com/api/login", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         user: usuario,
//         password: contrasena,
//       }),
//     });

//     const data = await response.json();

//     return {
//       status: response.status,
//       message: data.message || "Login procesado",
//       data: data.user || null,
//     };
//   } catch (error) {
//     console.error("Error al conectar con el backend:", error);
//     return {
//       status: 500,
//       message: "Error de conexión con el servidor",
//     };
//   }
    return new Promise<{ status: number; message: string }>((resolve) => {
        // Simula una llamada al servidor (delay opcional)
        setTimeout(() => {
            const encontrado = usuarios.find(
                (u) => u.user === usuario && u.password === contrasena
            );

            if (encontrado) {
                resolve({
                    status: 200,
                    message: `Bienvenido, ${encontrado.user}!`
                });
            } else {
                resolve({
                    status: 401,
                    message: "Usuario o contraseña incorrectos. Por favor, intente de nuevo"
                });
            }
        }, 800);
    });
}
