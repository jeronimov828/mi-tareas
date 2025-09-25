import React, { useEffect, useState } from "react";
import TablaTareas from "./TablaTareas";
import MetricsDashboard from "./MetricsDashboard";
import {
  getTareas,
  cambiarEstadoTarea,
  editarTarea,
  crearTarea,
} from "../services/tareasService";
import { Tarea } from "../types/Tarea";
import { Navigate, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const TareasPage: React.FC = () => {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const navigate = useNavigate(); // Mover esto acá arriba
  const [modalCrearAbierto, setModalCrearAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [tareaEditando, setTareaEditando] = useState<Tarea | null>(null);
  const [showMetrics, setShowMetrics] = useState(false);

  useEffect(() => {
    const cargarTareas = async () => {
      try {
        const tareasData = await getTareas();
        setTareas(tareasData);
      } catch (error) {
        console.error("Error al cargar tareas:", error);
      }
    };

    cargarTareas();
  }, []);

  const handleToggleCompletada = async (id: number, completada: boolean) => {
    try {
      // Envía el estado actual de "completada" sin invertirlo
      await cambiarEstadoTarea(id, completada);

      // Actualiza el estado local para reflejar el cambio en la UI
      setTareas((prevTareas) =>
        prevTareas.map((tarea) =>
          tarea.id === id ? { ...tarea, completada } : tarea
        )
      );
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    }
  };

  const limpiarCamposCracion = () => {
    setTituloCrear("");
    setdescripcionCrear("");
    setfechaCrear("");
  };

  const handleEditar = async (
    id: number,
    titulo: string,
    descripcion: string,
    fecha_vencimiento: string
  ) => {
    try {
      if (!titulo.trim() || !descripcion.trim()) {
        alert("Título y descripción no pueden estar vacíos.");
        return;
      }

      // Formatear la fecha si es necesario
      const fechaFormateada = new Date(fecha_vencimiento)
        .toISOString()
        .split("T")[0];

      // Enviar datos actualizados
      await editarTarea(id, titulo, descripcion, fechaFormateada);

      // Actualizar el estado local
      Swal.fire({
        icon: "success",
        title: "Edicion Exitosa",
        confirmButtonText: "Aceptar",
      }).then((result) => {
        if (result.isConfirmed) {
          setTareas((prevTareas) =>
            prevTareas.map((tarea) =>
              tarea.id === id
                ? {
                    ...tarea,
                    titulo,
                    descripcion,
                    fecha_vencimiento: new Date(fechaFormateada),
                  }
                : tarea
            )
          );
        }
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al editar la tarea",
        confirmButtonText: "Aceptar",
      });
      console.error("Error al editar tarea:", error);
    }
  };

  const handleCrearTarea = async (
    titulo: string,
    descripcion: string,
    fecha_vencimiento: string
  ) => {
    try {
      if (!titulo.trim() || !descripcion.trim()) {
        alert("Título y descripción no pueden estar vacíos.");
        return;
      }

      // Formatear la fecha si es necesario
      const fechaFormateada = new Date(fecha_vencimiento)
        .toISOString()
        .split("T")[0];

      // Enviar datos actualizados
      Swal.fire({
        icon: "success",
        title: "Creacion Exitosa",
        confirmButtonText: "Aceptar",
      }).then((result) => {
        if (result.isConfirmed) {
          crearTarea(titulo, descripcion, fechaFormateada);
        }
      });

      // Actualizar el estado local
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al crear la tarea",
        confirmButtonText: "Aceptar",
      });
      console.error("Error al editar tarea:", error);
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Se cerrará tu sesión.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        navigate("/"); // o window.location.href = "/";
      }
    });
  };

  const handleAbrirModalCrear = () => {
    setModalCrearAbierto(true);
  };

  const handleAbrirModalEditar = (id: number) => {
    const tarea = tareas.find((t) => t.id === id);
    if (tarea) {
      if (tarea) {
        setTareaEditando(tarea);
        setTituloEdit(tarea.titulo);
        setDescripcionEdit(tarea.descripcion);
        setFechaEdit(
          new Date(tarea.fecha_vencimiento).toISOString().split("T")[0]
        );
        setModalEditarAbierto(true);
      }
    }
  };

  const [tituloEdit, setTituloEdit] = useState("");
  const [descripcionEdit, setDescripcionEdit] = useState("");
  const [fechaEdit, setFechaEdit] = useState("");

  const [tituloCrear, setTituloCrear] = useState("");
  const [descripcionCrear, setdescripcionCrear] = useState("");
  const [fechaCrear, setfechaCrear] = useState("");

  return (
    <div className="container mt-5">
      {showMetrics ? (
        <MetricsDashboard
          tareas={tareas}
          onLogout={handleLogout}
          onBackToTasks={() => setShowMetrics(false)}
        />
      ) : (
        <>
          <TablaTareas
            tareas={tareas}
            onToggleCompletada={handleToggleCompletada}
            onAbrirModalEditar={handleAbrirModalEditar}
            onAbrirModalCrear={handleAbrirModalCrear}
            onLogout={handleLogout}
            onShowMetrics={() => setShowMetrics(true)}
          />
        </>
      )}
      {modalCrearAbierto && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>Crear Nueva Tarea</h4>
            <form>
              <div className="mb-3">
                <label className="form-label" htmlFor="exampleInputEmail1">
                  Titulo
                </label>
                <input
                  aria-describedby="emailHelp"
                  className="form-control"
                  id="exampleInputEmail1"
                  type="text"
                  value={tituloCrear}
                  onChange={(e) => setTituloCrear(e.target.value)}
                />
                <div className="form-text" id="emailHelp">
                  Agrega el nombre de tu nueva tarea
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="exampleInputEmail1">
                  Descripción
                </label>
                <input
                  aria-describedby="emailHelp"
                  className="form-control"
                  id="exampleInputEmail1"
                  type="email"
                  value={descripcionCrear}
                  onChange={(e) => setdescripcionCrear(e.target.value)}
                />
                <div className="form-text" id="emailHelp">
                  Decribe brevemente de que trata tu tarea
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="exampleInputEmail1">
                  Fecha Fin Tarea
                </label>
                <input
                  aria-describedby="emailHelp"
                  className="form-control"
                  id="exampleInputEmail1"
                  type="date"
                  value={fechaCrear}
                  onChange={(e) => setfechaCrear(e.target.value)}
                />
                <div className="form-text" id="emailHelp">
                  Agrega una fecha limite para terminar tu tarea
                </div>
              </div>
            </form>
            <button
              className="btn btn-primary"
              id="guardar"
              onClick={() => {
                handleCrearTarea(tituloCrear, descripcionCrear, fechaCrear);
                limpiarCamposCracion();
                setModalCrearAbierto(false); // cerrar el modal después de crear
              }}
            >
              Guardar
            </button>
            <button
              className="btn btn-secondary"
              id="cerrarModal"
              onClick={() => {
                setModalCrearAbierto(false);
                limpiarCamposCracion();
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {modalEditarAbierto && tareaEditando && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>Editar Tarea: {tareaEditando.titulo}</h4>
            <form>
              <div className="mb-3">
                <label className="form-label" htmlFor="exampleInputEmail1">
                  Titulo
                </label>
                <input
                  className="form-control"
                  type="text"
                  value={tituloEdit}
                  onChange={(e) => setTituloEdit(e.target.value)}
                />
                <div className="form-text" id="emailHelp">
                  Edita el nombre de tu tarea actual
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="exampleInputEmail1">
                  Descripción
                </label>
                <input
                  className="form-control"
                  type="text"
                  value={descripcionEdit}
                  onChange={(e) => setDescripcionEdit(e.target.value)}
                />
                <div className="form-text" id="emailHelp">
                  Edita la descripcion de tu tarea actual
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="exampleInputEmail1">
                  Fecha Fin Tarea
                </label>
                <input
                  className="form-control"
                  type="text"
                  value={fechaEdit}
                  onChange={(e) => setFechaEdit(e.target.value)}
                />
                <div className="form-text" id="emailHelp">
                  Edita la fecha fin de tu tarea actual
                </div>
              </div>
            </form>
            <button
              className="btn btn-primary"
              id="guardar"
              onClick={() => {
                if (tareaEditando) {
                  handleEditar(
                    tareaEditando.id,
                    tituloEdit,
                    descripcionEdit,
                    fechaEdit
                  );
                  setModalEditarAbierto(false); // cerrar el modal después de editar
                }
              }}
            >
              Guardar
            </button>
            <button
              className="btn btn-secondary"
              id="cerrarModal"
              onClick={() => setModalEditarAbierto(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TareasPage;
