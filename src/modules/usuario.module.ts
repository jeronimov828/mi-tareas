import { usuarioModel } from "../models/usuario.model";
import { axiosInstance } from "../config";
import Swal from "sweetalert2";

class usuarioModule {
    private _usuario: usuarioModel[] = []

    async iniciarSesion() {
        try {
            // Obtener valores del formulario
            const nombre = (document.querySelector("#usuario") as HTMLInputElement).value;
            const contrasena = (document.querySelector("#password") as HTMLInputElement).value;

            // Crear objeto con credenciales
            const datos: usuarioModel = { nombre, contrasena };

            // Enviar solicitud al servidor
            const response = await axiosInstance.post("login", datos);

            console.log("Respuesta del servidor:", response);

            // Verificar si la respuesta contiene el token
            if (response.data?.item?.token) {
                const token: string = response.data.item.token;

                // Guardar el token en sessionStorage
                sessionStorage.setItem("token", token);

                console.log("Token guardado en sessionStorage");

                // Mostrar alerta de éxito
                Swal.fire({
                    icon: "success",
                    title: "Inicio de sesión exitoso",
                    text: "Redirigiendo...",
                    timer: 2000,
                    showConfirmButton: false
                });

                // Redirigir después de 2 segundos
                setTimeout(() => {
                    window.location.href = "listaTareas.html"; // Cambia esto por la URL de tu aplicación
                }, 2000);
            } else {
                throw new Error("El servidor no proporcionó un token");
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);

            // Mostrar mensaje de error con SweetAlert
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Error al iniciar sesión. Verifica tus credenciales.",
            });
        }
    }
}

export default new usuarioModule();