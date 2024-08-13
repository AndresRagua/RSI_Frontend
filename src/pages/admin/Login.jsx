import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/admin/login`, { email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/admin');
    } catch (error) {
      setError('Correo o contraseña incorrectos');
    }
  };

  useEffect(() => {
    document.title = "Ingreso Administrador";
  }, []);

  return (
    <div className="flex flex-col bg-gray-200 h-screen">
      <div className="flex justify-center items-center flex-grow">
        <div className="bg-secondary p-10 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl mb-6 font-semibold-important text-white text-center">Inicio de Sesión</h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-white">Correo Electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border-2 border-yellow-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-white">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border-2 border-yellow-300 rounded"
                required
              />
            </div>
            <button type="submit" className="w-full py-2 bg-yellow-500 text-white font-semibold rounded hover:bg-yellow-600">
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>

      <footer className="mt-8 text-gray-600 text-center w-full">
        <p>Derechos de Autor Reservados.</p>
        <p>Implementado por Dev Andres Ragua.</p>
      </footer>
    </div>
  );
};

export default Login;
