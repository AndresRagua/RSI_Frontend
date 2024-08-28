import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'font-awesome/css/font-awesome.min.css';
import './static/css/styles.css';
import Home from './pages/index/Home';
import Television from './pages/index/Television';
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
import TelevisionCrud from './pages/admin/TelevisionCrud';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const App = () => {
  const [selectedRadio, setSelectedRadio] = useState(null);
  const [radios, setRadios] = useState([]);

  useEffect(() => {
    const fetchRadios = async () => {
      try {
        const response = await axios.get(`${API_URL}/radio/obtener`);
        setRadios(response.data);
        if (response.data.length > 0) {
          setSelectedRadio(response.data[0].id); // Seleccionar la primera radio por defecto
        }
      } catch (error) {
        console.error('Error al cargar las radios:', error);
      }
    };

    fetchRadios();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home radios={radios} selectedRadio={selectedRadio} setSelectedRadio={setSelectedRadio} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/television/:radioName" element={<Television radios={radios} selectedRadio={selectedRadio} setSelectedRadio={setSelectedRadio} />} />
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
        <Route path="/admin/television_crud" element={<PrivateRoute><TelevisionCrud /></PrivateRoute>} />

      </Routes>
    </Router>
  );
};

export default App;
