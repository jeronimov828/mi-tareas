import { Tarea } from "../types/Tarea";

export interface MetricsData {
  totalTareas: number;
  tareasCompletadas: number;
  tareasPendientes: number;
  porcentajeCompletitud: number;
  tareasVencidas: number;
  tareasProximasVencer: number;
  tareasCompletadasHoy: number;
  tareasCompletadasEstaSemana: number;
  tareasCompletadasEsteMes: number;
  promedioTareasPorDia: number;
  diasConsecutivosProductivos: number;
  distribucionPorDiaSemana: { [key: string]: number };
  tendenciaSemanal: { [key: string]: number };
}

export const calculateMetrics = (tareas: Tarea[]): MetricsData => {
  const ahora = new Date();
  const hoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
  const inicioSemana = new Date(hoy);
  inicioSemana.setDate(hoy.getDate() - hoy.getDay());
  const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);

  // Métricas básicas
  const totalTareas = tareas.length;
  const tareasCompletadas = tareas.filter((t) => t.completada).length;
  const tareasPendientes = totalTareas - tareasCompletadas;
  const porcentajeCompletitud =
    totalTareas > 0 ? (tareasCompletadas / totalTareas) * 100 : 0;

  // Tareas vencidas y próximas a vencer
  const tareasVencidas = tareas.filter(
    (t) => !t.completada && new Date(t.fecha_vencimiento) < hoy
  ).length;

  const proximos3Dias = new Date(hoy);
  proximos3Dias.setDate(hoy.getDate() + 3);
  const tareasProximasVencer = tareas.filter(
    (t) =>
      !t.completada &&
      new Date(t.fecha_vencimiento) >= hoy &&
      new Date(t.fecha_vencimiento) <= proximos3Dias
  ).length;

  // Tareas completadas por período
  const tareasCompletadasHoy = tareas.filter((t) => {
    if (!t.completada) return false;
    const fechaCompletada = new Date(t.fecha_vencimiento);
    return fechaCompletada >= hoy;
  }).length;

  const tareasCompletadasEstaSemana = tareas.filter((t) => {
    if (!t.completada) return false;
    const fechaCompletada = new Date(t.fecha_vencimiento);
    return fechaCompletada >= inicioSemana;
  }).length;

  const tareasCompletadasEsteMes = tareas.filter((t) => {
    if (!t.completada) return false;
    const fechaCompletada = new Date(t.fecha_vencimiento);
    return fechaCompletada >= inicioMes;
  }).length;

  // Promedio de tareas por día (últimos 30 días)
  const ultimos30Dias = new Date(hoy);
  ultimos30Dias.setDate(hoy.getDate() - 30);
  const tareasUltimos30Dias = tareas.filter(
    (t) => t.completada && new Date(t.fecha_vencimiento) >= ultimos30Dias
  ).length;
  const promedioTareasPorDia = tareasUltimos30Dias / 30;

  // Días consecutivos productivos (simulado - en una app real se trackearía el historial)
  const diasConsecutivosProductivos = Math.min(
    7,
    Math.floor(tareasCompletadasEstaSemana / 2)
  );

  // Distribución por día de la semana
  const diasSemana = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  const distribucionPorDiaSemana: { [key: string]: number } = {};
  diasSemana.forEach((dia) => {
    distribucionPorDiaSemana[dia] = 0;
  });

  tareas.forEach((tarea) => {
    if (tarea.completada) {
      const fecha = new Date(tarea.fecha_vencimiento);
      const diaSemana = diasSemana[fecha.getDay()];
      distribucionPorDiaSemana[diaSemana]++;
    }
  });

  // Tendencia semanal (últimas 4 semanas)
  const tendenciaSemanal: { [key: string]: number } = {};
  for (let i = 3; i >= 0; i--) {
    const inicioSemanaAnterior = new Date(hoy);
    inicioSemanaAnterior.setDate(hoy.getDate() - (hoy.getDay() + i * 7));
    const finSemanaAnterior = new Date(inicioSemanaAnterior);
    finSemanaAnterior.setDate(inicioSemanaAnterior.getDate() + 6);

    const tareasSemana = tareas.filter((t) => {
      if (!t.completada) return false;
      const fecha = new Date(t.fecha_vencimiento);
      return fecha >= inicioSemanaAnterior && fecha <= finSemanaAnterior;
    }).length;

    const semanaLabel = `Semana ${4 - i}`;
    tendenciaSemanal[semanaLabel] = tareasSemana;
  }

  return {
    totalTareas,
    tareasCompletadas,
    tareasPendientes,
    porcentajeCompletitud,
    tareasVencidas,
    tareasProximasVencer,
    tareasCompletadasHoy,
    tareasCompletadasEstaSemana,
    tareasCompletadasEsteMes,
    promedioTareasPorDia,
    diasConsecutivosProductivos,
    distribucionPorDiaSemana,
    tendenciaSemanal,
  };
};

export const getProductivityLevel = (porcentajeCompletitud: number): string => {
  if (porcentajeCompletitud >= 90) return "Excelente";
  if (porcentajeCompletitud >= 75) return "Muy Bueno";
  if (porcentajeCompletitud >= 60) return "Bueno";
  if (porcentajeCompletitud >= 40) return "Regular";
  return "Necesita Mejora";
};

export const getProductivityColor = (porcentajeCompletitud: number): string => {
  if (porcentajeCompletitud >= 90) return "success";
  if (porcentajeCompletitud >= 75) return "info";
  if (porcentajeCompletitud >= 60) return "primary";
  if (porcentajeCompletitud >= 40) return "warning";
  return "danger";
};
