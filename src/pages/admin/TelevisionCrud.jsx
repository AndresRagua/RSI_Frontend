import { useState, useEffect } from "react";
import axios from "axios";
import AdminNavBar from "../../components/AdminNavBar";

const API_URL = process.env.REACT_APP_API_URL;

// Función para transformar la URL de Dropbox
const transformDropboxUrl = (url) => {
  if (!url) return ""; // Devuelve una cadena vacía si la URL no está definida
  return url.replace("www.dropbox.com", "dl.dropboxusercontent.com").replace("?dl=0", "");
};

function TelevisionCrud() {
  const [urlStream, setUrlStream] = useState("");
  const [segundoUrlStream, setSegundoUrlStream] = useState("");
  const [urlImageFondo, setUrlImageFondo] = useState("");
  const [segundoUrlImageFondo, setSegundoUrlImageFondo] = useState("");
  const [urlTwitter, setUrlTwitter] = useState("");
  const [urlInstagram, setUrlInstagram] = useState("");
  const [urlFacebook, setUrlFacebook] = useState("");
  const [fkRadio, setFkRadio] = useState("");
  const [televisiones, setTelevisiones] = useState([]);
  const [radios, setRadios] = useState([]);
  const [editingTelevision, setEditingTelevision] = useState(null);
  const [error, setError] = useState("");
  const [editingFields, setEditingFields] = useState({
    id_television: "",
    url_stream: "",
    segundo_url_stream: "",
    url_image_fondo: "",
    segundo_url_image_fondo: "",
    url_twitter: "",
    url_instagram: "",
    url_facebook: "",
    fk_radio: ""
  });

  useEffect(() => {
    document.title = "Televisión Crud";
    fetchTelevisiones();
    fetchRadios();
  }, []);

  const fetchTelevisiones = async () => {
    try {
      const res = await axios.get(`${API_URL}/television/obtener`);
      setTelevisiones(res.data);
    } catch (error) {
      console.error("Error fetching televisiones:", error);
      setError("Error fetching televisiones");
    }
  };

  const fetchRadios = async () => {
    try {
      const res = await axios.get(`${API_URL}/radio/obtener`);
      setRadios(res.data);
    } catch (error) {
      console.error("Error fetching radios:", error);
      setError("Error fetching radios");
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/television/agregar`, {
        url_stream: urlStream,
        segundo_url_stream: segundoUrlStream,
        url_image_fondo: urlImageFondo,
        segundo_url_image_fondo: segundoUrlImageFondo,
        url_twitter: urlTwitter,
        url_instagram: urlInstagram,
        url_facebook: urlFacebook,
        fk_radio: parseInt(fkRadio)
      });
      fetchTelevisiones();
      setUrlStream("");
      setSegundoUrlStream("");
      setUrlImageFondo("");
      setSegundoUrlImageFondo("");
      setUrlTwitter("");
      setUrlInstagram("");
      setUrlFacebook("");
      setFkRadio("");
      e.target.reset();
      setError("");  // Clear any previous errors
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error("Error adding television:", err);
      if (err.response) {
        setError(`Error al agregar la televisión: ${err.response.status} - ${err.response.data.detail}`);
      } else if (err.request) {
        setError("Error al agregar la televisión: No response received from server");
      } else {
        setError(`Error al agregar la televisión: ${err.message}`);
      }
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (editingTelevision) {
      try {
        await axios.put(`${API_URL}/television/${editingTelevision.id_television}`, {
          url_stream: editingFields.url_stream,
          segundo_url_stream: editingFields.segundo_url_stream,
          url_image_fondo: editingFields.url_image_fondo,
          segundo_url_image_fondo: editingFields.segundo_url_image_fondo,
          url_twitter: editingFields.url_twitter,
          url_instagram: editingFields.url_instagram,
          url_facebook: editingFields.url_facebook,
          fk_radio: parseInt(editingFields.fk_radio)
        });
        fetchTelevisiones();
        setEditingTelevision(null);
        setEditingFields({
          id_television: "",
          url_stream: "",
          segundo_url_stream: "",
          url_image_fondo: "",
          segundo_url_image_fondo: "",
          url_twitter: "",
          url_instagram: "",
          url_facebook: "",
          fk_radio: ""
        });
        e.target.reset();
        setError("");  // Clear any previous errors
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        console.error("Error updating television:", err);
        if (err.response) {
          setError(`Error al actualizar la televisión: ${err.response.status} - ${err.response.data.detail}`);
        } else if (err.request) {
          setError("Error al actualizar la televisión: No response received from server");
        } else {
          setError(`Error al actualizar la televisión: ${err.message}`);
        }
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/television/${id}`);
      fetchTelevisiones();
      setError("");  // Clear any previous errors
    } catch (err) {
      console.error("Error deleting television:", err);
      if (err.response) {
        setError(`Error al eliminar la televisión: ${err.response.status} - ${err.response.data.detail}`);
      } else if (err.request) {
        setError("Error al eliminar la televisión: No response received from server");
      } else {
        setError(`Error al eliminar la televisión: ${err.message}`);
      }
    }
  };

  const handleEdit = (television) => {
    setEditingFields({
      id_television: television.id_television,
      url_stream: television.url_stream,
      segundo_url_stream: television.segundo_url_stream,
      url_image_fondo: television.url_image_fondo,
      segundo_url_image_fondo: television.segundo_url_image_fondo,
      url_twitter: television.url_twitter,
      url_instagram: television.url_instagram,
      url_facebook: television.url_facebook,
      fk_radio: television.fk_radio
    });
    setEditingTelevision(television);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderError = (error) => {
    if (typeof error === "string") {
      return <div className="mt-4 text-red-500 text-center">{error}</div>;
    } else if (Array.isArray(error)) {
      return (
        <div className="mt-4 text-red-500 text-center">
          {error.map((err, index) => (
            <div key={index}>{err.msg}</div>
          ))}
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <div className="flex flex-col bg-gray-100 min-h-screen">
      {/* Navbar */}
      <AdminNavBar />

      <header className="mt-4 py-5 text-3xl font-bold text-gray-800 text-center">
        Administrar Televisiones
      </header>

      <div className="px-4 md:px-8 lg:px-16">
        <div className="flex flex-col lg:flex-row lg:space-x-8">
          {/* Formulario para agregar una nueva televisión */}
          <form className="bg-white p-6 rounded-lg shadow-md mb-8 w-full lg:w-1/2" onSubmit={handleAddSubmit}>
            <h2 className="text-2xl mb-4 font-semibold text-gray-800 text-center">Agregar Televisión</h2>
            <input
              type="text"
              placeholder="URL del Stream"
              value={urlStream}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={(e) => setUrlStream(e.target.value)}
            />
            <input
              type="text"
              placeholder="Segundo URL del Stream (Opcional)"
              value={segundoUrlStream}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={(e) => setSegundoUrlStream(e.target.value)}
            />
            <input
              type="text"
              placeholder="URL de la Imagen de Fondo"
              value={urlImageFondo}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={(e) => setUrlImageFondo(e.target.value)}
            />
            <input
              type="text"
              placeholder="Segunda URL de la Imagen de Fondo (Opcional)"
              value={segundoUrlImageFondo}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={(e) => setSegundoUrlImageFondo(e.target.value)}
            />
            <input
              type="text"
              placeholder="URL de Twitter"
              value={urlTwitter}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={(e) => setUrlTwitter(e.target.value)}
            />
            <input
              type="text"
              placeholder="URL de Instagram"
              value={urlInstagram}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={(e) => setUrlInstagram(e.target.value)}
            />
            <input
              type="text"
              placeholder="URL de Facebook"
              value={urlFacebook}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={(e) => setUrlFacebook(e.target.value)}
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
            {renderError(error)}
          </form>

          {/* Formulario para actualizar una televisión existente */}
          <form className="bg-white p-6 rounded-lg shadow-md mb-8 w-full lg:w-1/2" onSubmit={handleEditSubmit}>
            <h2 className="text-2xl mb-4 font-semibold text-gray-800 text-center">Actualizar Televisión</h2>
            <input
              type="text"
              placeholder="URL del Stream"
              value={editingFields.url_stream}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={(e) => setEditingFields({ ...editingFields, url_stream: e.target.value })}
            />
            <input
              type="text"
              placeholder="Segundo URL del Stream (Opcional)"
              value={editingFields.segundo_url_stream}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={(e) => setEditingFields({ ...editingFields, segundo_url_stream: e.target.value })}
            />
            <input
              type="text"
              placeholder="URL de la Imagen de Fondo"
              value={editingFields.url_image_fondo}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={(e) => setEditingFields({ ...editingFields, url_image_fondo: e.target.value })}
            />
            <input
              type="text"
              placeholder="Segunda URL de la Imagen de Fondo (Opcional)"
              value={editingFields.segundo_url_image_fondo}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={(e) => setEditingFields({ ...editingFields, segundo_url_image_fondo: e.target.value })}
            />
            <input
              type="text"
              placeholder="URL de Twitter"
              value={editingFields.url_twitter}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={(e) => setEditingFields({ ...editingFields, url_twitter: e.target.value })}
            />
            <input
              type="text"
              placeholder="URL de Instagram"
              value={editingFields.url_instagram}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={(e) => setEditingFields({ ...editingFields, url_instagram: e.target.value })}
            />
            <input
              type="text"
              placeholder="URL de Facebook"
              value={editingFields.url_facebook}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={(e) => setEditingFields({ ...editingFields, url_facebook: e.target.value })}
            />
            <select
              value={editingFields.fk_radio}
              onChange={(e) => setEditingFields({ ...editingFields, fk_radio: e.target.value })}
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
            {renderError(error)}
          </form>
        </div>
      </div>

      <div className="px-4 md:px-8 lg:px-16">
        <div className="mt-8 w-full">
          <h2 className="text-3xl mb-4 font-bold text-gray-800 text-center">Lista de Televisiones</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-bold text-gray-600">ID</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600">Stream</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600">Segundo Stream</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600">Imagen de Fondo</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600">Segunda Imagen de Fondo</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600">Twitter</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600">Instagram</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600">Facebook</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600">Radio</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {televisiones.map((television) => (
                  <tr key={television.id_television}>
                    <td className="py-2 px-4 border-b text-center border-gray-200 text-gray-800">{television.id_television}</td>
                    <td className="py-2 px-4 border-b text-center border-gray-200 text-gray-800">
                      <a href={transformDropboxUrl(television.url_stream)} className="text-blue-500 hover:underline" target="_blank" rel="noreferrer">{television.url_stream}</a>
                    </td>
                    <td className="py-2 px-4 border-b text-center border-gray-200 text-gray-800">
                      <a href={transformDropboxUrl(television.segundo_url_stream)} className="text-blue-500 hover:underline" target="_blank" rel="noreferrer">{television.segundo_url_stream}</a>
                    </td>
                    <td className="py-2 px-4 border-b text-center border-gray-200 text-gray-800">
                      <img src={transformDropboxUrl(television.url_image_fondo)} alt="Imagen de Fondo" className="w-20 h-20 object-cover rounded-full mx-auto" />
                    </td>
                    <td className="py-2 px-4 border-b text-center border-gray-200 text-gray-800">
                      <img src={transformDropboxUrl(television.segundo_url_image_fondo)} alt="Segunda Imagen de Fondo" className="w-20 h-20 object-cover rounded-full mx-auto" />
                    </td>
                    <td className="py-2 px-4 border-b text-center border-gray-200 text-gray-800">
                      <a href={television.url_twitter} className="text-blue-500 hover:underline" target="_blank" rel="noreferrer">{television.url_twitter}</a>
                    </td>
                    <td className="py-2 px-4 border-b text-center border-gray-200 text-gray-800">
                      <a href={television.url_instagram} className="text-blue-500 hover:underline" target="_blank" rel="noreferrer">{television.url_instagram}</a>
                    </td>
                    <td className="py-2 px-4 border-b text-center border-gray-200 text-gray-800">
                      <a href={television.url_facebook} className="text-blue-500 hover:underline" target="_blank" rel="noreferrer">{television.url_facebook}</a>
                    </td>
                    <td className="py-2 px-4 border-b text-center border-gray-200 text-gray-800">
                      {radios.find(radio => radio.id === television.fk_radio)?.nombre}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200 text-gray-800 text-center">
                      <button
                        onClick={() => handleEdit(television)}
                        className="mr-2 py-1 px-3 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-300"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(television.id_television)}
                        className="py-1 px-3 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition duration-300"
                      >
                        Eliminar
                      </button>
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

export default TelevisionCrud;
