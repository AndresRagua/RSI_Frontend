import { useState, useEffect } from "react";
import axios from "axios";
import AdminNavBar from "../../components/AdminNavBar";

// Función para transformar la URL de Dropbox
const transformDropboxUrl = (url) => {
  return url?.replace("www.dropbox.com", "dl.dropboxusercontent.com").replace("?dl=0", "");
};

function Radio() {
  const [nombre, setNombre] = useState("");
  const [urlLogo, setUrlLogo] = useState("");
  const [urlAudio, setUrlAudio] = useState("");
  const [urlPrimerFondo, setUrlPrimerFondo] = useState("");
  const [urlSegundoFondo, setUrlSegundoFondo] = useState("");
  const [urlTercerFondo, setUrlTercerFondo] = useState("");
  const [radios, setRadios] = useState([]);
  const [editingRadio, setEditingRadio] = useState(null);
  const [error, setError] = useState("");
  const [editingFields, setEditingFields] = useState({
    id: "",
    nombre: "",
    urlLogo: "",
    urlAudio: "",
    urlPrimerFondo: "",
    urlSegundoFondo: "",
    urlTercerFondo: ""
  });

  useEffect(() => {
    fetchRadios();
  }, []);

  const fetchRadios = async () => {
    try {
      const res = await axios.get("http://localhost:8000/radio/obtener");
      setRadios(res.data);
    } catch (error) {
      console.error("Error fetching radios:", error);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/radio/agregar", {
        nombre,
        url_logo: urlLogo,
        url_audio: urlAudio,
        url_primer_fondo: urlPrimerFondo,
        url_segundo_fondo: urlSegundoFondo,
        url_tercer_fondo: urlTercerFondo
      });
      fetchRadios();
      setNombre("");
      setUrlLogo("");
      setUrlAudio("");
      setUrlPrimerFondo("");
      setUrlSegundoFondo("");
      setUrlTercerFondo("");
      e.target.reset();
      setError("");  // Clear any previous errors
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      if (err.response && err.response.data.detail) {
        setError(`Error al agregar la radio: ${err.response.data.detail}`);
      } else {
        setError("Error al agregar la radio");
      }
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (editingRadio) {
      try {
        await axios.put(`http://localhost:8000/radio/${editingRadio.id}`, {
          nombre: editingFields.nombre,
          url_logo: editingFields.urlLogo,
          url_audio: editingFields.urlAudio,
          url_primer_fondo: editingFields.urlPrimerFondo,
          url_segundo_fondo: editingFields.urlSegundoFondo,
          url_tercer_fondo: editingFields.urlTercerFondo
        });
        fetchRadios();
        setEditingRadio(null);
        setEditingFields({
          nombre: "",
          urlAudio: "",
          urlLogo: "",
          urlPrimerFondo: "",
          urlSegundoFondo: "",
          urlTercerFondo: ""
        });
        e.target.reset();
        setError("");  // Clear any previous errors
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        if (err.response && err.response.data.detail) {
          setError(`Error al actualizar la radio: ${err.response.data.detail}`);
        } else {
          setError("Error al actualizar la radio");
        }
      }
    }
  };

  const handleEdit = (radio) => {
    setEditingFields({
      nombre: radio.nombre,
      urlAudio: radio.url_audio,
      urlLogo: radio.url_logo,
      urlPrimerFondo: radio.url_primer_fondo,
      urlSegundoFondo: radio.url_segundo_fondo,
      urlTercerFondo: radio.url_tercer_fondo
    });
    setEditingRadio(radio);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/radio/${id}`);
      fetchRadios();
      setError("");  // Clear any previous errors
    } catch (err) {
      if (err.response && err.response.data.detail) {
        setError(`Error al eliminar la radio: ${err.response.data.detail}`);
      } else {
        setError("Error al eliminar la radio");
      }
    }
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
    <div className="flex flex-col bg-gray-200">
      
      {/* Navbar */}
      <AdminNavBar />
      
      <header className="mt-3 pt-5 pb-5 text-3xl font-bold text-gray-800 text-center">
        Administrar Radios
      </header>

      <div className="container">
        <div className="row">
          <div className="col">
            {/* Formulario para agregar */}
            <form className="bg-secondary p-10 rounded-lg shadow-lg mb-8" onSubmit={handleAddSubmit}>
              <h2 className="text-2xl mb-4 font-semibold-important text-white text-center">Agregar Radio</h2>
              <input
                type="text"
                placeholder="Nombre Radio"
                value={nombre}
                className="block py-2 px-3 mb-4 w-full text-black rounded border-2 border-yellow-300"
                onChange={(e) => setNombre(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="URL del Audio"
                value={urlAudio}
                className="block py-2 px-3 mb-4 w-full text-black rounded border-2 border-yellow-300"
                onChange={(e) => setUrlAudio(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="URL del Logo"
                value={urlLogo}
                className="block py-2 px-3 mb-4 w-full text-black rounded border-2 border-yellow-300"
                onChange={(e) => setUrlLogo(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="URL Primer Fondo"
                value={urlPrimerFondo}
                className="block py-2 px-3 mb-4 w-full text-black rounded border-2 border-yellow-300"
                onChange={(e) => setUrlPrimerFondo(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="URL Segundo Fondo"
                value={urlSegundoFondo}
                className="block py-2 px-3 mb-4 w-full text-black rounded border-2 border-yellow-300"
                onChange={(e) => setUrlSegundoFondo(e.target.value)}
              />
              <input
                type="text"
                placeholder="URL Tercer Fondo"
                value={urlTercerFondo}
                className="block py-2 px-3 mb-4 w-full text-black rounded border-2 border-yellow-300"
                onChange={(e) => setUrlTercerFondo(e.target.value)}
              />
              <button className="w-full py-2 bg-yellow-500 text-white font-semibold rounded hover:bg-yellow-600">
                Guardar
              </button>
              {renderError(error)}
            </form>
          </div>
          <div className="col">
            {/* Formulario para actualizar */}
              <form className="bg-secondary p-10 rounded-lg shadow-lg mb-8" onSubmit={handleEditSubmit}>
                <h2 className="text-2xl mb-4 font-semibold-important text-white text-center">Actualizar Radio</h2>
                <input
                  type="text"
                  placeholder="Nombre Radio"
                  value={editingFields.nombre}
                  className="block py-2 px-3 mb-4 w-full text-black rounded border-2 border-yellow-300"
                  onChange={(e) => setEditingFields({ ...editingFields, nombre: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="URL Del Audio"
                  value={editingFields.urlAudio}
                  className="block py-2 px-3 mb-4 w-full text-black rounded border-2 border-yellow-300"
                  onChange={(e) => setEditingFields({ ...editingFields, urlAudio: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="URL Del Logo"
                  value={editingFields.urlLogo}
                  className="block py-2 px-3 mb-4 w-full text-black rounded border-2 border-yellow-300"
                  onChange={(e) => setEditingFields({ ...editingFields, urlLogo: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="URL Primer Fondo"
                  value={editingFields.urlPrimerFondo}
                  className="block py-2 px-3 mb-4 w-full text-black rounded border-2 border-yellow-300"
                  onChange={(e) => setEditingFields({ ...editingFields, urlPrimerFondo: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="URL Segundo Fondo"
                  value={editingFields.urlSegundoFondo}
                  className="block py-2 px-3 mb-4 w-full text-black rounded border-2 border-yellow-300"
                  onChange={(e) => setEditingFields({ ...editingFields, urlSegundoFondo: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="URL Tercer Fondo"
                  value={editingFields.urlTercerFondo}
                  className="block py-2 px-3 mb-4 w-full text-black rounded border-2 border-yellow-300"
                  onChange={(e) => setEditingFields({ ...editingFields, urlTercerFondo: e.target.value })}
                />
                <button className="w-full py-2 bg-yellow-500 text-white font-semibold rounded hover:bg-yellow-600">
                  Actualizar
                </button>
                {renderError(error)}
              </form>
          </div>    
        </div>
      </div>

      <div className="container">
        <div className="mt-8 w-full">
          <h2 className="text-3xl mb-4 font-bold text-gray-800 text-center">Lista de Radios</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-bold text-gray-600">ID</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600">Nombre</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600">Audio</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600">Logo</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600">Fondo 1</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600">Fondo 2</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600">Fondo 3</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {radios.map((radio) => (
                  <tr key={radio.id}>
                    <td className="py-2 px-4 border-b text-center border-gray-200 text-gray-800">{radio.id}</td>
                    <td className="py-2 px-4 border-b text-center border-gray-200 text-gray-800">{radio.nombre}</td>
                    <td className="py-2 px-4 border-b text-center border-gray-200 text-gray-800">
                      <audio id="stream" controls preload="none" style={{ width: "100%", maxWidth: "500px" }}>
                        <source src={transformDropboxUrl(radio.url_audio)} type="audio/mpeg" />
                      </audio>
                    </td>
                    <td className="py-2 px-4 border-b text-center border-gray-200 text-gray-800">
                      <img src={transformDropboxUrl(radio.url_logo)} alt="Imagen del Logo" className="w-40 h-24 object-cover rounded" />
                    </td>
                    <td className="py-2 px-4 border-b text-center border-gray-200 text-gray-800">
                      <img src={transformDropboxUrl(radio.url_primer_fondo)} alt="Imagen del Primer Fondo" className="w-40 h-24 object-cover rounded" />
                    </td>
                    <td className="py-2 px-4 border-b text-center border-gray-200 text-gray-800">
                      {radio.url_segundo_fondo ? (
                        <img src={transformDropboxUrl(radio.url_segundo_fondo)} alt="Imagen del Segundo Fondo" className="w-40 h-24 object-cover rounded" />
                      ) : (
                        <span>No posee</span>
                      )}
                    </td>
                    <td className="py-2 px-4 border-b text-center border-gray-200 text-gray-800">
                      {radio.url_tercer_fondo ? (
                        <img src={transformDropboxUrl(radio.url_tercer_fondo)} alt="Imagen del Tercer Fondo" className="w-40 h-24 object-cover rounded" />
                      ) : (
                        <span>No posee</span>
                      )}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200 text-gray-800 text-center">
                      <button
                        onClick={() => handleEdit(radio)}
                        className="mr-2 py-1 px-3 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(radio.id)}
                        className="py-1 px-3 bg-red-500 text-white font-semibold rounded hover:bg-red-600"
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


      <footer className="mt-8 text-gray-600 text-center w-full">
        <p>Derechos de Autor Reservados.</p>
        <p>Implementado por Dev Andres Ragua.</p>
      </footer>
    </div>
  );
}

export default Radio;
