import { Tarea } from "../types/Tarea";

interface Props {
  tareas: Tarea[];
  onToggleCompletada: (id: number, completada: boolean) => void;
  onLogout: () => void;
  onAbrirModalEditar: (id: number) => void;
  onAbrirModalCrear: () => void;
}

const TablaTareas: React.FC<Props> = ({
  tareas,
  onToggleCompletada,
  onLogout,
  onAbrirModalEditar,
  onAbrirModalCrear,
}) => {
  return (
    <div>
      <h5 className="card-title mb-0">
        Tareas
        <button
          type="button"
          id="cerrar"
          className="btn btn-danger"
          onClick={onLogout}
        >
          Cerrar Sesión
        </button>
      </h5>
      <table className="table table-striped my-0 dataTable no-footer" id="tabla" >
        <thead>
          <tr>
            <th>Numero</th>
            <th>Titulo</th>
            <th className="d-none d-xl-table-cell">Descripcion</th>
            <th className="d-none d-xl-table-cell">Fecha Vencimiento</th>
            <th className="d-none d-xl-table-cell">Estado</th>
            <th className="d-none d-xl-table-cell">Editar</th>
          </tr>
        </thead>
        <tbody>
          {tareas.map((tarea) => (
            <tr key={tarea.id}>
              <td>{tarea.id}</td>
              <td>{tarea.titulo}</td>
              <td className="d-none d-xl-table-cell">{tarea.descripcion}</td>
              <td className="d-none d-xl-table-cell">
                {new Date(tarea.fecha_vencimiento).toLocaleDateString()}
              </td>
              <td className="d-none d-xl-table-cell">
                <div className="form-check form-switch">
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
                  <label
                    className="form-check-label"
                    htmlFor={`estadoTareas-${tarea.id}`}
                  >
                    {tarea.completada ? "Completada" : "Pendiente"}
                  </label>
                </div>
              </td>
              <td className="d-none d-xl-table-cell">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => onAbrirModalEditar(tarea.id)}
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        type="button"
        id="crear"
        className="btn btn-secondary"
        onClick={onAbrirModalCrear}
      >
        Crear Nueva Tarea
      </button>
    </div>
  );
};

export default TablaTareas;
