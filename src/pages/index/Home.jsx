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

const groupProgramacionesByMonthAndYear = (programaciones) => {
  const grouped = {};
  programaciones.forEach(programacion => {
    const date = new Date(programacion.fecha_transmision);
    const year = date.getFullYear();
    const month = date.toLocaleString('default', { month: 'long' });

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

      {/* SECCION PARA LOS SERVICIOS SOCIALES */}
      <section className="page-section bg-light" id="team">
        <div className="container" id="servicios">
          <div className="text-center">
            <h2 className="section-heading text-uppercase text-black" style={{ fontSize: '38px' }}>Servicio Social</h2>
            <h3 className="section-subheading text-black">Sección reservada para colaborar.</h3>
          </div>
          <div className="row">
            {serviciosSociales.length > 0 && serviciosSociales.map(servicio => (
              <div
                key={servicio.id_servicio}
                className={`justify-content-center ${serviciosSociales.length === 1 ? 'col-lg-12 col-md-12 col-sm-12' : serviciosSociales.length === 2 ? 'col-lg-6 col-md-12 col-sm-12' : serviciosSociales.length >= 3 ? 'col-lg-4 col-md-12 col-sm-12' : 'col-6'} px-5`}
              >
                <div className='team-member text-center mt-4'>
                  <img className='mx-auto rounded-circle-custom rounded-circle' src={transformDropboxUrl(servicio.url_image)} alt={`Imagen de ${servicio.nombre}`} />
                  <h4>{servicio.nombre}</h4>
                  <p className='text-black mb-2 mt-4'>{servicio.informacion}</p>
                </div>
                <div className='row mt-3 mb-3 justify-content-center'>
                  <div className={`d-flex justify-content-center ${servicio.tipo !== 'audio' ? 'col-md-12' : 'col-md-6'} mb-2 mb-md-0`}>
                    <a href={servicio.url_pagina} rel="noreferrer" target='_blank' className=' text-center btn btn-secondary btn-lg w-100 text-sm md:text-base wider-btn'>
                      Información
                    </a>
                  </div>
                  {servicio.tipo === 'audio' && (
                    <div className='col-md-6 d-flex justify-content-center'>
                      <div className='dropdown w-100'>
                        <button className='btn btn-warning btn-lg w-100 text-sm md:text-base wider-btn' type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                          {servicio.nombre_audios}
                        </button>
                        <ul className="dropdown-menu scrollable-menu" style={{ height: 'auto', maxHeight: '200px', overflowX: 'hidden' }} aria-labelledby="dropdownMenuButton1">
                          {servicio.audios_servicio.map(audio => (
                            <React.Fragment key={audio.id_audio}>
                              <li><a className="dropdown-item" href={transformDropboxUrl(audio.url_audio)}>{audio.nombre} - {audio.fecha}</a></li>
                              <li>
                                <audio id="stream" controls preload="none" style={{ width: '350px' }}>
                                  <source src={transformDropboxUrl(audio.url_audio)} type="audio/mpeg" />
                                </audio>
                              </li>
                            </React.Fragment>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECCION PARA LA PUBLICIDAD */}
      {selectedRadio && publicidades.length > 0 && (
        <section className="page-section bg-secondary" id="portfolio">
          <div className="container">
            <div className="text-center">
              <h2 className="section-heading text-uppercase text-white">PUBLICIDAD</h2>
              <h3 className="section-subheading text-white" id='publicidades'>Sección reservada para la publicidad.</h3>
            </div>
            <div className="row justify-content-center">
              {publicidades.map(publicidad => (
                <div
                  key={publicidad.id_publicidad}
                  className={`justify-content-center ${publicidades.length === 1 ? 'col-lg-12 col-md-12 col-sm-12' : publicidades.length === 2 ? 'col-lg-6 col-md-6 col-sm-6' : publicidades.length >= 3 ? 'col-lg-3 col-md-4 col-sm-6' : 'col-4'} d-flex`}
                >
                  <div className="team-member team-publicidad pb-2">
                    <img className="mx-auto" src={transformDropboxUrl(publicidad.url_image)} alt={`Imagen de ${publicidad.nombre}`} />
                    <h4 className='text-black'>{publicidad.nombre}</h4>
                    <p className="text-black mt-2 mb-3">{publicidad.informacion}</p>
                    <div className="social-buttons">
                      <a className="btn btn-dark btn-social mx-2" href={publicidad.url_twitter} aria-label="Twitter Profile"><i className="fab fa-twitter"></i></a>
                      <a className="btn btn-dark btn-social mx-2" href={publicidad.url_facebook} aria-label="Facebook Profile"><i className="fab fa-facebook-f"></i></a>
                      <a className="btn btn-dark btn-social mx-2" href={publicidad.url_instagram} aria-label="Instagram Profile"><i className="fab fa-instagram"></i></a>
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
        <section className="page-section bg-light" id="portfolio">
          <div className="container">
            <div className="text-center">
              <h2 className="section-heading text-uppercase text-black">PROGRAMAS</h2>
              <h3 className="section-subheading text-black" id='programas'>Sección reservada para los programas de {getRadioName(selectedRadio)}.</h3>
            </div>
            <div className="row justify-content-center">
              {programas.map(programa => (
                <div
                  key={programa.id_programa}
                  className={`justify-content-center ${programas.length === 1 ? 'col-lg-12 col-md-12 col-sm-12' : programas.length === 2 ? 'col-lg-6 col-md-6 col-sm-12' : programas.length >= 3 ? 'col-lg-4 col-md-6 col-sm-12' : 'col-4'} d-flex`}
                >
                  <div>
                    <div className="programas-item mb-3">
                      <img className="img-fluid" src={transformDropboxUrl(programa.url_banner)} alt={`Imagen de ${programa.nombre}`} />
                      <h4>{programa.nombre}</h4>
                      <p className='mb-2 mt-2'><b>Conductor:</b> {programa.nombre_conductor}</p>
                      <p className='mt-2'><b>Certificado de Locución:</b> {programa.certificado_locucion}</p>
                    </div>

                    <div className='dropdown w-100 mb-3'>
                      <button className='btn btn-warning btn-lg w-100 text-sm md:text-base' type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                        Programación
                      </button>
                      <ul className="dropdown-menu scrollable-menu" style={{ height: 'auto', maxHeight: '200px', overflowX: 'hidden' }} aria-labelledby="dropdownMenuButton1">
                        {programa.programacionesAgrupadas && Object.keys(programa.programacionesAgrupadas).length > 0 ? (
                          Object.keys(programa.programacionesAgrupadas).sort((a, b) => b - a).map(year => (
                            <li key={year}>
                              <h3 className="text-uppercase my-2 py-2" style={{ backgroundColor: '#3B82F6', color: '#FFFFFF', paddingLeft: '10px' }}>
                                {year}
                              </h3>
                              {Object.keys(programa.programacionesAgrupadas[year]).sort((a, b) => new Date(b + ' 1') - new Date(a + ' 1')).map(month => (
                                <li key={month}>
                                  <h4 className="text-uppercase my-2 py-1" style={{ backgroundColor: '#93C5FD', color: '#1E3A8A', paddingLeft: '20px' }}>
                                    {month}
                                  </h4>
                                  {programa.programacionesAgrupadas[year][month].sort((a, b) => new Date(b.fecha_transmision) - new Date(a.fecha_transmision)).map(programacion => (
                                    <React.Fragment key={programacion.id_programacion}>
                                      <li className="dropdown-item">
                                        <a className="dropdown-item" href={transformDropboxUrl(programacion.url_audio)}>
                                          {programacion.nombre} - {programacion.fecha_transmision}
                                        </a>
                                      </li>
                                      <li>
                                        <audio id="stream" controls preload="none" style={{ width: '350px' }}>
                                          <source src={transformDropboxUrl(programacion.url_audio)} type="audio/mpeg" />
                                        </audio>
                                      </li>
                                    </React.Fragment>
                                  ))}
                                </li>
                              ))}
                            </li>
                          ))
                        ) : (
                          <li className="dropdown-item text-center text-muted">Programación no disponible</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECCION PARA LOS ARTISTAS INVITADOS */}
      {selectedRadio && artistas.length > 0 && (
        <section className="page-section bg-secondary" id="portfolio">
          <div className="container">
            <div className="text-center">
              <h2 className="section-heading text-uppercase text-white">Artistas Invitados</h2>
              <h3 className="section-subheading text-white" id='artistas'>Sección reservada para los artistas invitados.</h3>
            </div>
            <div className="row justify-content-center">
              {artistas.map(artista => (
                <div
                  key={artista.id_artista}
                  className={`justify-content-center ${artistas.length === 1 ? 'col-lg-12 col-md-12 col-sm-12' : artistas.length === 2 ? 'col-lg-6 col-md-6 col-sm-12' : artistas.length >= 3 ? 'col-lg-4 col-md-4 col-sm-12' : 'col-4'} d-flex`}
                >
                  <div className="portfolio-item mb-5">
                    <a className="portfolio-link" data-bs-toggle="modal" href="/">
                      <div className="portfolio-hover">
                        <div className="portfolio-hover-content"><i className="fas fa-plus fa-3x"></i></div>
                      </div>
                      <img className="img-fluid" src={transformDropboxUrl(artista.url_image)} alt={`Imagen de ${artista.nombre}`} />
                    </a>
                    <div className="portfolio-caption">
                      <div className="portfolio-caption-heading">{artista.nombre}</div>
                      <div className="portfolio-caption-subheading text-muted">{artista.informacion}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECCION PARA CONTACTO */}
      <section className="page-section bg-black" id="contact">
        <div className="container">
          <div className="text-center">
            <h2 className="section-heading text-uppercase" id='contacto'>Contáctanos</h2>
            <h3 className="section-subheading text-white">Contáctanos.</h3>
          </div>
          <form id="contactForm" data-sb-form-api-token="API_TOKEN">
            <div className="row align-items-stretch mb-5">
              <div className="col-md-6">
                <div className="form-group">
                  <input className="form-control" id="name" type="text" placeholder="Your Name *" data-sb-validations="required" />
                  <div className="invalid-feedback" data-sb-feedback="name:required">A name is required.</div>
                </div>
                <div className="form-group">
                  <input className="form-control" id="email" type="email" placeholder="Your Email *" data-sb-validations="required,email" />
                  <div className="invalid-feedback" data-sb-feedback="email:required">An email is required.</div>
                  <div class="invalid-feedback" data-sb-feedback="email:email">Email is not valid.</div>
                </div>
                <div className="form-group mb-md-0">
                  <input className="form-control" id="phone" type="tel" placeholder="Your Phone *" data-sb-validations="required" />
                  <div className="invalid-feedback" data-sb-feedback="phone:required">A phone number is required.</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group form-group-textarea mb-md-0">
                  <textarea className="form-control" id="message" placeholder="Your Message *" data-sb-validations="required"></textarea>
                  <div className="invalid-feedback" data-sb-feedback="message:required">A message is required.</div>
                </div>
              </div>
            </div>
            <div className="d-none" id="submitSuccessMessage">
              <div className="text-center text-white mb-3">
                <div className="fw-bolder">Form submission successful!</div>
                To activate this form, sign up at
                <br />
                <a href="https://startbootstrap.com/solution/contact-forms">https://startbootstrap.com/solution/contact-forms</a>
              </div>
            </div>
            <div className="d-none" id="submitErrorMessage"><div className="text-center text-danger mb-3">Error sending message!</div></div>
            <div className="text-center"><button className="btn btn-primary btn-xl text-uppercase disabled" id="submitButton" type="submit">Send Message</button></div>
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
