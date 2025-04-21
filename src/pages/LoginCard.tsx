import React from "react";
import LoginForm from "./LoginForm";

interface Props {
  onLoginSuccess: () => void;
}

const LoginCard: React.FC<Props> = ({ onLoginSuccess }) => {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "10px",
        padding: "20px",
        maxWidth: "350px",
        marginTop: "12%",
        marginLeft: "40%",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        backgroundColor: "white",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Iniciar Sesión</h2>
      <LoginForm onLoginSuccess={onLoginSuccess} />
    </div>
  );
};

export default LoginCard;
