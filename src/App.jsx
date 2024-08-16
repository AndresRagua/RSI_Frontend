import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './index.css'; // Asegúrate de que el archivo CSS esté correctamente importado
import Home from './pages/index/Home';
import Login from './pages/admin/Login';
import Admin from './pages/admin/Admin';
import Radio from './pages/admin/Radio';
import Programa from './pages/admin/Programa';
import Programacion from './pages/admin/Programacion';
import Artista from './pages/admin/Artista';
import Publicidad from './pages/admin/Publicidad';
import ServicioSocial from './pages/admin/Servicio';
import AudioServicio from './pages/admin/AudioServico';
import Usuario from './pages/admin/Usuario';
import HiloMusical from './pages/admin/Hilo';
import Administrador from './pages/admin/Administrador';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />
        <Route path="/admin/radio" element={<PrivateRoute><Radio /></PrivateRoute>} />
        <Route path="/admin/programa" element={<PrivateRoute><Programa /></PrivateRoute>} />
        <Route path="/admin/programacion" element={<PrivateRoute><Programacion /></PrivateRoute>} />
        <Route path="/admin/artista" element={<PrivateRoute><Artista /></PrivateRoute>} />
        <Route path="/admin/publicidad" element={<PrivateRoute><Publicidad /></PrivateRoute>} />
        <Route path="/admin/servicio" element={<PrivateRoute><ServicioSocial /></PrivateRoute>} />
        <Route path="/admin/audio_servicio" element={<PrivateRoute><AudioServicio /></PrivateRoute>} />
        <Route path="/admin/usuario" element={<PrivateRoute><Usuario /></PrivateRoute>} />
        <Route path="/admin/hilo" element={<PrivateRoute><HiloMusical /></PrivateRoute>} />
        <Route path="/admin/administrador" element={<PrivateRoute><Administrador /></PrivateRoute>} />
        {/*
        <Route path="/administrador" element={<Administrador />} />
        */}
      </Routes>
    </Router>
  );
};

export default App;
