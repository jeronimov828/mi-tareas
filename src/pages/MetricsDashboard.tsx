import React from "react";
import { Tarea } from "../types/Tarea";
import {
  calculateMetrics,
  getProductivityLevel,
  getProductivityColor,
} from "../utils/metricsUtils";

interface Props {
  tareas: Tarea[];
  onLogout: () => void;
  onBackToTasks: () => void;
}

const MetricsDashboard: React.FC<Props> = ({
  tareas,
  onLogout,
  onBackToTasks,
}) => {
  const metrics = calculateMetrics(tareas);
  const productivityLevel = getProductivityLevel(metrics.porcentajeCompletitud);
  const productivityColor = getProductivityColor(metrics.porcentajeCompletitud);

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="card shadow-sm mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4 className="mb-0">📊 Dashboard de Métricas</h4>
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={onBackToTasks}
            >
              ← Volver a Tareas
            </button>
            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={onLogout}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* KPIs Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card bg-primary text-dark">
            <div className="card-body text-center">
              <h5 className="card-title">Total Tareas</h5>
              <h2 className="mb-0">{metrics.totalTareas}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-success text-dark">
            <div className="card-body text-center">
              <h5 className="card-title">Completadas</h5>
              <h2 className="mb-0">{metrics.tareasCompletadas}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-warning text-dark">
            <div className="card-body text-center">
              <h5 className="card-title">Pendientes</h5>
              <h2 className="mb-0">{metrics.tareasPendientes}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className={`card bg-${productivityColor} text-white`}>
            <div className="card-body text-center">
              <h5 className="card-title">Completitud</h5>
              <h2 className="mb-0">
                {metrics.porcentajeCompletitud.toFixed(1)}%
              </h2>
              <small>{productivityLevel}</small>
            </div>
          </div>
        </div>
      </div>

      {/* Alertas y Estado */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div
            className={`card ${
              metrics.tareasVencidas > 0 ? "border-danger" : "border-success"
            }`}
          >
            <div className="card-body text-center">
              <h5 className="card-title text-danger">⚠️ Tareas Vencidas</h5>
              <h3
                className={`text-${
                  metrics.tareasVencidas > 0 ? "danger" : "success"
                }`}
              >
                {metrics.tareasVencidas}
              </h3>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div
            className={`card ${
              metrics.tareasProximasVencer > 0
                ? "border-warning"
                : "border-success"
            }`}
          >
            <div className="card-body text-center">
              <h5 className="card-title text-warning">⏰ Próximas a Vencer</h5>
              <h3
                className={`text-${
                  metrics.tareasProximasVencer > 0 ? "warning" : "success"
                }`}
              >
                {metrics.tareasProximasVencer}
              </h3>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card border-info">
            <div className="card-body text-center">
              <h5 className="card-title text-info">🔥 Racha Productiva</h5>
              <h3 className="text-info">
                {metrics.diasConsecutivosProductivos} días
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Métricas de Productividad */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card">
            <div className="card-body text-center">
              <h5 className="card-title">📅 Completadas Hoy</h5>
              <h3 className="text-primary">{metrics.tareasCompletadasHoy}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card">
            <div className="card-body text-center">
              <h5 className="card-title">📊 Esta Semana</h5>
              <h3 className="text-info">
                {metrics.tareasCompletadasEstaSemana}
              </h3>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card">
            <div className="card-body text-center">
              <h5 className="card-title">📈 Este Mes</h5>
              <h3 className="text-success">
                {metrics.tareasCompletadasEsteMes}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Distribución por Día de la Semana */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">📊 Distribución por Día de la Semana</h5>
            </div>
            <div className="card-body">
              <div className="row">
                {Object.entries(metrics.distribucionPorDiaSemana).map(
                  ([dia, cantidad]) => (
                    <div key={dia} className="col-md-3 col-sm-6 mb-2">
                      <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded">
                        <span className="fw-bold">{dia}</span>
                        <span
                          className={`badge bg-${
                            cantidad > 0 ? "primary" : "secondary"
                          }`}
                        >
                          {cantidad}
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tendencia Semanal */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">📈 Tendencia Semanal (Últimas 4 Semanas)</h5>
            </div>
            <div className="card-body">
              <div className="row">
                {Object.entries(metrics.tendenciaSemanal).map(
                  ([semana, cantidad]) => (
                    <div key={semana} className="col-md-3 col-sm-6 mb-2">
                      <div className="text-center p-3 border rounded">
                        <h6 className="text-muted">{semana}</h6>
                        <h4
                          className={`text-${
                            cantidad > 0 ? "success" : "muted"
                          }`}
                        >
                          {cantidad}
                        </h4>
                        <div className="progress" style={{ height: "8px" }}>
                          <div
                            className="progress-bar bg-primary"
                            style={{
                              width: `${Math.min(
                                100,
                                (cantidad /
                                  Math.max(
                                    ...Object.values(metrics.tendenciaSemanal)
                                  )) *
                                  100
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Promedio de Productividad */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body text-center">
              <h5 className="card-title">
                🎯 Promedio de Tareas por Día (Últimos 30 días)
              </h5>
              <h2 className="text-primary">
                {metrics.promedioTareasPorDia.toFixed(1)}
              </h2>
              <p className="text-muted">
                Tareas completadas por día en promedio
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsDashboard;
