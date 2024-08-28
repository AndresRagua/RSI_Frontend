import { useState, useEffect } from "react";
import axios from "axios";
import AdminNavBar from "../../components/AdminNavBar";

const API_URL = process.env.REACT_APP_API_URL;

// Función para transformar la URL de Dropbox
const transformDropboxUrl = (url) => {
  return url.replace("www.dropbox.com", "dl.dropboxusercontent.com").replace("?dl=0", "");
};

function Programacion() {
  const [nombre, setNombre] = useState("");
  const [urlAudio, setUrlAudio] = useState("");
  const [fechaTransmision, setFechaTransmision] = useState("");
  const [fkPrograma, setFkPrograma] = useState("");
  const [programaciones, setProgramaciones] = useState([]);
  const [programas, setProgramas] = useState([]);
  const [editingProgramacion, setEditingProgramacion] = useState(null);
  const [editingFields, setEditingFields] = useState({
    id_programacion: "",
    nombre: "",
    urlAudio: "",
    fechaTransmision: "",
    fkPrograma: ""
  });
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    document.title = "Programaciones";
    fetchProgramaciones();
    fetchProgramas();
  }, []);

  const fetchProgramaciones = async () => {
    const res = await axios.get(`${API_URL}/programacion/`);
    setProgramaciones(res.data);
  };

  const fetchProgramas = async () => {
    const res = await axios.get(`${API_URL}/programa/`);
    setProgramas(res.data);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${API_URL}/programacion/`, {
      nombre,
      url_audio: urlAudio,
      fecha_transmision: fechaTransmision,
      fk_programa: parseInt(fkPrograma)
    });
    fetchProgramaciones();
    setNombre("");
    setUrlAudio("");
    setFechaTransmision("");
    setFkPrograma("");
    e.target.reset();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (editingProgramacion) {
      await axios.put(`${API_URL}/programacion/${editingProgramacion.id_programacion}`, {
        nombre: editingFields.nombre,
        url_audio: editingFields.urlAudio,
        fecha_transmision: editingFields.fechaTransmision,
        fk_programa: parseInt(editingFields.fkPrograma)
      });
      fetchProgramaciones();
      setEditingProgramacion(null);
      setEditingFields({
        id_programacion: "",
        nombre: "",
        urlAudio: "",
        fechaTransmision: "",
        fkPrograma: ""
      });
      e.target.reset();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleEdit = (programacion) => {
    setEditingFields({
      id_programacion: programacion.id_programacion,
      nombre: programacion.nombre,
      urlAudio: programacion.url_audio,
      fechaTransmision: programacion.fecha_transmision,
      fkPrograma: programacion.fk_programa
    });
    setEditingProgramacion(programacion);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/programacion/${id}`);
    fetchProgramaciones();
  };

  const handleSort = () => {
    const sortedProgramaciones = [...programaciones].sort((a, b) => {
      const programaA = programas.find(programa => programa.id_programa === a.fk_programa)?.nombre || "";
      const programaB = programas.find(programa => programa.id_programa === b.fk_programa)?.nombre || "";
      if (sortOrder === "asc") {
        return programaA.localeCompare(programaB);
      } else {
        return programaB.localeCompare(programaA);
      }
    });
    setProgramaciones(sortedProgramaciones);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleSortByDate = () => {
    const sortedProgramaciones = [...programaciones].sort((a, b) => {
      const dateA = new Date(a.fecha_transmision);
      const dateB = new Date(b.fecha_transmision);
      if (sortOrder === "asc") {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });
    setProgramaciones(sortedProgramaciones);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="flex flex-col bg-gray-100 min-h-screen">
      {/* Navbar */}
      <AdminNavBar />

      <header className="mt-4 py-5 text-3xl font-bold text-gray-800 text-center">
        Administrar Programaciones
      </header>

      <div className="px-4 md:px-8 lg:px-16">
        <div className="flex flex-col lg:flex-row lg:space-x-8">
          {/* Formulario para agregar */}
          <form className="bg-white p-6 rounded-lg shadow-md mb-8 w-full lg:w-1/2" onSubmit={handleAddSubmit}>
            <h2 className="text-2xl mb-4 font-semibold text-gray-800 text-center">Agregar Programación</h2>
            <input
              type="text"
              placeholder="Nombre de la Programación"
              value={nombre}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={(e) => setNombre(e.target.value)}
            />
            <input
              type="text"
              placeholder="URL del Audio"
              value={urlAudio}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={(e) => setUrlAudio(e.target.value)}
            />
            <input
              type="date"
              placeholder="Fecha de Transmisión"
              value={fechaTransmision}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={(e) => setFechaTransmision(e.target.value)}
            />
            <select
              value={fkPrograma}
              onChange={(e) => setFkPrograma(e.target.value)}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">Selecciona un Programa</option>
              {programas.map((programa) => (
                <option key={programa.id_programa} value={programa.id_programa}>
                  {programa.nombre}
                </option>
              ))}
            </select>
            <button className="w-full py-2 bg-yellow-500 text-white font-semibold rounded hover:bg-yellow-600 transition duration-300">
              Guardar
            </button>
          </form>

          {/* Formulario para actualizar */}
          <form className="bg-white p-6 rounded-lg shadow-md mb-8 w-full lg:w-1/2" onSubmit={handleEditSubmit}>
            <h2 className="text-2xl mb-4 font-semibold text-gray-800 text-center">Actualizar Programación</h2>
            <input
              type="text"
              placeholder="Nombre de la Programación"
              value={editingFields.nombre}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={(e) => setEditingFields({ ...editingFields, nombre: e.target.value })}
            />
            <input
              type="text"
              placeholder="URL del Audio"
              value={editingFields.urlAudio}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={(e) => setEditingFields({ ...editingFields, urlAudio: e.target.value })}
            />
            <input
              type="date"
              placeholder="Fecha de Transmisión"
              value={editingFields.fechaTransmision}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={(e) => setEditingFields({ ...editingFields, fechaTransmision: e.target.value })}
            />
            <select
              value={editingFields.fkPrograma}
              onChange={(e) => setEditingFields({ ...editingFields, fkPrograma: e.target.value })}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">Selecciona un Programa</option>
              {programas.map((programa) => (
                <option key={programa.id_programa} value={programa.id_programa}>
                  {programa.nombre}
                </option>
              ))}
            </select>
            <button className="w-full py-2 bg-yellow-500 text-white font-semibold rounded hover:bg-yellow-600 transition duration-300">
              Actualizar
            </button>
          </form>
        </div>

        <div className="mt-8">
          <h2 className="text-3xl mb-4 font-bold text-gray-800 text-center">Lista de Programaciones</h2>
          <div className="flex justify-center space-x-2 mb-4">
            <button onClick={handleSort} className="py-2 px-4 bg-yellow-500 text-white font-semibold rounded hover:bg-yellow-600 transition duration-300">
              Ordenar por Programa ({sortOrder === "asc" ? "Ascendente" : "Descendente"})
            </button>
            <button onClick={handleSortByDate} className="py-2 px-4 bg-yellow-500 text-white font-semibold rounded hover:bg-yellow-600 transition duration-300">
              Ordenar por Fecha ({sortOrder === "asc" ? "Ascendente" : "Descendente"})
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-bold text-gray-600">ID</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-bold text-gray-600">Nombre</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-bold text-gray-600">URL del Audio</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-bold text-gray-600">Fecha de Transmisión</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-bold text-gray-600">Programa</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-bold text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {programaciones.map((programacion) => (
                  <tr key={programacion.id_programacion}>
                    <td className="py-2 px-4 border-b text-center border-gray-200 text-gray-800">{programacion.id_programacion}</td>
                    <td className="py-2 px-4 border-b text-center border-gray-200 text-gray-800">{programacion.nombre}</td>
                    <td className="py-2 px-4 border-b text-center border-gray-200 text-gray-800">
                      <audio id="stream" controls preload="none" className="w-full max-w-xs mx-auto">
                        <source src={transformDropboxUrl(programacion.url_audio)} type="audio/mpeg" />
                      </audio>
                    </td>
                    <td className="py-2 px-4 border-b text-center border-gray-200 text-gray-800">{programacion.fecha_transmision}</td>
                    <td className="py-2 px-4 border-b text-center border-gray-200 text-gray-800">
                      {programas.find(programa => programa.id_programa === programacion.fk_programa)?.nombre}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200 text-gray-800 text-center">
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => handleEdit(programacion)}
                          className="py-1 px-3 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-300"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(programacion.id_programacion)}
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

export default Programacion;
