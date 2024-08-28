import { useState, useEffect } from "react";
import axios from "axios";
import AdminNavBar from "../../components/AdminNavBar";

const API_URL = process.env.REACT_APP_API_URL;

// Función para transformar la URL de Dropbox
const transformDropboxUrl = (url) => {
  return url.replace("www.dropbox.com", "dl.dropboxusercontent.com").replace("?dl=0", "");
};

function Publicidad() {
  const [nombre, setNombre] = useState("");
  const [informacion, setInformacion] = useState("");
  const [urlImage, setUrlImage] = useState("");
  const [urlTwitter, setUrlTwitter] = useState("");
  const [urlInstagram, setUrlInstagram] = useState("");
  const [urlFacebook, setUrlFacebook] = useState("");
  const [fkRadio, setFkRadio] = useState("");
  const [publicidades, setPublicidades] = useState([]);
  const [radios, setRadios] = useState([]);
  const [editingPublicidad, setEditingPublicidad] = useState(null);
  const [editingFields, setEditingFields] = useState({
    id_publicidad: "",
    nombre: "",
    informacion: "",
    urlImage: "",
    urlTwitter: "",
    urlInstagram: "",
    urlFacebook: "",
    fkRadio: ""
  });

  useEffect(() => {
    document.title = "Publicidades";
    fetchPublicidades();
    fetchRadios();
  }, []);

  const fetchPublicidades = async () => {
    const res = await axios.get(`${API_URL}/publicidad/`);
    setPublicidades(res.data);
  };

  const fetchRadios = async () => {
    const res = await axios.get(`${API_URL}/radio/obtener`);
    setRadios(res.data);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${API_URL}/publicidad/`, {
      nombre,
      informacion,
      url_image: urlImage,
      url_twitter: urlTwitter,
      url_instagram: urlInstagram,
      url_facebook: urlFacebook,
      fk_radio: parseInt(fkRadio)
    });
    fetchPublicidades();
    setNombre("");
    setInformacion("");
    setUrlImage("");
    setUrlTwitter("");
    setUrlInstagram("");
    setUrlFacebook("");
    setFkRadio("");
    e.target.reset();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (editingPublicidad) {
      await axios.put(`${API_URL}/publicidad/${editingPublicidad.id_publicidad}`, {
        nombre: editingFields.nombre,
        informacion: editingFields.informacion,
        url_image: editingFields.urlImage,
        url_twitter: editingFields.urlTwitter,
        url_instagram: editingFields.urlInstagram,
        url_facebook: editingFields.urlFacebook,
        fk_radio: parseInt(editingFields.fkRadio)
      });
      fetchPublicidades();
      setEditingPublicidad(null);
      setEditingFields({
        id_publicidad: "",
        nombre: "",
        informacion: "",
        urlImage: "",
        urlTwitter: "",
        urlInstagram: "",
        urlFacebook: "",
        fkRadio: ""
      });
      e.target.reset();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleEdit = (publicidad) => {
    setEditingFields({
      id_publicidad: publicidad.id_publicidad,
      nombre: publicidad.nombre,
      informacion: publicidad.informacion,
      urlImage: publicidad.url_image,
      urlTwitter: publicidad.url_twitter,
      urlInstagram: publicidad.url_instagram,
      urlFacebook: publicidad.url_facebook,
      fkRadio: publicidad.fk_radio
    });
    setEditingPublicidad(publicidad);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/publicidad/${id}`);
    fetchPublicidades();
  };

  return (
    <div className="flex flex-col bg-gray-100 min-h-screen">
      {/* Navbar */}
      <AdminNavBar />

      <header className="mt-4 py-5 text-3xl font-bold text-gray-800 text-center">
        Administrar Publicidades
      </header>

      <div className="px-4 md:px-8 lg:px-16">
        <div className="flex flex-col lg:flex-row lg:space-x-8">
          {/* Formulario para agregar */}
          <form className="bg-white p-6 rounded-lg shadow-md mb-8 w-full lg:w-1/2" onSubmit={handleAddSubmit}>
            <h2 className="text-2xl mb-4 font-semibold text-gray-800 text-center">Agregar Publicidad</h2>
            <input
              type="text"
              placeholder="Nombre de la Publicidad"
              value={nombre}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={(e) => setNombre(e.target.value)}
            />
            <textarea
              placeholder="Información de la Publicidad"
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
          </form>

          {/* Formulario para actualizar */}
          <form className="bg-white p-6 rounded-lg shadow-md mb-8 w-full lg:w-1/2" onSubmit={handleEditSubmit}>
            <h2 className="text-2xl mb-4 font-semibold text-gray-800 text-center">Actualizar Publicidad</h2>
            <input
              type="text"
              placeholder="Nombre de la Publicidad"
              value={editingFields.nombre}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={(e) => setEditingFields({ ...editingFields, nombre: e.target.value })}
            />
            <textarea
              placeholder="Información de la Publicidad"
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
              placeholder="URL de Twitter"
              value={editingFields.urlTwitter}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={(e) => setEditingFields({ ...editingFields, urlTwitter: e.target.value })}
            />
            <input
              type="text"
              placeholder="URL de Instagram"
              value={editingFields.urlInstagram}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={(e) => setEditingFields({ ...editingFields, urlInstagram: e.target.value })}
            />
            <input
              type="text"
              placeholder="URL de Facebook"
              value={editingFields.urlFacebook}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={(e) => setEditingFields({ ...editingFields, urlFacebook: e.target.value })}
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
          <h2 className="text-3xl mb-4 font-bold text-gray-800 text-center">Lista de Publicidades</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr>
                  <th className="py-3 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-bold text-gray-600">ID</th>
                  <th className="py-3 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600">Nombre</th>
                  <th className="py-3 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600">Información</th>
                  <th className="py-3 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600">Imagen</th>
                  <th className="py-3 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600">Twitter</th>
                  <th className="py-3 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600">Instagram</th>
                  <th className="py-3 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600">Facebook</th>
                  <th className="py-3 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600">Radio</th>
                  <th className="py-3 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {publicidades.map((publicidad) => (
                  <tr key={publicidad.id_publicidad}>
                    <td className="py-3 px-4 border-b text-center border-gray-200 text-gray-800">{publicidad.id_publicidad}</td>
                    <td className="py-3 px-4 border-b text-center border-gray-200 text-gray-800">{publicidad.nombre}</td>
                    <td className="py-3 px-4 border-b text-center border-gray-200 text-gray-800">{publicidad.informacion}</td>
                    <td className="py-3 px-4 border-b text-center border-gray-200 text-gray-800">
                      <img src={transformDropboxUrl(publicidad.url_image)} alt="Imagen de la Publicidad" className="w-24 h-24 object-cover rounded" />
                    </td>
                    <td className="py-3 px-4 border-b text-center border-gray-200 text-gray-800 text-xs break-words">{publicidad.url_twitter}</td>
                    <td className="py-3 px-4 border-b text-center border-gray-200 text-gray-800 text-xs break-words">{publicidad.url_instagram}</td>
                    <td className="py-3 px-4 border-b text-center border-gray-200 text-gray-800 text-xs break-words">{publicidad.url_facebook}</td>
                    <td className="py-3 px-4 border-b text-center border-gray-200 text-gray-800">
                      {radios.find(radio => radio.id === publicidad.fk_radio)?.nombre}
                    </td>
                    <td className="py-3 px-4 border-b border-gray-200 text-gray-800 text-center">
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => handleEdit(publicidad)}
                          className="py-1 px-3 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-300"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(publicidad.id_publicidad)}
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

export default Publicidad;
