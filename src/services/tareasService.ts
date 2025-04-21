// src/services/tareasService.ts
import { Tarea } from "../types/Tarea";

// Asegúrate de poner tu URL base aquí:
const API_URL = "http://localhost:4000/api";

export const getTareas = async (): Promise<Tarea[]> => {
  const res = await fetch(`${API_URL}/listarTareas`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) {
    throw new Error("Error al obtener las tareas");
  }

  const data = await res.json();
  return data.list || [];
};

export const cambiarEstadoTarea = async (
  id: number,
  completada: boolean
): Promise<void> => {
  const res = await fetch(`${API_URL}/editarTareas${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      completada: completada, // Usar el parámetro recibido
    }),
  });

  if (!res.ok) {
    throw new Error("Error al cambiar el estado de la tarea");
  }
};

export const editarTarea = async (
  id: number,
  titulo: string,
  descripcion: string,
  fecha_vencimiento: string
): Promise<void> => {
  const res = await fetch(`${API_URL}/editarTareas${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      titulo, // Usar el parámetro recibido
      descripcion,
      fecha_vencimiento,
    }),
  });

  if (!titulo || !descripcion) {
    alert("El título y la descripción son obligatorios");
    return;
  }

  if (!res.ok) {
    throw new Error("Error al editar tarea");
  }

  return res.json();
};

export const crearTarea = async (
  titulo: string,
  descripcion: string,
  fecha_vencimiento: string
): Promise<void> => {
  const res = await fetch(`${API_URL}/tareas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      titulo, // Usar el parámetro recibido
      descripcion,
      fecha_vencimiento,
    }),
  });

  if (!titulo || !descripcion) {
    alert("El título y la descripción son obligatorios");
    return;
  }

  if (!res.ok) {
    throw new Error("Error al editar tarea");
  }

  return res.json();
};
