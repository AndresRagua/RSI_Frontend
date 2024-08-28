import { useState, useEffect } from "react";
import axios from "axios";
import AdminNavBar from "../../components/AdminNavBar";

const API_URL = process.env.REACT_APP_API_URL;

// Función para transformar la URL de Dropbox
const transformDropboxUrl = (url) => {
  if (!url) return ""; // Devuelve una cadena vacía si la URL no está definida
  return url.replace("www.dropbox.com", "dl.dropboxusercontent.com").replace("?dl=0", "");
};

function AudioServicio() {
  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState("");
  const [urlAudio, setUrlAudio] = useState("");
  const [fkServicio, setFkServicio] = useState("");
  const [audiosServicio, setAudiosServicio] = useState([]);
  const [serviciosSociales, setServiciosSociales] = useState([]);
  const [editingAudioServicio, setEditingAudioServicio] = useState(null);
  const [editingFields, setEditingFields] = useState({
    id_audio: "",
    nombre: "",
    fecha: "",
    url_audio: "",
    fk_servicio: ""
  });

  useEffect(() => {
    document.title = "Audios SS";
    fetchAudiosServicio();
    fetchServiciosSociales();
  }, []);

  const fetchAudiosServicio = async () => {
    try {
      const res = await axios.get(`${API_URL}/audio_servicio/`);
      setAudiosServicio(res.data);
    } catch (error) {
      console.error("Error fetching audios servicio:", error);
    }
  };

  const fetchServiciosSociales = async () => {
    try {
      const res = await axios.get(`${API_URL}/servicio_social/`);
      const serviciosAudio = res.data.filter(servicio => servicio.tipo === "audio");
      setServiciosSociales(serviciosAudio);
    } catch (error) {
      console.error("Error fetching servicios sociales:", error);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/audio_servicio/`, {
        nombre,
        fecha,
        url_audio: urlAudio,
        fk_servicio: parseInt(fkServicio)
      });
      fetchAudiosServicio();
      setNombre("");
      setFecha("");
      setUrlAudio("");
      setFkServicio("");
      e.target.reset();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Error adding audio servicio:", error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (editingAudioServicio) {
      try {
        await axios.put(`${API_URL}/audio_servicio/${editingAudioServicio.id_audio}`, {
          nombre: editingFields.nombre,
          fecha: editingFields.fecha,
          url_audio: editingFields.url_audio,
          fk_servicio: parseInt(editingFields.fk_servicio)
        });
        fetchAudiosServicio();
        setEditingAudioServicio(null);
        setEditingFields({
          id_audio: "",
          nombre: "",
          fecha: "",
          url_audio: "",
          fk_servicio: ""
        });
        e.target.reset();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (error) {
        console.error("Error editing audio servicio:", error);
      }
    }
  };

  const handleEdit = (audioServicio) => {
    setEditingFields({
      id_audio: audioServicio.id_audio,
      nombre: audioServicio.nombre,
      fecha: audioServicio.fecha,
      url_audio: audioServicio.url_audio,
      fk_servicio: audioServicio.fk_servicio
    });
    setEditingAudioServicio(audioServicio);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/audio_servicio/${id}`);
      fetchAudiosServicio();
    } catch (error) {
      console.error("Error deleting audio servicio:", error);
    }
  };

  return (
    <div className="flex flex-col bg-gray-100 min-h-screen">
      <AdminNavBar />
      <header className="mt-4 py-5 text-3xl font-bold text-gray-800 text-center">
        Administrar Audios de Servicio Social
      </header>

      <div className="px-4 md:px-8 lg:px-16">
        <div className="flex flex-col lg:flex-row lg:space-x-8">
          {/* Formulario para agregar un nuevo audio */}
          <form className="bg-white p-6 rounded-lg shadow-md mb-8 w-full lg:w-1/2" onSubmit={handleAddSubmit}>
            <h2 className="text-2xl mb-4 font-semibold text-gray-800 text-center">Agregar Audio</h2>
            <input
              type="text"
              placeholder="Nombre del Audio"
              value={nombre}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={(e) => setNombre(e.target.value)}
            />
            <input
              type="date"
              placeholder="Fecha"
              value={fecha}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={(e) => setFecha(e.target.value)}
            />
            <input
              type="text"
              placeholder="URL del Audio"
              value={urlAudio}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={(e) => setUrlAudio(e.target.value)}
            />
            <select
              value={fkServicio}
              onChange={(e) => setFkServicio(e.target.value)}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">Selecciona un Servicio Social</option>
              {serviciosSociales.map((servicio) => (
                <option key={servicio.id_servicio} value={servicio.id_servicio}>
                  {servicio.nombre}
                </option>
              ))}
            </select>
            <button className="w-full py-2 bg-yellow-500 text-white font-semibold rounded hover:bg-yellow-600 transition duration-300">
              Guardar
            </button>
          </form>

          {/* Formulario para actualizar un audio existente */}
          <form className="bg-white p-6 rounded-lg shadow-md mb-8 w-full lg:w-1/2" onSubmit={handleEditSubmit}>
            <h2 className="text-2xl mb-4 font-semibold text-gray-800 text-center">Actualizar Audio</h2>
            <input
              type="text"
              placeholder="Nombre del Audio"
              value={editingFields.nombre}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={(e) => setEditingFields({ ...editingFields, nombre: e.target.value })}
            />
            <input
              type="date"
              placeholder="Fecha"
              value={editingFields.fecha}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={(e) => setEditingFields({ ...editingFields, fecha: e.target.value })}
            />
            <input
              type="text"
              placeholder="URL del Audio"
              value={editingFields.url_audio}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={(e) => setEditingFields({ ...editingFields, url_audio: e.target.value })}
            />
            <select
              value={editingFields.fk_servicio}
              onChange={(e) => setEditingFields({ ...editingFields, fk_servicio: e.target.value })}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">Selecciona un Servicio Social</option>
              {serviciosSociales.map((servicio) => (
                <option key={servicio.id_servicio} value={servicio.id_servicio}>
                  {servicio.nombre}
                </option>
              ))}
            </select>
            <button className="w-full py-2 bg-yellow-500 text-white font-semibold rounded hover:bg-yellow-600 transition duration-300">
              Actualizar
            </button>
          </form>
        </div>
      </div>

      <div className="px-4 md:px-8 lg:px-16">
        <div className="mt-8 w-full">
          <h2 className="text-3xl mb-4 font-bold text-gray-800 text-center">Lista de Audios de Servicio Social</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-bold text-gray-600">ID</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-bold text-gray-600">Nombre</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-bold text-gray-600">Fecha</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-bold text-gray-600">Audio</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-bold text-gray-600">Servicio Social</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-bold text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {audiosServicio.map((audio) => (
                  <tr key={audio.id_audio}>
                    <td className="py-2 px-4 border-b text-center border-gray-200 text-gray-800">{audio.id_audio}</td>
                    <td className="py-2 px-4 border-b text-center border-gray-200 text-gray-800">{audio.nombre}</td>
                    <td className="py-2 px-4 border-b text-center border-gray-200 text-gray-800">{audio.fecha}</td>
                    <td className="py-2 px-4 border-b text-center border-gray-200 text-gray-800">
                      <audio controls preload="none" className="w-full max-w-md">
                        <source src={transformDropboxUrl(audio.url_audio)} type="audio/mpeg" />
                      </audio>
                    </td>
                    <td className="py-2 px-4 border-b text-center border-gray-200 text-gray-800">
                      {serviciosSociales.find(servicio => servicio.id_servicio === audio.fk_servicio)?.nombre}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200 text-gray-800 text-center">
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => handleEdit(audio)}
                          className="py-1 px-3 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-300"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(audio.id_audio)}
                          className="py-1 px-3 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition duration-300"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <footer className="mt-8 text-gray-600 text-center w-full py-4">
        <p>Derechos de Autor Reservados.</p>
        <p>Implementado por Dev Andres Ragua.</p>
      </footer>
    </div>
  );
}

export default AudioServicio;
