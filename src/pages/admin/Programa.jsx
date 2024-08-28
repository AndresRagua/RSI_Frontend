import { useState, useEffect } from "react";
import axios from "axios";
import AdminNavBar from "../../components/AdminNavBar";

// Transforma la URL de Dropbox para poder usarla correctamente
const transformDropboxUrl = (url) => {
  return url.replace("www.dropbox.com", "dl.dropboxusercontent.com").replace("?dl=0", "");
};

const API_URL = process.env.REACT_APP_API_URL;

// Componente principal de Programa
function Programa() {
  // Definición de estados para manejar los valores de los formularios y los datos de programas y radios
  const [nombre, setNombre] = useState("");
  const [nombreConductor, setNombreConductor] = useState("");
  const [certificadoLocucion, setCertificadoLocucion] = useState("");
  const [urlBanner, setUrlBanner] = useState("");
  const [fkRadio, setFkRadio] = useState("");
  const [programas, setProgramas] = useState([]);
  const [radios, setRadios] = useState([]);
  const [editingPrograma, setEditingPrograma] = useState(null); // Estado para manejar el programa que se está editando
  const [showRadioDropdown, setShowRadioDropdown] = useState(false); // Estado para mostrar/ocultar el dropdown de radios
  const [editingFields, setEditingFields] = useState({
    nombre: "",
    nombreConductor: "",
    certificadoLocucion: "",
    urlBanner: "",
    fkRadio: ""
  });

  // Efecto que se ejecuta al montar el componente para obtener los programas y radios
  useEffect(() => {
    document.title = "Programas";
    fetchProgramas();
    fetchRadios();
  }, []);

  // Función para obtener la lista de programas desde el backend
  const fetchProgramas = async () => {
    const res = await axios.get(`${API_URL}/programa/`);
    setProgramas(res.data);
  };

  // Función para obtener la lista de radios desde el backend
  const fetchRadios = async () => {
    const res = await axios.get(`${API_URL}/radio/obtener`);
    setRadios(res.data);
  };

  // Maneja el envío del formulario para agregar un nuevo programa
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${API_URL}/programa/`, {
      nombre,
      nombre_conductor: nombreConductor,
      certificado_locucion: certificadoLocucion,
      url_banner: urlBanner,
      fk_radio: parseInt(fkRadio)
    });
    fetchProgramas(); // Refresca la lista de programas
    // Resetea los campos del formulario
    setNombre("");
    setNombreConductor("");
    setCertificadoLocucion("");
    setUrlBanner("");
    setFkRadio("");
    e.target.reset();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Maneja el envío del formulario para editar un programa existente
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (editingPrograma) {
      await axios.put(`${API_URL}/programa/${editingPrograma.id_programa}`, {
        nombre: editingFields.nombre,
        nombre_conductor: editingFields.nombreConductor,
        certificado_locucion: editingFields.certificadoLocucion,
        url_banner: editingFields.urlBanner,
        fk_radio: parseInt(editingFields.fkRadio)
      });
      fetchProgramas(); // Refresca la lista de programas
      // Resetea los campos de edición
      setEditingPrograma(null);
      setEditingFields({
        nombre: "",
        nombreConductor: "",
        certificadoLocucion: "",
        urlBanner: "",
        fkRadio: ""
      });
      setShowRadioDropdown(false);
      e.target.reset();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Maneja el inicio del proceso de edición de un programa
  const handleEdit = (programa) => {
    setEditingFields({
      nombre: programa.nombre,
      nombreConductor: programa.nombre_conductor,
      certificadoLocucion: programa.certificado_locucion,
      urlBanner: programa.url_banner,
      fkRadio: programa.fk_radio
    });
    setEditingPrograma(programa);
    setShowRadioDropdown(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Maneja la eliminación de un programa
  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/programa/${id}`);
    fetchProgramas(); // Refresca la lista de programas
  };

  return (
    <div className="flex flex-col bg-gray-100 min-h-screen">
      
      {/* Navbar */}
      <AdminNavBar />
      
      <header className="mt-4 py-5 text-3xl font-bold text-gray-800 text-center">
        Administrar Programas
      </header>

      <div className="px-4 md:px-8 lg:px-16">
        <div className="flex flex-col lg:flex-row lg:space-x-8">
          {/* Formulario para agregar un nuevo programa */}
          <form className="bg-white p-6 rounded-lg shadow-md mb-8 w-full lg:w-1/2" onSubmit={handleAddSubmit}>
            <h2 className="text-2xl mb-4 font-semibold text-gray-800 text-center">Agregar Programa</h2>
            <input
              type="text"
              placeholder="Nombre del Programa"
              value={nombre}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={(e) => setNombre(e.target.value)}
            />
            <input
              type="text"
              placeholder="Nombre del Conductor"
              value={nombreConductor}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={(e) => setNombreConductor(e.target.value)}
            />
            <input
              type="text"
              placeholder="Certificado de Locución"
              value={certificadoLocucion}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={(e) => setCertificadoLocucion(e.target.value)}
            />
            <input
              type="text"
              placeholder="URL del Banner"
              value={urlBanner}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={(e) => setUrlBanner(e.target.value)}
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

          {/* Formulario para actualizar un programa existente */}
          <form className="bg-white p-6 rounded-lg shadow-md mb-8 w-full lg:w-1/2" onSubmit={handleEditSubmit}>
            <h2 className="text-2xl mb-4 font-semibold text-gray-800 text-center">Actualizar Programa</h2>
            <input
              type="text"
              placeholder="Nombre del Programa"
              value={editingFields.nombre}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={(e) => setEditingFields({ ...editingFields, nombre: e.target.value })}
            />
            <input
              type="text"
              placeholder="Nombre del Conductor"
              value={editingFields.nombreConductor}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={(e) => setEditingFields({ ...editingFields, nombreConductor: e.target.value })}
            />
            <input
              type="text"
              placeholder="Certificado de Locución"
              value={editingFields.certificadoLocucion}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={(e) => setEditingFields({ ...editingFields, certificadoLocucion: e.target.value })}
            />
            <input
              type="text"
              placeholder="URL del Banner"
              value={editingFields.urlBanner}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={(e) => setEditingFields({ ...editingFields, urlBanner: e.target.value })}
            />
            {showRadioDropdown && (
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
            )}
            <button className="w-full py-2 bg-yellow-500 text-white font-semibold rounded hover:bg-yellow-600 transition duration-300">
              Actualizar
            </button>
          </form>
        </div>
      </div>

      <div className="px-4 md:px-8 lg:px-16">
        <div className="mt-8 w-full">
          <h2 className="text-3xl mb-4 font-bold text-gray-800 text-center">Lista de Programas</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-bold text-gray-600">ID</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-bold text-gray-600">Nombre del Programa</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-bold text-gray-600">Nombre del Conductor</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-bold text-gray-600">Certificado de Locución</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-bold text-gray-600">Banner</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-bold text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {programas.map((programa) => (
                  <tr key={programa.id_programa}>
                    <td className="py-2 px-4 border-b text-center border-gray-200 text-gray-800">{programa.id_programa}</td>
                    <td className="py-2 px-4 border-b text-center border-gray-200 text-gray-800">{programa.nombre}</td>
                    <td className="py-2 px-4 border-b text-center border-gray-200 text-gray-800">{programa.nombre_conductor}</td>
                    <td className="py-2 px-4 border-b text-center border-gray-200 text-gray-800">{programa.certificado_locucion}</td>
                    <td className="py-2 px-4 border-b text-center border-gray-200 text-gray-800">
                      <img src={transformDropboxUrl(programa.url_banner)} alt="Banner" className="w-32 h-20 object-cover rounded-md mx-auto" />
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200 text-gray-800 text-center">
                      <div className="pb-2">
                        <button
                          onClick={() => handleEdit(programa)}
                          className="mr-2 py-1 px-3 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-300"
                        >
                          Editar
                        </button>
                      </div>
                      <div className="pb-2">
                        <button
                          onClick={() => handleDelete(programa.id_programa)}
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

// Exporta el componente Programa
export default Programa;
