import { useState, useEffect } from "react";
import axios from "axios";
import AdminNavBar from "../../components/AdminNavBar";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function Administrador() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [administradores, setAdministradores] = useState([]);
  const [editingAdministrador, setEditingAdministrador] = useState(null);
  const [editingFields, setEditingFields] = useState({
    id_administrador: "",
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [editingPasswordVisible, setEditingPasswordVisible] = useState(false);
  const [editingConfirmPasswordVisible, setEditingConfirmPasswordVisible] = useState(false);

  useEffect(() => {
    fetchAdministradores();
  }, []);

  const fetchAdministradores = async () => {
    const res = await axios.get("http://localhost:8000/admin/obtener");
    setAdministradores(res.data);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    await axios.post("http://localhost:8000/admin/agregar", {
      nombre,
      apellido,
      email,
      password
    });
    fetchAdministradores();
    setNombre("");
    setApellido("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    e.target.reset();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (editingFields.password !== editingFields.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    const updatedFields = {
      nombre: editingFields.nombre,
      apellido: editingFields.apellido,
      email: editingFields.email,
    };

    if (editingFields.password) {
      updatedFields.password = editingFields.password;
    }

    if (editingAdministrador) {
      await axios.put(`http://localhost:8000/admin/${editingAdministrador.id_administrador}`, updatedFields);
      fetchAdministradores();
      setEditingAdministrador(null);
      setEditingFields({
        id_administrador: "",
        nombre: "",
        apellido: "",
        email: "",
        password: "",
        confirmPassword: ""
      });
      e.target.reset();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleEdit = (administrador) => {
    setEditingFields({
      id_administrador: administrador.id_administrador,
      nombre: administrador.nombre,
      apellido: administrador.apellido,
      email: administrador.email,
      password: "",
      confirmPassword: ""
    });
    setEditingAdministrador(administrador);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8000/admin/${id}`);
    fetchAdministradores();
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
        Administrar Administradores
      </header>

      <div className="container">
        <div className="row">
          <div className="col">
            {/* Formulario para agregar */}
            <form className="bg-secondary p-10 rounded-lg shadow-lg mb-8" onSubmit={handleAddSubmit}>
              <h2 className="text-2xl mb-4 font-semibold-important text-white text-center">Agregar Administrador</h2>
              <input
                type="text"
                placeholder="Nombre del Administrador"
                value={nombre}
                className="block py-2 px-3 mb-4 w-full text-black rounded border-2 border-yellow-300"
                onChange={(e) => setNombre(e.target.value)}
              />
              <input
                type="text"
                placeholder="Apellido del Administrador"
                value={apellido}
                className="block py-2 px-3 mb-4 w-full text-black rounded border-2 border-yellow-300"
                onChange={(e) => setApellido(e.target.value)}
              />
              <input
                type="email"
                placeholder="Correo del Administrador"
                value={email}
                className="block py-2 px-3 mb-4 w-full text-black rounded border-2 border-yellow-300"
                onChange={(e) => setEmail(e.target.value)}
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
              <button className="w-full py-2 bg-yellow-500 text-white font-semibold rounded hover:bg-yellow-600">
                Guardar
              </button>
            </form>
          </div>
          <div className="col">
            {/* Formulario para actualizar */}
            <form className="bg-secondary p-10 rounded-lg shadow-lg mb-8" onSubmit={handleEditSubmit}>
              <h2 className="text-2xl mb-4 font-semibold-important text-white text-center">Actualizar Administrador</h2>
              <input
                type="text"
                placeholder="Nombre del Administrador"
                value={editingFields.nombre}
                className="block py-2 px-3 mb-4 w-full text-black rounded border-2 border-yellow-300"
                onChange={(e) => setEditingFields({ ...editingFields, nombre: e.target.value })}
              />
              <input
                type="text"
                placeholder="Apellido del Administrador"
                value={editingFields.apellido}
                className="block py-2 px-3 mb-4 w-full text-black rounded border-2 border-yellow-300"
                onChange={(e) => setEditingFields({ ...editingFields, apellido: e.target.value })}
              />
              <input
                type="email"
                placeholder="Correo del Administrador"
                value={editingFields.email}
                className="block py-2 px-3 mb-4 w-full text-black rounded border-2 border-yellow-300"
                onChange={(e) => setEditingFields({ ...editingFields, email: e.target.value })}
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
              <button className="w-full py-2 bg-yellow-500 text-white font-semibold rounded hover:bg-yellow-600">
                Actualizar
              </button>
            </form>
          </div>    
        </div>
      </div>

      <div className="container">
        <div className="mt-8 w-full">
          <h2 className="text-3xl mb-4 font-bold text-gray-800 text-center">Lista de Administradores</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-bold text-gray-600">ID</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600">Nombre</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600">Apellido</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600">Correo</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {administradores.map((administrador) => (
                  <tr key={administrador.id_administrador}>
                    <td className="py-2 px-4 border-b text-center border-gray-200 text-gray-800">{administrador.id_administrador}</td>
                    <td className="py-2 px-4 border-b text-center border-gray-200 text-gray-800">{administrador.nombre}</td>
                    <td className="py-2 px-4 border-b text-center border-gray-200 text-gray-800">{administrador.apellido}</td>
                    <td className="py-2 px-4 border-b text-center border-gray-200 text-gray-800">{administrador.email}</td>
                    <td className="py-2 px-4 border-b border-gray-200 text-gray-800 text-center">
                      <div className="pb-2">
                        <button
                          onClick={() => handleEdit(administrador)}
                          className="mr-2 py-1 px-3 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
                        >
                          Editar
                        </button>
                      </div>
                      <div className="pb-2">
                        <button
                          onClick={() => handleDelete(administrador.id_administrador)}
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

export default Administrador;
