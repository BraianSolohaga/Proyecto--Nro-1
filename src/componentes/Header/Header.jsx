import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { BiSearch } from "react-icons/bi";
import { FaBars } from "react-icons/fa";
import { FaSpinner } from "react-icons/fa"; // Ícono de carga
import { AiOutlineWarning } from "react-icons/ai"; // Ícono de advertencia
import { FaStar } from "react-icons/fa"; // Ícono de estrella
import { BsSun, BsMoon } from "react-icons/bs"; // Íconos de modo claro/oscuro
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ThemeContext } from "../ThemeContext/ThemeContext"; 
import "./Header.css";

export function Header() {
    const [searchResults, setSearchResults] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [loading, setLoading] = useState(false); // Estado para el indicador de carga
    const [error, setError] = useState(null); // Estado para mensajes de error
    const [isFocused, setIsFocused] = useState(false); // Estado para controlar el foco del input

    const { theme, toggleTheme } = useContext(ThemeContext);

    // Configuración de React Hook Form
    const {
        register,
        watch,
        formState: { errors },
        reset,
    } = useForm();

    // Observa el valor del campo de búsqueda en tiempo real
    const searchQuery = watch("searchQuery");

    // Función para manejar la búsqueda en tiempo real
    useEffect(() => {
        const handleSearch = async () => {
            if (!searchQuery || searchQuery.trim() === "") {
                setSearchResults([]); // Limpia los resultados si el campo está vacío
                setError(null); // Limpia los errores
                return;
            }
            try {
                setLoading(true); // Activa el indicador de carga
                setError(null); // Limpia errores previos
                const response = await axios.get(`https://api.jikan.moe/v4/anime`, {
                    params: {
                        q: searchQuery,
                        limit: 5, // Limita a 5 resultados para evitar sobrecarga
                    },
                });
                if (response.data && response.data.data && response.data.data.length > 0) {
                    setSearchResults(response.data.data); // Guarda resultados
                    setError(null); 
                } else {
                    setError("No se encontraron resultados para tu búsqueda."); // Mensaje cuando no hay resultados
                    setSearchResults([]); // Limpia resultados
                }
            } catch (err) {
                console.error("Error al buscar animes:", err);
                setError("Ocurrió un error al conectar con la API."); // Mensaje de error 
            } finally {
                setLoading(false); // Desactiva el indicador de carga
            }
        };

        // Evita realizar búsquedas innecesarias si el campo está vacío o tiene menos de 3 caracteres
        if (searchQuery && searchQuery.trim().length >= 3) {
            handleSearch();
        } else if (searchQuery && searchQuery.trim().length < 3) {
            setError("El término de búsqueda debe tener al menos 3 caracteres.");
            setSearchResults([]);
        } else {
            setError(null);
            setSearchResults([]); 
        }
    }, [searchQuery]); // Se ejecuta cada vez que cambia el valor del campo de búsqueda

    return (
        <header className="header">
            <nav className="nav">
                {/* Botón de menú */}
                <div className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <FaBars size={24} color="#fff" />
                </div>

                {/* Menú de navegación */}
                <ul className={`menu ${isMenuOpen ? "active" : ""}`}>
                    <li>
                        <Link to="/">
                            <h1 className="logo">AnimeList</h1>
                        </Link>
                    </li>
                    <li>
                        <Link to="/">Animes</Link>
                    </li>
                    <li>
                        <Link to="/anime-temporada">Anime de temporada</Link>
                    </li>
                    <li>
                        <Link to="/recomendaciones">Recomendados</Link>
                    </li>
                    <li>
                        <Link to="/favoritos" className="favorites-link">
                            <FaStar size={20} color="#FFD700" /> Favoritos
                        </Link>
                    </li>
                </ul>

                {/* Contenedor principal para el buscador y el botón de tema */}
                <div className="search-and-theme-container">
                    {/* Buscador */}
                    <div className="search-container">
                        <form className="search-form">
                            <input
                                type="text"
                                placeholder="Buscar anime..."
                                {...register("searchQuery", {
                                    minLength: {
                                        value: 3,
                                        message: "El término de búsqueda debe tener al menos 3 caracteres.",
                                    },
                                })}
                                onFocus={() => setIsFocused(true)} 
                                onBlur={() => setTimeout(() => setIsFocused(false), 200)} // 
                            />
                            <button type="submit">
                                <BiSearch size={20} color="#fff" />
                            </button>
                        </form>

                        {/* Mensaje de validación */}
                        {errors.searchQuery && (
                            <p className="validation-error">{errors.searchQuery.message}</p>
                        )}

                        {/* Indicador de carga */}
                        {loading && isFocused && (
                            <div className="search-results">
                                <div className="search-error loading-message">
                                    <span className="search-error-icon loading">
                                        <FaSpinner size={20} color="#00bcd4" className="spinner-icon" />
                                    </span>
                                    <span>Cargando resultados...</span>
                                </div>
                            </div>
                        )}

                        {/* Mensaje de error */}
                        {!loading && error && isFocused && (
                            <div className="search-results">
                                <div className="search-error error-message">
                                    <span className="search-error-icon warning">
                                        <AiOutlineWarning size={20} color="#ff5252" />
                                    </span>
                                    <span>{error}</span>
                                </div>
                            </div>
                        )}

                        {/* Resultados de búsqueda */}
                        {!loading && !error && searchResults.length > 0 && isFocused && (
                            <ul className="search-results">
                                {searchResults.map((anime) => (
                                    <li key={anime.mal_id} className="search-result-item">
                                        <Link to={`/anime/${anime.mal_id}`} className="search-result-link">
                                            <img
                                                src={anime.images.jpg.small_image_url}
                                                alt={anime.title}
                                                className="search-result-image"
                                            />
                                            <div className="search-result-info">
                                                <h5 className="search-result-title">{anime.title}</h5>
                                                <p className="search-result-type">{anime.type}</p>
                                            </div>
                                            <div className="search-result-hover">
                                                <p>
                                                    <strong>Emisión:</strong> {anime.aired?.string || "N/A"}
                                                </p>
                                                <p>
                                                    <strong>Puntuación:</strong> {anime.score || "N/A"}
                                                </p>
                                                <p>
                                                    <strong>Estado:</strong> {anime.status || "N/A"}
                                                </p>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Botón de cambio de tema */}
                    <button onClick={toggleTheme} className="theme-toggle">
                        {theme === "light" ? <BsMoon size={24} /> : <BsSun size={24} />}
                    </button>
                </div>
            </nav>
        </header>
    );
}