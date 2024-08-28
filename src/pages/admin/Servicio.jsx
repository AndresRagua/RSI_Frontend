import { useState, useEffect } from "react";
import axios from "axios";
import AdminNavBar from "../../components/AdminNavBar";

const API_URL = process.env.REACT_APP_API_URL;

// Función para transformar la URL de Dropbox
const transformDropboxUrl = (url) => {
  return url?.replace("www.dropbox.com", "dl.dropboxusercontent.com").replace("?dl=0", "");
};

function ServicioSocial() {
  const [nombre, setNombre] = useState("");
  const [informacion, setInformacion] = useState("");
  const [urlImage, setUrlImage] = useState("");
  const [urlPagina, setUrlPagina] = useState("");
  const [tipo, setTipo] = useState("");
  const [nombreAudios, setNombreAudios] = useState("");
  const [fkRadio, setFkRadio] = useState("");
  const [serviciosSociales, setServiciosSociales] = useState([]);
  const [radios, setRadios] = useState([]);
  const [editingServicioSocial, setEditingServicioSocial] = useState(null);
  const [editingFields, setEditingFields] = useState({
    id_servicio: "",
    nombre: "",
    informacion: "",
    urlImage: "",
    urlPagina: "",
    tipo: "",
    nombreAudios: "",
    fkRadio: ""
  });

  useEffect(() => {
    document.title = "Servicios sociales";
    fetchServiciosSociales();
    fetchRadios();
  }, []);

  const fetchServiciosSociales = async () => {
    try {
      const res = await axios.get(`${API_URL}/servicio_social/`);
      setServiciosSociales(res.data);
    } catch (error) {
      console.error("Error fetching servicios sociales:", error);
    }
  };

  const fetchRadios = async () => {
    try {
      const res = await axios.get(`${API_URL}/radio/obtener`);
      setRadios(res.data);
    } catch (error) {
      console.error("Error fetching radios:", error);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/servicio_social/`, {
        nombre,
        informacion,
        url_image: urlImage,
        url_pagina: urlPagina,
        tipo,
        nombre_audios: nombreAudios,
        fk_radio: parseInt(fkRadio)
      });
      fetchServiciosSociales();
      setNombre("");
      setInformacion("");
      setUrlImage("");
      setUrlPagina("");
      setTipo("");
      setNombreAudios("");
      setFkRadio("");
      e.target.reset();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Error adding servicio social:", error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (editingServicioSocial) {
      try {
        await axios.put(`${API_URL}/servicio_social/${editingServicioSocial.id_servicio}`, {
          nombre: editingFields.nombre,
          informacion: editingFields.informacion,
          url_image: editingFields.urlImage,
          url_pagina: editingFields.urlPagina,
          tipo: editingFields.tipo,
          nombre_audios: editingFields.nombreAudios,
          fk_radio: parseInt(editingFields.fkRadio)
        });
        fetchServiciosSociales();
        setEditingServicioSocial(null);
        setEditingFields({
          nombre: "",
          informacion: "",
          urlImage: "",
          urlPagina: "",
          tipo: "",
          nombreAudios: "",
          fkRadio: ""
        });
        e.target.reset();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (error) {
        console.error("Error editing servicio social:", error);
      }
    }
  };

  const handleEdit = (servicioSocial) => {
    setEditingFields({
      id_servicio: servicioSocial.id_servicio,
      nombre: servicioSocial.nombre,
      informacion: servicioSocial.informacion,
      urlImage: servicioSocial.url_image,
      urlPagina: servicioSocial.url_pagina,
      tipo: servicioSocial.tipo,
      nombreAudios: servicioSocial.nombre_audios,
      fkRadio: servicioSocial.fk_radio
    });
    setEditingServicioSocial(servicioSocial);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/servicio_social/${id}`);
      fetchServiciosSociales();
    } catch (error) {
      console.error("Error deleting servicio social:", error);
    }
  };

  return (
    <div className="flex flex-col bg-gray-100 min-h-screen">
      {/* Navbar */}
      <AdminNavBar />

      <header className="mt-4 py-5 text-3xl font-bold text-gray-800 text-center">
        Administrar Servicios Sociales
      </header>

      <div className="px-4 md:px-8 lg:px-16">
        <div className="flex flex-col lg:flex-row lg:space-x-8">
          {/* Formulario para agregar */}
          <form className="bg-white p-6 rounded-lg shadow-md mb-8 w-full lg:w-1/2" onSubmit={handleAddSubmit}>
            <h2 className="text-2xl mb-4 font-semibold text-gray-800 text-center">Agregar Servicio Social</h2>
            <input
              type="text"
              placeholder="Nombre del Servicio Social"
              value={nombre}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={(e) => setNombre(e.target.value)}
            />
            <textarea
              placeholder="Información del Servicio Social"
              value={informacion}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={(e) => setInformacion(e.target.value)}
            />
            <input
              type="text"
              placeholder="URL de la Imagen"
              value={urlImage}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={(e) => setUrlImage(e.target.value)}
            />
            <input
              type="text"
              placeholder="URL de la Página"
              value={urlPagina}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={(e) => setUrlPagina(e.target.value)}
            />
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">Selecciona el Tipo</option>
              <option value="audio">Audio</option>
              <option value="estatico">Estático</option>
            </select>
            <input
              type="text"
              placeholder="Nombre Audios (Opcional)"
              value={nombreAudios}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={(e) => setNombreAudios(e.target.value)}
            />
            <select
              value={fkRadio}
              onChange={(e) => setFkRadio(e.target.value)}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">Selecciona una Radio</option>
              {radios.map((radio) => (
                <option key={radio.id} value={radio.id}>
                  {radio.nombre}
                </option>
              ))}
            </select>
            <button className="w-full py-2 bg-yellow-500 text-white font-semibold rounded hover:bg-yellow-600 transition duration-300">
              Guardar
            </button>
          </form>

          {/* Formulario para actualizar */}
          <form className="bg-white p-6 rounded-lg shadow-md mb-8 w-full lg:w-1/2" onSubmit={handleEditSubmit}>
            <h2 className="text-2xl mb-4 font-semibold text-gray-800 text-center">Actualizar Servicio Social</h2>
            <input
              type="text"
              placeholder="Nombre del Servicio Social"
              value={editingFields.nombre}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={(e) => setEditingFields({ ...editingFields, nombre: e.target.value })}
            />
            <textarea
              placeholder="Información del Servicio Social"
              value={editingFields.informacion}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={(e) => setEditingFields({ ...editingFields, informacion: e.target.value })}
            />
            <input
              type="text"
              placeholder="URL de la Imagen"
              value={editingFields.urlImage}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={(e) => setEditingFields({ ...editingFields, urlImage: e.target.value })}
            />
            <input
              type="text"
              placeholder="URL de la Página"
              value={editingFields.urlPagina}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={(e) => setEditingFields({ ...editingFields, urlPagina: e.target.value })}
            />
            <select
              value={editingFields.tipo}
              onChange={(e) => setEditingFields({ ...editingFields, tipo: e.target.value })}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">Selecciona el Tipo</option>
              <option value="audio">Audio</option>
              <option value="estatico">Estático</option>
            </select>
            <input
              type="text"
              placeholder="Nombre Audios (Opcional)"
              value={editingFields.nombreAudios}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={(e) => setEditingFields({ ...editingFields, nombreAudios: e.target.value })}
            />
            <select
              value={editingFields.fkRadio}
              onChange={(e) => setEditingFields({ ...editingFields, fkRadio: e.target.value })}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">Selecciona una Radio</option>
              {radios.map((radio) => (
                <option key={radio.id} value={radio.id}>
                  {radio.nombre}
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
    <h2 className="text-3xl mb-4 font-bold text-gray-800 text-center">Lista de Servicios Sociales</h2>
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg shadow-md">
        <thead>
          <tr>
            <th className="py-3 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-bold text-gray-600">ID</th>
            <th className="py-3 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600">Nombre</th>
            <th className="py-3 px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 w-1/3">Información</th>
            <th className="py-3 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600 w-24">Imagen</th>
            <th className="py-3 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600">Página</th>
            <th className="py-3 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600">Tipo</th>
            <th className="py-3 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600">Nombre Audio</th>
            <th className="py-3 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600">Radio</th>
            <th className="py-3 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600 w-32">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {serviciosSociales.map((servicio) => (
            <tr key={servicio.id_servicio}>
              <td className="py-3 px-4 border-b text-center border-gray-200 text-gray-800">{servicio.id_servicio}</td>
              <td className="py-3 px-4 border-b text-center border-gray-200 text-gray-800">{servicio.nombre}</td>
              <td className="py-3 px-4 border-b text-left border-gray-200 text-gray-800 w-1/3">{servicio.informacion}</td>
              <td className="py-3 px-4 border-b text-center border-gray-200 text-gray-800">
                <img src={transformDropboxUrl(servicio.url_image)} alt="Imagen del Servicio" className="w-20 h-20 object-cover rounded" />
              </td>
              <td className="py-3 px-4 border-b text-center border-gray-200 text-gray-800">{servicio.url_pagina}</td>
              <td className="py-3 px-4 border-b text-center border-gray-200 text-gray-800">{servicio.tipo}</td>
              <td className="py-3 px-4 border-b text-center border-gray-200 text-gray-800">{servicio.nombre_audios}</td>
              <td className="py-3 px-4 border-b text-center border-gray-200 text-gray-800">
                {radios.find(radio => radio.id === servicio.fk_radio)?.nombre}
              </td>
              <td className="py-3 px-4 border-b border-gray-200 text-gray-800 text-center w-32">
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => handleEdit(servicio)}
                    className="py-1 px-3 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-300"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(servicio.id_servicio)}
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

export default ServicioSocial;
