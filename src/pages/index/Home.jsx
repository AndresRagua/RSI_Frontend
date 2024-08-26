import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Carousel } from 'react-bootstrap';
import NavBarPublic from '../../components/PublicNavBar';
import Footer from '../../components/Footer';
import '../../static/css/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importación de los estilos de Bootstrap

const API_URL = process.env.REACT_APP_API_URL;

const transformDropboxUrl = (url) => {
  return url?.replace("www.dropbox.com", "dl.dropboxusercontent.com").replace("?dl=0", "");
};

// Función para agrupar las programaciones
const groupProgramacionesByMonthAndYear = (programaciones) => {
  const grouped = {};
  const monthNames = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];

  programaciones.forEach(programacion => {
    const date = new Date(programacion.fecha_transmision);
    const year = date.getFullYear();
    const month = monthNames[date.getMonth()]; // Obtener el nombre del mes basado en el índice

    if (!grouped[year]) {
      grouped[year] = {};
    }

    if (!grouped[year][month]) {
      grouped[year][month] = [];
    }

    grouped[year][month].push(programacion);
  });

  return grouped;
};


function Home() {
  const [serviciosSociales, setServiciosSociales] = useState([]);
  const [selectedRadio, setSelectedRadio] = useState(null);
  const [radios, setRadios] = useState([]);
  const [selectedRadioDetails, setSelectedRadioDetails] = useState({});
  const [artistas, setArtistas] = useState([]);
  const [publicidades, setPublicidades] = useState([]);
  const [programas, setProgramas] = useState([]);
  const [expandedService, setExpandedService] = useState(null);
  const [expandedArtist, setExpandedArtist] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openAudioDropdown, setOpenAudioDropdown] = useState(null);

  useEffect(() => {
    fetchRadios();
  }, []);

  useEffect(() => {
    if (selectedRadio) {
      fetchServiciosSociales(selectedRadio);
      fetchArtistas(selectedRadio);
      fetchPublicidades(selectedRadio);
      fetchProgramas(selectedRadio);
    }
  }, [selectedRadio]);

  const fetchRadios = async () => {
    try {
      const res = await axios.get(`${API_URL}/radio/obtener`);
      setRadios(res.data);
      if (res.data.length > 0) {
        setSelectedRadio(res.data[0].id);
        setSelectedRadioDetails(res.data[0]);
      }
    } catch (error) {
      console.error("Error fetching radios:", error);
    }
  };

  const fetchServiciosSociales = async (radioId) => {
    try {
      const res = await axios.get(`${API_URL}/servicio_social/?radio_id=${radioId}`);
      setServiciosSociales(res.data);
    } catch (error) {
      console.error("Error fetching servicios sociales:", error);
    }
  };

  const fetchPublicidades = async (radioId) => {
    try {
      const res = await axios.get(`${API_URL}/publicidad/`);
      const filteredPublicidades = res.data.filter(publicidad => publicidad.fk_radio === radioId);
      setPublicidades(filteredPublicidades);
    } catch (error) {
      console.error("Error fetching publicidades:", error);
    }
  };

  const fetchProgramas = async (radioId) => {
    try {
      const res = await axios.get(`${API_URL}/programa/?radio_id=${radioId}`); // Aquí asegúrate de que el backend acepte este parámetro
      const programasData = res.data.map(programa => {
        const programacionesAgrupadas = groupProgramacionesByMonthAndYear(programa.programaciones);
        return { ...programa, programacionesAgrupadas };
      });
      setProgramas(programasData);
    } catch (error) {
      console.error("Error fetching programas:", error);
    }
  };



  const fetchArtistas = async (radioId) => {
    try {
      const res = await axios.get(`${API_URL}/artista/`);
      const filteredArtistas = res.data.filter(artista => artista.fk_radio === radioId);
      setArtistas(filteredArtistas);
    } catch (error) {
      console.error("Error fetching artistas:", error);
    }
  };

  const handleRadioChange = (radioId) => {
    setSelectedRadio(radioId);
    const radioDetails = radios.find(radio => radio.id === radioId);
    setSelectedRadioDetails(radioDetails);
  };

  const getRadioName = (id) => {
    const radio = radios.find(radio => radio.id === id);
    return radio ? radio.nombre : 'Radio';
  };

  // Función para manejar el clic en "Ver más"
  const handleVerMas = (id) => {
    if (expandedService === id) {
      setExpandedService(null);  // Colapsar el texto si se hace clic de nuevo
    } else {
      setExpandedService(id);  // Expandir el texto
    }
  };

  const handleVerMasArtista = (id_artista) => {
    setExpandedArtist(expandedArtist === id_artista ? null : id_artista);
  };

  // Función para manejar el toggle del dropdown
  const handleToggleDropdown = (id_programa) => {
    setOpenDropdown(openDropdown === id_programa ? null : id_programa);
  };

  const handleToggleAudioDropdown = (id_servicio) => {
    setOpenAudioDropdown(openAudioDropdown === id_servicio ? null : id_servicio);
  };

  return (
    <div className="flex flex-col bg-gray-200" id='page-top'>
      {/* Navbar */}
      <NavBarPublic selectedRadio={selectedRadio} setSelectedRadio={handleRadioChange} radios={radios} />

      {/* Carrusel de fotos */}
      {selectedRadioDetails && (
        <Carousel interval={null}>
          {selectedRadioDetails.url_primer_fondo && (
            <Carousel.Item className="carousel-item-custom">
              <img
                className="d-block w-100"
                src={transformDropboxUrl(selectedRadioDetails.url_primer_fondo)}
                alt={`Fondo de ${getRadioName(selectedRadio)}`}
              />
              <Carousel.Caption>
                <div className='rsi-home-container'>
                  {selectedRadioDetails.url_logo && (
                    <img src={transformDropboxUrl(selectedRadioDetails.url_logo)} className='rsi-home' alt={`Logo de ${getRadioName(selectedRadio)}`} />
                  )}
                </div>
                <div className="audio-container">
                  <audio id="stream" controls preload="none" className='stream'>
                    <source src={selectedRadioDetails.url_audio} type="audio/mpeg" />
                  </audio>
                </div>
                <h3>Bienvenido a {getRadioName(selectedRadio)}</h3>
                <p>Disfruta de la mejor música y entretenimiento</p>
              </Carousel.Caption>
            </Carousel.Item>
          )}
          {selectedRadioDetails.url_segundo_fondo && (
            <Carousel.Item className="carousel-item-custom">
              <img
                className="d-block w-100"
                src={transformDropboxUrl(selectedRadioDetails.url_segundo_fondo)}
                alt={`Segundo fondo de ${getRadioName(selectedRadio)}`}
              />
              <Carousel.Caption>
                <h3>Bienvenido a {getRadioName(selectedRadio)}</h3>
                <p>Disfruta de la mejor música y entretenimiento</p>
              </Carousel.Caption>
            </Carousel.Item>
          )}
          {selectedRadioDetails.url_tercer_fondo && (
            <Carousel.Item className="carousel-item-custom">
              <img
                className="d-block w-100"
                src={transformDropboxUrl(selectedRadioDetails.url_tercer_fondo)}
                alt={`Tercer fondo de ${getRadioName(selectedRadio)}`}
              />
              <Carousel.Caption>
                <h3>Bienvenido a {getRadioName(selectedRadio)}</h3>
                <p>Disfruta de la mejor música y entretenimiento</p>
              </Carousel.Caption>
            </Carousel.Item>
          )}
        </Carousel>
      )}



<section className="bg-light py-12" id="servicios">
  <div className="container mx-auto px-4">
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold text-black uppercase">Servicio Social</h2>
      <h3 className="text-lg text-black mt-2">Sección reservada para colaborar.</h3>
    </div>
    <div className={`grid gap-8 ${serviciosSociales.length === 1 ? 'grid-cols-1' :
      serviciosSociales.length === 2 ? 'sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2' :
        'sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      }`}>
      {serviciosSociales.map((servicio) => {
        const isOpen = openAudioDropdown === servicio.id_servicio; // Verificar si el dropdown está abierto para este servicio

        return (
          <div 
            key={servicio.id_servicio} 
            className="relative bg-white rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out max-w-sm mx-auto"
          >
            <div className="flex flex-col h-full justify-between">
              <div className="text-center p-4">
                {/* Contenedor para imagen redondeada */}
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border border-black flex items-center justify-center bg-white">
                  <img className="w-full h-full object-contain" src={transformDropboxUrl(servicio.url_image)} alt={`Imagen de ${servicio.nombre}`} />
                </div>
                <h4 className="text-xl font-semibold text-gray-800">{servicio.nombre}</h4>
                <p className={`text-gray-600 mt-2 ${expandedService === servicio.id_servicio ? '' : 'line-clamp-4'}`}>
                  {servicio.informacion}
                </p>
                {servicio.informacion.length > 152 && (
                  <button className="text-blue-500 hover:underline mt-2" onClick={() => handleVerMas(servicio.id_servicio)}>
                    {expandedService === servicio.id_servicio ? 'Ver menos' : 'Ver más'}
                  </button>
                )}
              </div>
              <div className="p-4 flex-grow flex flex-col">
                <a href={servicio.url_pagina} target="_blank" rel="noreferrer" className="block w-full text-center text-white bg-secondary rounded-lg py-2 mb-2">
                  Información
                </a>
                {servicio.tipo === 'audio' && (
                  <div className="mt-4 relative">
                    {/* Botón para abrir/cerrar el dropdown */}
                    <button 
                      className="block w-full text-center text-white bg-warning rounded-lg py-2 mb-2" 
                      type="button" 
                      onClick={() => handleToggleAudioDropdown(servicio.id_servicio)}
                    >
                      {servicio.nombre_audios}
                    </button>
                    {/* Dropdown contenido */}
                    {isOpen && (
                      <div className="absolute left-0 right-0 bottom-full mb-2 bg-white rounded-lg shadow-lg p-4 text-left max-h-64 overflow-y-auto z-20">
                        {servicio.audios_servicio.map((audio) => (
                          <div key={audio.id_audio} className="mt-2">
                            <div className="bg-blue-400 text-white px-4 rounded-md mb-2">
                              <h3 className="text-lg font-bold">{audio.nombre}</h3>
                            </div>
                            <audio className="w-full mt-1" controls preload="none">
                              <source src={transformDropboxUrl(audio.url_audio)} type="audio/mpeg" />
                            </audio>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
</section>











      {/* SECCION PARA LA PUBLICIDAD */}
      {selectedRadio && publicidades.length > 0 && (
        <section className="bg-secondary py-12" id="publicidades">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white uppercase">PUBLICIDAD</h2>
              <h3 className="text-lg text-white mt-2">Sección reservada para la publicidad.</h3>
            </div>
            <div className={`grid gap-8 ${publicidades.length === 1 ? 'grid-cols-1' :
              publicidades.length === 2 ? 'sm:grid-cols-2' :
                publicidades.length === 3 ? 'sm:grid-cols-2 md:grid-cols-3' :
                  'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
              }`}>
              {publicidades.map((publicidad) => (
                <div key={publicidad.id_publicidad} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out max-w-xs w-full mx-auto h-96 flex flex-col">
                  <div className="flex-shrink-0">
                    <img className="w-full h-48 object-cover" src={transformDropboxUrl(publicidad.url_image)} alt={`Imagen de ${publicidad.nombre}`} />
                  </div>
                  <div className="p-4 text-center flex flex-col justify-between flex-grow">
                    <div>
                      <h4 className="text-xl font-semibold text-gray-800">{publicidad.nombre}</h4>
                      {/* Condicional para mostrar más o menos texto */}
                      <p className={`text-gray-600 mt-2 ${expandedService === publicidad.id_publicidad ? '' : 'line-clamp-3'}`}>
                        {publicidad.informacion}
                      </p>
                      {publicidad.informacion.length > 100 && (
                        <button className="text-blue-500 hover:underline mt-2" onClick={() => handleVerMas(publicidad.id_publicidad)}>
                          {expandedService === publicidad.id_publicidad ? 'Ver menos' : 'Ver más'}
                        </button>
                      )}
                    </div>
                    <div className="mt-4 flex justify-center space-x-3">
                      <a href={publicidad.url_twitter} className="text-gray-500 hover:text-gray-900 text-2xl"><i className="fab fa-twitter"></i></a>
                      <a href={publicidad.url_facebook} className="text-gray-500 hover:text-gray-900 text-2xl"><i className="fab fa-facebook-f"></i></a>
                      <a href={publicidad.url_instagram} className="text-gray-500 hover:text-gray-900 text-2xl"><i className="fab fa-instagram"></i></a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}


{/* SECCION PARA LOS PROGRAMAS Y PROGRAMACIONES */}
{selectedRadio && programas.length > 0 && (
  <section className="bg-light py-12">
    <div className="container mx-auto px-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-black uppercase">PROGRAMAS</h2>
        <h3 className="text-lg text-black mt-2">Sección reservada para los programas de {getRadioName(selectedRadio)}.</h3>
      </div>
      <div className={`grid gap-8 ${programas.length === 1 ? 'grid-cols-1' :
          programas.length === 2 ? 'sm:grid-cols-2' :
            programas.length === 3 ? 'sm:grid-cols-2 md:grid-cols-3' :
              'sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3'
        }`}>
        {programas.map((programa) => {
          const programacionesAgrupadas = groupProgramacionesByMonthAndYear(programa.programaciones || []);
          const isOpen = openDropdown === programa.id_programa;

          return (
            <div 
              key={programa.id_programa} 
              className={`relative bg-white rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out max-w-xs w-full mx-auto ${isOpen ? 'h-auto' : 'h-full max-h-[450px]'}`}
            >
              {/* Contenedor de la imagen */}
              <div className="w-full h-48 overflow-hidden rounded-t-lg flex items-center justify-center">
                <img className="max-w-full max-h-full object-contain" src={transformDropboxUrl(programa.url_banner)} alt={`Imagen de ${programa.nombre}`} />
              </div>
              <div className="p-4 text-center">
                <h4 className="text-xl font-semibold text-gray-800">{programa.nombre}</h4>
                <p className="text-gray-600 mt-2"><b>Conductor:</b> {programa.nombre_conductor}</p>
                <p className="text-gray-600 mt-2"><b>Certificado de Locución:</b> {programa.certificado_locucion}</p>
                <div className="relative mt-4">
                  {/* Botón para abrir/cerrar el dropdown */}
                  <button className="block w-full text-center text-white bg-warning rounded-lg py-2" type="button" onClick={() => handleToggleDropdown(programa.id_programa)}>
                    Programación
                  </button>
                  {/* Dropdown contenido */}
                  {isOpen && (
                    <div className="mt-2 bg-white rounded-lg shadow-lg p-4 text-left max-h-64 overflow-y-auto">
                      {Object.keys(programacionesAgrupadas).length > 0 ? (
                        Object.keys(programacionesAgrupadas).sort((a, b) => b - a).map((year) => (
                          <div key={year} className="mb-4">
                            <div className="bg-blue-600 text-white px-4 rounded-md">
                              <h3 className="text-lg font-bold">{year}</h3>
                            </div>
                            {Object.keys(programacionesAgrupadas[year]).sort((a, b) => new Date(b + ' 1') - new Date(a + ' 1')).map((month) => (
                              <div key={month} className="mt-2">
                                <div className="bg-blue-200 text-blue-900 px-3 py-1 rounded-md">
                                  <h4 className="text-md font-semibold">{month.charAt(0).toUpperCase() + month.slice(1)}</h4>
                                </div>
                                <div className="mt-2 ml-4">
                                  {programacionesAgrupadas[year][month].sort((a, b) => new Date(b.fecha_transmision) - new Date(a.fecha_transmision)).map((programacion, index) => (
                                    <div key={programacion.id_programacion} className={`mt-1 ${index < programacionesAgrupadas[year][month].length - 1 ? 'border-b border-gray-300' : ''} pb-2`}>
                                      <a href={transformDropboxUrl(programacion.url_audio)} className="block text-blue-500 hover:underline mb-1">{programacion.nombre}</a>
                                      <audio className="w-full mt-1" controls preload="none">
                                        <source src={transformDropboxUrl(programacion.url_audio)} type="audio/mpeg" />
                                      </audio>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-gray-600">Programación no disponible</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </section>
)}







      {/* SECCION PARA LOS ARTISTAS INVITADOS */}
      {selectedRadio && artistas.length > 0 && (
        <section className="bg-secondary py-8" id="artistas">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white uppercase">Artistas Invitados</h2>
              <h3 className="text-lg text-white mt-2">Sección reservada para los artistas invitados.</h3>
            </div>
            <div className={`grid gap-8 ${artistas.length === 1 ? 'grid-cols-1' :
                artistas.length === 2 ? 'sm:grid-cols-2' :
                  artistas.length === 3 ? 'sm:grid-cols-2 md:grid-cols-3' :
                    'sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3'
              }`}>
              {artistas.map((artista) => (
                <div
                  key={artista.id_artista}
                  className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out max-w-xs mx-auto"
                >
                  <a href="/" data-bs-toggle="modal" className="block">
                    <img
                      className="w-full h-48 object-cover rounded-t-lg"
                      src={transformDropboxUrl(artista.url_image)}
                      alt={`Imagen de ${artista.nombre}`}
                    />
                  </a>
                  <div className="p-4 text-center flex flex-col justify-between h-full">
                    <div>
                      <h4 className="text-xl font-semibold text-gray-800">{artista.nombre}</h4>
                      {/* Limitar el texto de información */}
                      <p className={`text-gray-600 mt-2 ${expandedArtist === artista.id_artista ? '' : 'line-clamp-3'}`}>
                        {artista.informacion}
                      </p>
                      {artista.informacion.length > 100 && (
                        <button className="text-blue-500 hover:underline mt-2" onClick={() => handleVerMasArtista(artista.id_artista)}>
                          {expandedArtist === artista.id_artista ? 'Ver menos' : 'Ver más'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}



      {/* SECCION PARA CONTACTO */}
      <section className="bg-black py-16" id="contact">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white uppercase" id='contacto'>Contáctanos</h2>
            <h3 className="text-xl text-white mt-2">Sección reservada para colaborar.</h3>
          </div>
          <form id="contactForm" data-sb-form-api-token="API_TOKEN" className="max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-5">
              <div>
                <input
                  className="w-full p-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="name"
                  type="text"
                  placeholder="Your Name *"
                  data-sb-validations="required"
                />
                <div className="text-red-500 text-sm mt-1 hidden" data-sb-feedback="name:required">A name is required.</div>
              </div>
              <div>
                <input
                  className="w-full p-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="email"
                  type="email"
                  placeholder="Your Email *"
                  data-sb-validations="required,email"
                />
                <div className="text-red-500 text-sm mt-1 hidden" data-sb-feedback="email:required">An email is required.</div>
                <div className="text-red-500 text-sm mt-1 hidden" data-sb-feedback="email:email">Email is not valid.</div>
              </div>
              <div>
                <input
                  className="w-full p-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="phone"
                  type="tel"
                  placeholder="Your Phone *"
                  data-sb-validations="required"
                />
                <div className="text-red-500 text-sm mt-1 hidden" data-sb-feedback="phone:required">A phone number is required.</div>
              </div>
              <div>
                <textarea
                  className="w-full p-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                  id="message"
                  placeholder="Your Message *"
                  data-sb-validations="required"
                ></textarea>
                <div className="text-red-500 text-sm mt-1 hidden" data-sb-feedback="message:required">A message is required.</div>
              </div>
            </div>
            <div className="hidden" id="submitSuccessMessage">
              <div className="text-center text-white mb-3">
                <div className="font-bold">Form submission successful!</div>
                To activate this form, sign up at
                <br />
                <a href="https://startbootstrap.com/solution/contact-forms" className="text-blue-400">https://startbootstrap.com/solution/contact-forms</a>
              </div>
            </div>
            <div className="hidden" id="submitErrorMessage">
              <div className="text-center text-red-500 mb-3">Error sending message!</div>
            </div>
            <div className="text-center">
              <button
                className="bg-blue-500 text-white font-semibold py-3 px-6 rounded-md uppercase transition duration-300 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                id="submitButton"
                type="submit"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </section>


      {/* Footer */}
      <Footer />
    </div >
  );
}

// Exporta el componente Home
export default Home;
