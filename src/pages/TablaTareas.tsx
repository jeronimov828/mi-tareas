import { Tarea } from "../types/Tarea";

interface Props {
  tareas: Tarea[];
  onToggleCompletada: (id: number, completada: boolean) => void;
  onLogout: () => void;
  onAbrirModalEditar: (id: number) => void;
  onAbrirModalCrear: () => void;
  onShowMetrics: () => void;
}

const TablaTareas: React.FC<Props> = ({
  tareas,
  onToggleCompletada,
  onLogout,
  onAbrirModalEditar,
  onAbrirModalCrear,
  onShowMetrics,
}) => {
  return (
    <div>
      {/* Botón Cerrar Sesión flotante */}
      <div className="d-flex justify-content-end mb-3">
        <button
          type="button"
          className="btn btn-danger btn-sm"
          onClick={onLogout}
        >
          Cerrar Sesión
        </button>
      </div>

      <div className="card shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table
              className="table table-hover table-striped align-middle mb-0"
              id="tabla"
            >
              <thead className="table-light">
                <tr>
                  <th colSpan={4} className="p-2">
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="mb-0">Tareas</h6>
                      <div className="d-flex" style={{ gap: "2px" }}>
                        <button
                          type="button"
                          id="crear"
                          className="btn btn-primary btn-sm text-nowrap"
                          onClick={onAbrirModalCrear}
                        >
                          Crear Nueva Tarea
                        </button>
                        <button
                          type="button"
                          className="btn btn-info btn-sm text-nowrap"
                          onClick={onShowMetrics}
                        >
                          📊 Métricas
                        </button>
                      </div>
                    </div>
                  </th>
                </tr>
                <tr>
                  <th style={{ width: 90 }}>Número</th>
                  <th>Título</th>
                  <th className="d-none d-xl-table-cell">Descripción</th>
                  <th className="d-none d-xl-table-cell">Fecha Vencimiento</th>
                  <th className="d-none d-xl-table-cell">Estado</th>
                  <th className="d-none d-xl-table-cell" style={{ width: 100 }}>
                    Editar
                  </th>
                </tr>
              </thead>
              <tbody>
                {tareas.map((tarea) => (
                  <tr
                    key={tarea.id}
                    className={tarea.completada ? "table-success" : undefined}
                  >
                    <td className="fw-semibold">{tarea.id}</td>
                    <td className="text-break">{tarea.titulo}</td>
                    <td className="d-none d-xl-table-cell text-muted text-break">
                      {tarea.descripcion}
                    </td>
                    <td className="d-none d-xl-table-cell text-nowrap">
                      {new Date(tarea.fecha_vencimiento).toLocaleDateString()}
                    </td>
                    <td className="d-none d-xl-table-cell">
                      <div className="d-flex align-items-center gap-2">
                        <span
                          className={`badge ${
                            tarea.completada
                              ? "bg-success"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {tarea.completada ? "Completada" : "Pendiente"}
                        </span>
                        <div className="form-check form-switch m-0">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id={`estadoTareas-${tarea.id}`}
                            checked={tarea.completada}
                            onChange={() =>
                              onToggleCompletada(tarea.id, !tarea.completada)
                            }
                          />
                        </div>
                      </div>
                    </td>
                    <td className="d-none d-xl-table-cell">
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => onAbrirModalEditar(tarea.id)}
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TablaTareas;
