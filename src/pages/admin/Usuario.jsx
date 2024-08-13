import { useState, useEffect } from "react";
import axios from "axios";
import AdminNavBar from "../../components/AdminNavBar";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const API_URL = process.env.REACT_APP_API_URL;

function Usuario() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [fkRadio, setFkRadio] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [radios, setRadios] = useState([]);
  const [editingUsuario, setEditingUsuario] = useState(null);
  const [editingFields, setEditingFields] = useState({
    id_usuario: "",
    nombre: "",
    correo: "",
    telefono: "",
    password: "",
    confirmPassword: "",
    fkRadio: ""
  });
  const [editingPasswordVisible, setEditingPasswordVisible] = useState(false);
  const [editingConfirmPasswordVisible, setEditingConfirmPasswordVisible] = useState(false);

  useEffect(() => {
    document.title = "Usuarios Hilos";
    fetchUsuarios();
    fetchRadios();
  }, []);

  const fetchUsuarios = async () => {
    const res = await axios.get(`${API_URL}/usuario/`);
    setUsuarios(res.data);
  };

  const fetchRadios = async () => {
    const res = await axios.get(`${API_URL}/radio/obtener`);
    setRadios(res.data);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    await axios.post(`${API_URL}/usuario/`, {
      nombre,
      correo,
      telefono,
      password,
      fk_radio: parseInt(fkRadio)
    });
    fetchUsuarios();
    setNombre("");
    setCorreo("");
    setTelefono("");
    setPassword("");
    setConfirmPassword("");
    setFkRadio("");
    e.target.reset();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (editingFields.password !== editingFields.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    if (editingUsuario) {
      await axios.put(`${API_URL}/usuario/${editingUsuario.id_usuario}`, {
        nombre: editingFields.nombre,
        correo: editingFields.correo,
        telefono: editingFields.telefono,
        password: editingFields.password,
        fk_radio: parseInt(editingFields.fkRadio)
      });
      fetchUsuarios();
      setEditingUsuario(null);
      setEditingFields({
        id_usuario: "",
        nombre: "",
        correo: "",
        telefono: "",
        password: "",
        confirmPassword: "",
        fkRadio: ""
      });
      e.target.reset();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleEdit = (usuario) => {
    setEditingFields({
      id_usuario: usuario.id_usuario,
      nombre: usuario.nombre,
      correo: usuario.correo,
      telefono: usuario.telefono,
      password: "",
      confirmPassword: "",
      fkRadio: usuario.fk_radio
    });
    setEditingUsuario(usuario);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/usuario/${id}`);
    fetchUsuarios();
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const toggleEditingPasswordVisibility = () => {
    setEditingPasswordVisible(!editingPasswordVisible);
  };

  const toggleEditingConfirmPasswordVisibility = () => {
    setEditingConfirmPasswordVisible(!editingConfirmPasswordVisible);
  };

  return (
    <div className="flex flex-col bg-gray-200">
      {/* Navbar */}
      <AdminNavBar />

      <header className="mt-3 pt-5 pb-5 text-3xl font-bold text-gray-800 text-center">
        Administrar Usuarios
      </header>

      <div className="container">
        <div className="row">
          <div className="col">
            {/* Formulario para agregar */}
            <form className="bg-secondary p-10 rounded-lg shadow-lg mb-8" onSubmit={handleAddSubmit}>
              <h2 className="text-2xl mb-4 font-semibold-important text-white text-center">Agregar Usuario</h2>
              <input
                type="text"
                placeholder="Nombre del Usuario"
                value={nombre}
                className="block py-2 px-3 mb-4 w-full text-black rounded border-2 border-yellow-300"
                onChange={(e) => setNombre(e.target.value)}
              />
              <input
                type="text"
                placeholder="Correo del Usuario"
                value={correo}
                className="block py-2 px-3 mb-4 w-full text-black rounded border-2 border-yellow-300"
                onChange={(e) => setCorreo(e.target.value)}
              />
              <input
                type="text"
                placeholder="Teléfono del Usuario"
                value={telefono}
                className="block py-2 px-3 mb-4 w-full text-black rounded border-2 border-yellow-300"
                onChange={(e) => setTelefono(e.target.value)}
              />
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Contraseña"
                  value={password}
                  className="block py-2 px-3 mb-4 w-full text-black rounded border-2 border-yellow-300"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-3 cursor-pointer"
                >
                  {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <div className="relative">
                <input
                  type={confirmPasswordVisible ? "text" : "password"}
                  placeholder="Confirmar Contraseña"
                  value={confirmPassword}
                  className="block py-2 px-3 mb-4 w-full text-black rounded border-2 border-yellow-300"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <span
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-3 top-3 cursor-pointer"
                >
                  {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <select
                value={fkRadio}
                onChange={(e) => setFkRadio(e.target.value)}
                className="block py-2 px-3 mb-4 w-full text-black rounded border-2 border-yellow-300"
              >
                <option value="">Selecciona una Radio</option>
                {radios.map((radio) => (
                  <option key={radio.id} value={radio.id}>
                    {radio.nombre}
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
              <h2 className="text-2xl mb-4 font-semibold-important text-white text-center">Actualizar Usuario</h2>
              <input
                type="text"
                placeholder="Nombre del Usuario"
                value={editingFields.nombre}
                className="block py-2 px-3 mb-4 w-full text-black rounded border-2 border-yellow-300"
                onChange={(e) => setEditingFields({ ...editingFields, nombre: e.target.value })}
              />
              <input
                type="text"
                placeholder="Correo del Usuario"
                value={editingFields.correo}
                className="block py-2 px-3 mb-4 w-full text-black rounded border-2 border-yellow-300"
                onChange={(e) => setEditingFields({ ...editingFields, correo: e.target.value })}
              />
              <input
                type="text"
                placeholder="Teléfono del Usuario"
                value={editingFields.telefono}
                className="block py-2 px-3 mb-4 w-full text-black rounded border-2 border-yellow-300"
                onChange={(e) => setEditingFields({ ...editingFields, telefono: e.target.value })}
              />
              <div className="relative">
                <input
                  type={editingPasswordVisible ? "text" : "password"}
                  placeholder="Contraseña"
                  value={editingFields.password}
                  className="block py-2 px-3 mb-4 w-full text-black rounded border-2 border-yellow-300"
                  onChange={(e) => setEditingFields({ ...editingFields, password: e.target.value })}
                />
                <span
                  onClick={toggleEditingPasswordVisibility}
                  className="absolute right-3 top-3 cursor-pointer"
                >
                  {editingPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <div className="relative">
                <input
                  type={editingConfirmPasswordVisible ? "text" : "password"}
                  placeholder="Confirmar Contraseña"
                  value={editingFields.confirmPassword}
                  className="block py-2 px-3 mb-4 w-full text-black rounded border-2 border-yellow-300"
                  onChange={(e) => setEditingFields({ ...editingFields, confirmPassword: e.target.value })}
                />
                <span
                  onClick={toggleEditingConfirmPasswordVisibility}
                  className="absolute right-3 top-3 cursor-pointer"
                >
                  {editingConfirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <select
                value={editingFields.fkRadio}
                onChange={(e) => setEditingFields({ ...editingFields, fkRadio: e.target.value })}
                className="block py-2 px-3 mb-4 w-full text-black rounded border-2 border-yellow-300"
              >
                <option value="">Selecciona una Radio</option>
                {radios.map((radio) => (
                  <option key={radio.id} value={radio.id}>
                    {radio.nombre}
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
          <h2 className="text-3xl mb-4 font-bold text-gray-800 text-center">Lista de Usuarios</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-bold text-gray-600">ID</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600">Nombre</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600">Correo</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600">Teléfono</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600">Radio</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id_usuario}>
                    <td className="py-2 px-4 border-b text-center border-gray-200 text-gray-800">{usuario.id_usuario}</td>
                    <td className="py-2 px-4 border-b text-center border-gray-200 text-gray-800">{usuario.nombre}</td>
                    <td className="py-2 px-4 border-b text-center border-gray-200 text-gray-800">{usuario.correo}</td>
                    <td className="py-2 px-4 border-b text-center border-gray-200 text-gray-800">{usuario.telefono}</td>
                    <td className="py-2 px-4 border-b text-center border-gray-200 text-gray-800">
                      {radios.find(radio => radio.id === usuario.fk_radio)?.nombre}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200 text-gray-800 text-center">
                      <div className="pb-2">
                        <button
                          onClick={() => handleEdit(usuario)}
                          className="mr-2 py-1 px-3 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
                        >
                          Editar
                        </button>
                      </div>
                      <div className="pb-2">
                        <button
                          onClick={() => handleDelete(usuario.id_usuario)}
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

export default Usuario;
