import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./ListaAnime.css";

export function ListaAnime() {
    const [animes, setAnimes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [genres, setGenres] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);

    // Obtiene los géneros disponibles
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await axios.get("https://api.jikan.moe/v4/genres/anime");
                setGenres(response.data.data);
            } catch (error) {
                console.error("Error al obtener géneros:", error);
            }
        };
        fetchGenres();
    }, []);

    // Obtiene los animes según los géneros seleccionados y la páginas
    useEffect(() => {
        const fetchAnimes = async () => {
            try {
                setLoading(true);
                let url = `https://api.jikan.moe/v4/anime?page=${currentPage}`;

                if (selectedGenres.length > 0) {
                    url += `&genres=${selectedGenres.join(",")}`;
                }

                const response = await axios.get(url);
                setAnimes(response.data.data);
                setTotalPages(response.data.pagination.last_visible_page);
                setLoading(false);
            } catch (error) {
                console.error("Error al buscar animes:", error);
                setLoading(false);
            }
        };
        fetchAnimes();
    }, [currentPage, selectedGenres]);

    // Función para cambiar a la página anterior
    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Función para cambiar a la página siguiente
    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Función para acortar el título del anime
    function truncateTitle(title, maxLength = 35) {
        if (title.length > maxLength) {
            return title.slice(0, maxLength) + "...";
        }
        return title;
    }

    // Maneja los cambios en la selección de géneros
    const handleGenreChange = (genreId) => {
        if (selectedGenres.includes(genreId)) {
            setSelectedGenres(selectedGenres.filter((id) => id !== genreId));
        } else {
            setSelectedGenres([...selectedGenres, genreId]);
        }
    };

    // Limpia los generos seleccionados
    const clearSelection = () => {
        setSelectedGenres([]);
    };

    return (
        <main className="anime-container">
            {/* Filtro de géneros */}
            <div className="filter-container">
                <div className="genre-filter">
                    <button className="filter-button">Filtrar Género</button>
                    <div className="dropdown-menu">
                        <div className="dropdown-header">
                            <h4 className="dropdown-title">Selecciona Géneros</h4>
                            <button className="clear-button" onClick={clearSelection}>
                                Limpiar
                            </button>
                        </div>
                        <div className="checkbox-grid">
                            {genres.map((genre) => (
                                <label key={genre.mal_id} className="checkbox-item">
                                    <input
                                        type="checkbox"
                                        checked={selectedGenres.includes(genre.mal_id)}
                                        onChange={() => handleGenreChange(genre.mal_id)}
                                    />
                                    {genre.name}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Etiquetas seleccionadas */}
                {selectedGenres.length > 0 && (
                    <div className="selected-genres">
                        {selectedGenres.map((genreId) => {
                            const genreName = genres.find((g) => g.mal_id === genreId)?.name || "Desconocido";
                            return (
                                <div key={genreId} className="selected-genre">
                                    {genreName}
                                    <button onClick={() => handleGenreChange(genreId)}>x</button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <h1 className="anime-title">Listado de Animes</h1>

            <div className="anime-grid">
                {loading ? (
                    <div className="loading">Cargando...</div>
                ) : (
                    animes.map((anime) => (
                        <Link to={`/anime/${anime.mal_id}`} key={anime.mal_id} className="anime-card-link">
                            <div className="anime-card">
                                <div className="anime-image-container">
                                    <img src={anime.images.jpg.image_url} alt={anime.title} className="anime-image" />
                                    <h3 className="anime-name-overlay">{truncateTitle(anime.title)}</h3>
                                </div>
                                <div className="anime-info">
                                    <p className="anime-type">Tipo: {anime.type || "N/A"}</p>
                                    <p className="anime-score">Puntuación: {anime.score || "N/A"}</p>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>

            {/* Paginación */}
            <div className="pagination">
                <button
                    className="pagination-button"
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                >
                    Anterior
                </button>
                <span className="pagination-info">
                    Página {currentPage} de {totalPages}
                </span>
                <button
                    className="pagination-button"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                >
                    Siguiente
                </button>
            </div>
        </main>
    );
}