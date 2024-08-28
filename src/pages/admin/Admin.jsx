import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminNavBar from '../../components/AdminNavBar';

const Admin = () => {

  useEffect(() => {
    document.title = "Panel de Administración";
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar */}
      <AdminNavBar />

      {/* Header */}
      <header className="mt-8 mb-4 text-2xl md:text-4xl font-extrabold text-gray-800 text-center">
        Panel de Administración Radio Songs International
      </header>

      {/* Main content */}
      <main className="flex justify-center items-center flex-grow px-4">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-5xl grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { path: "/admin/radio", label: "Radio" },
            { path: "/admin/programa", label: "Programa" },
            { path: "/admin/programacion", label: "Programación" },
            { path: "/admin/artista", label: "Artistas" },
            { path: "/admin/publicidad", label: "Publicidad" },
            { path: "/admin/servicio", label: "Servicio Social" },
            { path: "/admin/audio_servicio", label: "Audio Servicio" },
            { path: "/admin/usuario", label: "Usuarios" },
            { path: "/admin/hilo", label: "Hilo Musical" },
            { path: "/admin/administrador", label: "Administrador" },
            { path: "/admin/television_crud", label: "Television" },
          ].map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className="bg-yellow-500 text-white text-lg font-bold py-3 px-4 rounded-lg shadow-md hover:bg-yellow-600 hover:shadow-lg transition duration-300 ease-in-out text-center no-underline"
            >
              {label}
            </Link>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-6 py-4 text-gray-600 text-center border-t border-gray-300">
        <p>Derechos de Autor Reservados.</p>
        <p>Implementado por Dev Andres Ragua.</p>
      </footer>
    </div>
  );
};

export default Admin;
