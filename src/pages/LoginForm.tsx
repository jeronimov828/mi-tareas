import React, { useState } from "react";
import { login } from "../services/authService";
import Swal from "sweetalert2";

interface Props {
  onLoginSuccess: () => void;
}

const LoginForm: React.FC<Props> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await login(email, password);

      if (data.status) {
        Swal.fire({
          icon: "success",
          title: "Inicio Exitoso",
          text: "Redirigiendo.....",
          confirmButtonText: "Redirigir",
        }).then((result) => {
          if (result.isConfirmed) {
            localStorage.setItem("token", data.item.token);
            setMessage(data.message); // "Login exitoso"
            onLoginSuccess();
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error en el inicio de sesion",
          text: "contraseña o usuario incorrectos",
          confirmButtonText: "Aceptar",
        })
      }
    } catch (error: any) {
      setMessage("Error al conectar con el servidor");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Correo electrónico</label>
        <input
          type="text"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Contraseña</label>
        <input
          type="text"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Iniciar Sesión
      </button>
      {message && <div className="mt-3 alert alert-info">{message}</div>}
    </form>
  );
};

export default LoginForm;
