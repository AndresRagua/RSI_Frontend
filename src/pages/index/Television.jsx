import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Carousel } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import NavBarPublic from '../../components/PublicNavBar';
import Footer from '../../components/Footer';
import '../../static/css/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = process.env.REACT_APP_API_URL;

const transformDropboxUrl = (url) => {
    return url?.replace("www.dropbox.com", "dl.dropboxusercontent.com").replace("?dl=0", "");
};

const getYoutubeVideoId = (url) => {
    const videoIdMatch = url.match(/v=([^&]+)/);
    if (videoIdMatch) {
        return videoIdMatch[1];
    }
    return null;
};

function Television() {
    const [selectedRadio, setSelectedRadio] = useState(null);
    const [radios, setRadios] = useState([]);
    const [selectedRadioDetails, setSelectedRadioDetails] = useState({});
    const [television, setTelevision] = useState(null);
    const [carouselPaused, setCarouselPaused] = useState(false);

    const navigate = useNavigate();
    const { radioName } = useParams();

    const playerRefs = useRef({});

    useEffect(() => {
        fetchRadios();
    }, []);

    useEffect(() => {
        if (selectedRadio) {
            fetchTelevision(selectedRadio);
        }
    }, [selectedRadio]);

    useEffect(() => {
        if (radios.length > 0 && radioName) {
            const radio = radios.find(r => r.nombre === decodeURIComponent(radioName));
            if (radio) {
                setSelectedRadio(radio.id);
                setSelectedRadioDetails(radio);
            }
        }
    }, [radios, radioName]);

    useEffect(() => {
        if (television) {
            // Solo carga la API de YouTube si no se ha cargado antes
            if (!window.YT) {
                const tag = document.createElement('script');
                tag.src = "https://www.youtube.com/iframe_api";
                const firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

                // Configura el callback para cuando la API esté lista
                window.onYouTubeIframeAPIReady = () => {
                    initializePlayers();
                };
            } else {
                initializePlayers();
            }
        }

        // Limpieza al desmontar el componente
        return () => {
            Object.values(playerRefs.current).forEach(player => {
                if (player && player.destroy) {
                    player.destroy();
                }
            });
        };
    }, [television]);

    const initializePlayers = () => {
        if (television) {
            if (television.url_stream) {
                initializePlayer('youtube-player', getYoutubeVideoId(television.url_stream));
            }
            if (television.segundo_url_stream) {
                initializePlayer('youtube-player-second', getYoutubeVideoId(television.segundo_url_stream));
            }
        }
    };

    const initializePlayer = (id, videoId) => {
        if (!videoId) return;

        playerRefs.current[id] = new window.YT.Player(id, {
            videoId: videoId,
            events: {
                onStateChange: (event) => {
                    if (event.data === window.YT.PlayerState.PLAYING) {
                        setCarouselPaused(true);
                    } else if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.ENDED) {
                        setCarouselPaused(false);
                    }
                }
            }
        });
    };

    const fetchRadios = async () => {
        try {
            const res = await axios.get(`${API_URL}/radio/obtener`);
            setRadios(res.data);

            const savedRadio = localStorage.getItem('selectedRadio');
            if (savedRadio) {
                setSelectedRadio(parseInt(savedRadio));
                const radioDetails = res.data.find(radio => radio.id === parseInt(savedRadio));
                setSelectedRadioDetails(radioDetails);
            } else if (res.data.length > 0) {
                setSelectedRadio(res.data[0].id);
                setSelectedRadioDetails(res.data[0]);
                navigate(`/television/${encodeURIComponent(res.data[0].nombre)}`);
            }
        } catch (error) {
            console.error("Error fetching radios:", error);
        }
    };

    const fetchTelevision = async (radioId) => {
        try {
            const res = await axios.get(`${API_URL}/television/obtener_por_radio?radio_id=${radioId}`);
            if (res.data.length > 0) {
                setTelevision(res.data[0]);
            } else {
                setTelevision(null);
            }
        } catch (error) {
            console.error("Error fetching television:", error);
        }
    };

    const handleRadioChange = (radioId) => {
        setSelectedRadio(radioId);
        const radioDetails = radios.find(radio => radio.id === radioId);
        setSelectedRadioDetails(radioDetails);

        localStorage.setItem('selectedRadio', radioId);

        if (radioDetails) {
            navigate(`/television/${encodeURIComponent(radioDetails.nombre)}`);
        }
    };

    const getRadioName = (id) => {
        const radio = radios.find(radio => radio.id === id);
        return radio ? radio.nombre : 'Radio';
    };

    useEffect(() => {
        document.title = "Television";
      }, []);

    return (
        <div className="flex flex-col bg-gray-200 min-h-screen">
            <NavBarPublic selectedRadio={selectedRadio} setSelectedRadio={handleRadioChange} radios={radios} />

            {/* Carrusel de Televisión */}
            {television ? (
                <Carousel
                    interval={carouselPaused ? null : 10000}
                    pause={false}
                    prevIcon={
                        <span className="carousel-control-prev-icon inline-block bg-black rounded-full p-2"></span>
                    }
                    nextIcon={
                        <span className="carousel-control-next-icon inline-block bg-black rounded-full p-2"></span>
                    }
                >
                    {/* Item con imagen de fondo y stream */}
                    {television.url_image_fondo && (
                        <Carousel.Item className="carousel-item-custom">
                            <img
                                className="absolute top-0 left-0 w-full h-full object-cover"
                                src={transformDropboxUrl(television.url_image_fondo)}
                                alt={`Imagen de fondo de ${getRadioName(selectedRadio)}`}
                            />
                            <Carousel.Caption className="bg-slate-200 bg-opacity-75 p-4 rounded-md">
                                {television.url_stream && (
                                    <div className="flex justify-center items-center w-full h-full mt-4">
                                        <div id="youtube-player" className="rounded-md" style={{ width: '90%', maxWidth: '600px', height: '300px' }}></div>
                                    </div>
                                )}
                                <h3 className="text-black font-bold text-lg md:text-xl mt-4">Bienvenido a la Televisión de {getRadioName(selectedRadio)}</h3>
                                <p className="text-black text-sm md:text-base">Disfruta de la mejor programación.</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                    )}
                    {/* Segundo Item con imagen de fondo y stream */}
                    {television.segundo_url_image_fondo && (
                        <Carousel.Item className="carousel-item-custom">
                            <img
                                className="absolute top-0 left-0 w-full h-full object-cover"
                                src={transformDropboxUrl(television.segundo_url_image_fondo)}
                                alt={`Imagen de fondo de ${getRadioName(selectedRadio)}`}
                            />
                            <Carousel.Caption className="bg-slate-200 bg-opacity-75 p-4 rounded-md">
                                {television.segundo_url_stream && (
                                    <div className="flex justify-center items-center w-full h-full mt-4">
                                        <div id="youtube-player-second" className="rounded-md" style={{ width: '90%', maxWidth: '600px', height: '300px' }}></div>
                                    </div>
                                )}
                                <h3 className="text-black font-bold text-lg md:text-xl mt-4">Explora más de {getRadioName(selectedRadio)}</h3>
                                <p className="text-black text-sm md:text-base">Sigue disfrutando de nuestros contenidos.</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                    )}
                </Carousel>
            ) : (
                <div className="flex justify-center items-center h-64">
                    <p className="text-lg font-bold">Próximamente</p>
                </div>
            )}

            {/* Redes Sociales */}
            {television && (
                <section className="bg-secondary py-16" id="feed">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl md:text-4xl font-bold text-white">Redes Sociales</h2>
                            <p className="text-yellow-400">¡Síguenos en nuestras redes!</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Instagram */}
                            {television.url_instagram && (
                                <div className="flex flex-col items-center shadow-lg rounded-lg overflow-hidden bg-gradient-to-r from-pink-500 to-pink-300">
                                    <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 mt-2 flex items-center gap-2">
                                        <i className="fab fa-instagram text-white text-3xl"></i> Instagram
                                    </h2>
                                    <a
                                        href={television.url_instagram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white font-semibold py-3 px-6 mb-2 rounded-lg bg-pink-600 transition-transform transform hover:scale-105 hover:shadow-lg no-underline"
                                    >
                                        Visita nuestro Instagram
                                    </a>
                                </div>
                            )}

                            {/* Twitter */}
                            {television.url_twitter && (
                                <div className="flex flex-col items-center shadow-lg rounded-lg overflow-hidden bg-gradient-to-r from-blue-500 to-blue-300">
                                    <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 mt-2 flex items-center gap-2">
                                        <i className="fab fa-twitter text-white text-3xl"></i> Twitter
                                    </h2>
                                    <a
                                        href={television.url_twitter}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white font-semibold py-3 px-6 mb-2 rounded-lg bg-blue-600 transition-transform transform hover:scale-105 hover:shadow-lg no-underline"
                                    >
                                        Visita nuestro Twitter
                                    </a>
                                </div>
                            )}

                            {/* Facebook */}
                            {television.url_facebook && (
                                <div className="flex flex-col items-center shadow-lg rounded-lg overflow-hidden bg-gradient-to-r from-blue-800 to-blue-500">
                                    <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 mt-2 flex items-center gap-2">
                                        <i className="fab fa-facebook-f text-white text-3xl"></i> Facebook
                                    </h2>
                                    <a
                                        href={television.url_facebook}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white font-semibold py-3 px-6 rounded-lg bg-blue-700 transition-transform transform hover:scale-105 hover:shadow-lg no-underline"
                                    >
                                        Visita nuestro Facebook
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <Footer />
        </div>
    );
}

export default Television;
