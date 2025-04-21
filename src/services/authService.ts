import axios from "axios";

interface LoginResponse {
  item: {
    token: string;
    usuario: {
      id: number;
      nombre: string;
      email: string;
    };
  };
  status: boolean;
  message: string;
}

export const login = async (
  nombre: string,
  contrasena: string
): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(
    "http://localhost:4000/api/login",
    {
      nombre,
      contrasena,
    }
  );

  return response.data;
};
