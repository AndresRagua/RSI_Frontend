import React from 'react';
import { Link } from 'react-router-dom';
import AdminNavBar from '../../components/AdminNavBar'; // Asegúrate de que la ruta sea correcta

const Admin = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-200">
      {/* Navbar */}
      <AdminNavBar />

      {/* Header */}
      <header className="mt-4 pt-5 pb-4 text-3xl font-bold text-gray-800 text-center">
        Panel de Administración Radio Songs International
      </header>

      {/* Main content */}
      <div className="flex justify-center items-center flex-grow">
        <div className="bg-white p-6 rounded shadow-md w-full max-w-4xl grid grid-cols-1 gap-6 md:grid-cols-3">
          <Link to="/admin/radio" className="btn btn-warning text-white">
            <span className="font-semibold-important text-border-black">Radio</span>
          </Link>
          <Link to="/admin/programa" className="btn btn-warning text-white">
            <span className="font-semibold-important text-border-black">Programa</span>
          </Link>
          <Link to="/admin/programacion" className="btn btn-warning text-white">
            <span className="font-semibold-important text-border-black">Programación</span>
          </Link>
          <Link to="/admin/artista" className="btn btn-warning text-white">
            <span className="font-semibold-important text-border-black">Artistas</span>
          </Link>
          <Link to="/admin/publicidad" className="btn btn-warning text-white">
            <span className="font-semibold-important text-border-black">Publicidad</span>
          </Link>
          <Link to="/admin/servicio" className="btn btn-warning text-white">
            <span className="font-semibold-important text-border-black">Servicio Social</span>
          </Link>
          <Link to="/admin/audio_servicio" className="btn btn-warning text-white">
            <span className="font-semibold-important text-border-black">Audio Servicio</span>
          </Link>
          <Link to="/admin/usuario" className="btn btn-warning text-white">
            <span className="font-semibold-important text-border-black">Usuarios</span>
          </Link>
          <Link to="/admin/hilo" className="btn btn-warning text-white">
            <span className="font-semibold-important text-border-black">Hilo Musical</span>
          </Link>
          <Link to="/admin/administrador" className="btn btn-warning text-white">
            <span className="font-semibold-important text-border-black">Administrador</span>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-6 text-gray-600 text-center">
        <p>Derechos de Autor Reservados.</p>
        <p>Implementado por Dev Andres Ragua.</p>
      </footer>
    </div>
  );
};

export default Admin;
