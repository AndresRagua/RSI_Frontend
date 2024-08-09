import { useState, useEffect } from "react";
import axios from "axios";
import AdminNavBar from "../../components/AdminNavBar";

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
    fetchProgramaciones();
    fetchProgramas();
  }, []);

  const fetchProgramaciones = async () => {
    const res = await axios.get("http://localhost:8000/programacion/");
    setProgramaciones(res.data);
  };

  const fetchProgramas = async () => {
    const res = await axios.get("http://localhost:8000/programa/");
    setProgramas(res.data);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:8000/programacion/", {
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
      await axios.put(`http://localhost:8000/programacion/${editingProgramacion.id_programacion}`, {
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
    await axios.delete(`http://localhost:8000/programacion/${id}`);
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
    <div className="flex flex-col bg-gray-200">
      {/* Navbar */}
      <AdminNavBar />

      <header className="mt-3 pt-5 pb-5 text-3xl font-bold text-gray-800 text-center">
        Administrar Programaciones
      </header>

      <div className="container">
        <div className="row">
          <div className="col">
            {/* Formulario para agregar */}
            <form className="bg-secondary p-10 rounded-lg shadow-lg mb-8" onSubmit={handleAddSubmit}>
              <h2 className="text-2xl mb-4 font-semibold-important text-white text-center">Agregar Programación</h2>
              <input
                type="text"
                placeholder="Nombre de la Programación"
                value={nombre}
                className="block py-2 px-3 mb-4 w-full text-black rounded border-2 border-yellow-300"
                onChange={(e) => setNombre(e.target.value)}
              />
              <input
                type="text"
                placeholder="URL del Audio"
                value={urlAudio}
                className="block py-2 px-3 mb-4 w-full text-black rounded border-2 border-yellow-300"
                onChange={(e) => setUrlAudio(e.target.value)}
              />
              <input
                type="date"
                placeholder="Fecha de Transmisión"
                value={fechaTransmision}
                className="block py-2 px-3 mb-4 w-full text-black rounded border-2 border-yellow-300"
                onChange={(e) => setFechaTransmision(e.target.value)}
              />
              <select
                value={fkPrograma}
                onChange={(e) => setFkPrograma(e.target.value)}
                className="block py-2 px-3 mb-4 w-full text-black rounded border-2 border-yellow-300"
              >
                <option value="">Selecciona un Programa</option>
                {programas.map((programa) => (
                  <option key={programa.id_programa} value={programa.id_programa}>
                    {programa.nombre}
                  </option>
                ))}
              </select>
              <button className="w-full py-2 bg-yellow-500 text-white font-semibold rounded hover:bg-yellow-600">
                Guardar
              </button>
            </form>
          </div>
          <div className="col">
            {/* Formulario para actualizar */}
            <form className="bg-secondary p-10 rounded-lg shadow-lg mb-8" onSubmit={handleEditSubmit}>
              <h2 className="text-2xl mb-4 font-semibold-important text-white text-center">Actualizar Programación</h2>
              <input
                type="text"
                placeholder="Nombre de la Programación"
                value={editingFields.nombre}
                className="block py-2 px-3 mb-4 w-full text-black rounded border-2 border-yellow-300"
                onChange={(e) => setEditingFields({ ...editingFields, nombre: e.target.value })}
              />
              <input
                type="text"
                placeholder="URL del Audio"
                value={editingFields.urlAudio}
                className="block py-2 px-3 mb-4 w-full text-black rounded border-2 border-yellow-300"
                onChange={(e) => setEditingFields({ ...editingFields, urlAudio: e.target.value })}
              />
              <input
                type="date"
                placeholder="Fecha de Transmisión"
                value={editingFields.fechaTransmision}
                className="block py-2 px-3 mb-4 w-full text-black rounded border-2 border-yellow-300"
                onChange={(e) => setEditingFields({ ...editingFields, fechaTransmision: e.target.value })}
              />
              <select
                value={editingFields.fkPrograma}
                onChange={(e) => setEditingFields({ ...editingFields, fkPrograma: e.target.value })}
                className="block py-2 px-3 mb-4 w-full text-black rounded border-2 border-yellow-300"
              >
                <option value="">Selecciona un Programa</option>
                {programas.map((programa) => (
                  <option key={programa.id_programa} value={programa.id_programa}>
                    {programa.nombre}
                  </option>
                ))}
              </select>
              <button className="w-full py-2 bg-yellow-500 text-white font-semibold rounded hover:bg-yellow-600">
                Actualizar
              </button>
            </form>
          </div>    
        </div>
      </div>

      <div className="container">
        <div className="mt-8 w-full">
          <h2 className="text-3xl mb-4 mx-2 font-bold text-gray-800 text-center">Lista de Programaciones</h2>
          <button onClick={handleSort} className="mb-4 py-2 px-4 bg-yellow-500 text-white font-semibold rounded hover:bg-yellow-600">
            Ordenar por Programa ({sortOrder === "asc" ? "Ascendente" : "Descendente"})
          </button>
          <button onClick={handleSortByDate} className="mb-4 py-2 px-4 mx-2 bg-yellow-500 text-white font-semibold rounded hover:bg-yellow-600">
            Ordenar por Fecha ({sortOrder === "asc" ? "Ascendente" : "Descendente"})
          </button>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-bold text-gray-600">ID</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600">Nombre</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600">URL del Audio</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600">Fecha de Transmisión</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600">Programa</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {programaciones.map((programacion) => (
                  <tr key={programacion.id_programacion}>
                    <td className="py-2 px-4 border-b text-center border-gray-200 text-gray-800">{programacion.id_programacion}</td>
                    <td className="py-2 px-4 border-b text-center border-gray-200 text-gray-800">{programacion.nombre}</td>
                    <td className="py-2 px-4 border-b text-center border-gray-200 text-gray-800">
                      <audio id="stream" controls preload="none" style={{ width: "100%", maxWidth: "500px" }}>
                        <source src={transformDropboxUrl(programacion.url_audio)} type="audio/mpeg" />
                      </audio>
                    </td>
                    <td className="py-2 px-4 border-b text-center border-gray-200 text-gray-800">{programacion.fecha_transmision}</td>
                    <td className="py-2 px-4 border-b text-center border-gray-200 text-gray-800">
                      {programas.find(programa => programa.id_programa === programacion.fk_programa)?.nombre}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200 text-gray-800 text-center">
                      <div className="pb-2">
                        <button
                          onClick={() => handleEdit(programacion)}
                          className="mr-2 py-1 px-3 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
                        >
                          Editar
                        </button>
                      </div>
                      <div className="pb-2">
                        <button
                          onClick={() => handleDelete(programacion.id_programacion)}
                          className="py-1 px-3 bg-red-500 text-white font-semibold rounded hover:bg-red-600"
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

      <footer className="mt-8 text-gray-600 text-center w-full">
        <p>Derechos de Autor Reservados.</p>
        <p>Implementado por Dev Andres Ragua.</p>
      </footer>
    </div>
  );
}

export default Programacion;
