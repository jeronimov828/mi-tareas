import { tareasModel, tareasModelEstado, tareasModelCrear } from "../models/tareas.model";
import { axiosInstance } from "../config";
import Swal from "sweetalert2";
const ListarTareas = require("./../components/ListarTareas.hbs")
const editarTareas = require("./../components/formularioEditar.hbs")

class tareasModule {
    private _tareas: tareasModel[] = [];
    private _tareasEstado: tareasModelEstado[] = [];

    async listarTareas(): Promise<void> {
        try {
            // Obtener el token de sessionStorage
            const token = sessionStorage.getItem("token");

            // Verificar si el token existe
            if (!token) {
                throw new Error("No hay un token disponible. Inicia sesión nuevamente.");
            }

            // Realizar la solicitud con el token en los headers
            const response = await axiosInstance.get("listarTareas", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Verificar si la respuesta es válida
            if (response.data?.status) {
                let tareas = response.data.list;

                console.log("🔹 Lista de tareas recibida:", tareas);

                if (!tareas.length) {
                    console.warn("⚠️ No hay tareas para mostrar.");
                    return;
                }

                // Actualizar el HTML de la tabla de tareas
                (document.querySelector("#tablaTareas") as HTMLElement).innerHTML = ListarTareas({ tareas });
                console.log("🔹 HTML generado:", ListarTareas)
            } else {
                throw new Error("La respuesta del servidor no es válida.");
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);

            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Error al listar tareas",
            });
        }
    }

    async cambiarEstadoTarea(id: any): Promise<void> {
        try {
            const token = sessionStorage.getItem("token");

            if (!token) {
                throw new Error("No hay un token disponible. Inicia sesión nuevamente.");
            }

            const checkbox = document.querySelector(`#estadoTareas-${id}`) as HTMLInputElement;
            const editar: tareasModelEstado = {
                completada: checkbox.checked
            };

            const response = await axiosInstance.put(`editarTareas${id}`, editar, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data?.status) {
                console.log("🔹 Actualización Exitosa:", response.data);

                // ✅ Actualiza el texto del label dinámicamente
                const label = document.getElementById(`estadoLabel-${id}`);
                if (label) {
                    label.textContent = checkbox.checked ? "Completada" : "Pendiente";
                }

                Swal.fire("¡Éxito!", "La tarea fue actualizada correctamente", "success");
            } else {
                Swal.fire("Oops...", "No se pudo actualizar la tarea", "error");
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Error al actualizar la tarea",
            });
        }
    }

    async mostrarModal(): Promise<void> {
        (document.getElementById("modalCrearTarea") as HTMLElement).style.display = "block";
    }

    async mostrarModalEditar(id: any): Promise<void> {
        (document.getElementById("modalEditarTarea") as HTMLElement).style.display = "block";

        try {
            const token = sessionStorage.getItem("token");

            if (!token) {
                throw new Error("No hay un token disponible. Inicia sesión nuevamente.");
            }

            axiosInstance.get(`listarTareas/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(({ data }) => {
                if (data.status) {

                    let tareaEditar = data.item;

                    // Obtener el contenedor del formulario de edición e inyectar los datos
                    const formEditarElement = document.querySelector("#formEditar") as HTMLElement;
                    formEditarElement.innerHTML = editarTareas({ modalEditar: [tareaEditar] });

                    // Guardar el ID del producto en el formulario (para enviarlo más tarde)
                    (document.querySelector("#formEditar") as HTMLElement).setAttribute('data-id', id.toString());
                }
            }).catch(error => {
                console.error("Error al obtener el producto:", error);
            });
        } catch {

        }
    }

    async cerrarModal(): Promise<void> {
        (document.getElementById("modalCrearTarea") as HTMLElement).style.display = "none";
    }

    async cerrarModalEditar(): Promise<void> {
        (document.getElementById("modalEditarTarea") as HTMLElement).style.display = "none";
    }

    async crearTarea(): Promise<void> {
        try {
            const token = sessionStorage.getItem("token");

            if (!token) {
                throw new Error("No hay un token disponible. Inicia sesión nuevamente.");
            }

            const datos: tareasModelCrear = {
                titulo: (document.querySelector("#nombreTarea") as HTMLInputElement).value,
                descripcion: (document.querySelector("#descripcionTarea") as HTMLInputElement).value,
                fecha_vencimiento: (document.querySelector("#fechaVenceTarea") as HTMLInputElement).value
            };

            const response = await axiosInstance.post("tareas", datos, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log("Respuesta del servidor:", response); // Para depurar

            if (response.status == 201) {
                Swal.fire("¡Éxito!", "Tarea creada correctamente", "success");
            } else {
                Swal.fire("Oops...", "No se pudo crear la tarea", "error");
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Error al guardar la tarea",
            });
        }
    }

    async mostrarInformacionEditarTarea(id: any) {
        axiosInstance.get(`listarTareas/${id}`).then(({ data }) => {
            if (data.status) {

                let productosEditar = data.item;

                // Obtener el contenedor del formulario de edición e inyectar los datos
                const formEditarElement = document.querySelector("#formEditar") as HTMLElement;
                formEditarElement.innerHTML = editarTareas({ productosEditar });

                // Guardar el ID del producto en el formulario (para enviarlo más tarde)
                (document.querySelector("#formEditar") as HTMLElement).setAttribute('data-id', id.toString());
            }
        }).catch(error => {
            console.error("Error al obtener el producto:", error);
        });
    }

    async cerrarSesion() {
        sessionStorage.removeItem("token");

        // Mostrar alerta de éxito
        Swal.fire({
            icon: "success",
            title: "Se cerro la sesion exitosamente",
            text: "Redirigiendo...",
            timer: 2000,
            showConfirmButton: false
        });

        // Redirigir después de 2 segundos
        setTimeout(() => {
            window.location.href = "login.html"; // Cambia esto por la URL de tu aplicación
        }, 2000);
    }
}

export default new tareasModule();