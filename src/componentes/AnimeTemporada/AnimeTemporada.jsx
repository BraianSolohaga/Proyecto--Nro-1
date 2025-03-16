import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import './AnimeTemporada.css'; 

export function AnimeTemporada() {
    const [animes, setAnimes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual
    const [totalPages, setTotalPages] = useState(1); // Total de páginas disponibles
    const [viewMode, setViewMode] = useState('current'); 
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Año seleccionado
    const [selectedSeason, setSelectedSeason] = useState(getCurrentSeason()); // Temporada seleccionada

    // Función para obtener la temporada actual basada en la fecha
    function getCurrentSeason() {
        const month = new Date().getMonth() + 1;
        if (month >= 1 && month <= 3) return 'winter';
        if (month >= 4 && month <= 6) return 'spring';
        if (month >= 7 && month <= 9) return 'summer';
        return 'fall';
    }

    // Configuración de React Hook Form
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    useEffect(() => {
        const fetchAnimes = async () => {
            try {
                setLoading(true);
                let url;

                if (viewMode === 'filtered') {
                    // URL para el filtrado por año y temporada
                    url = `https://api.jikan.moe/v4/seasons/${selectedYear}/${selectedSeason}?page=${currentPage}`;
                } else if (viewMode === 'upcoming') {
                    // URL para la próxima temporada
                    url = `https://api.jikan.moe/v4/seasons/upcoming?page=${currentPage}`;
                } else {
                    // URL para la temporada actual
                    url = `https://api.jikan.moe/v4/seasons/now?page=${currentPage}`;
                }

                const response = await axios.get(url);

                if (response.data && response.data.data) {
                    setAnimes(response.data.data);
                    setTotalPages(response.data.pagination.last_visible_page); // Guarda el total de páginas
                }
            } catch (err) {
                console.error('Error al cargar los animes:', err);
                setError(`Error ${err.response?.status || 'desconocido'}: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchAnimes();
    }, [currentPage, viewMode, selectedYear, selectedSeason]); // Refetch cuando cambia la página o el modo de vista

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
            return title.slice(0, maxLength) + '...';
        }
        return title;
    }

    // Manejador del formulario de filtrado
    const handleFilterSubmit = (data) => {
        const { year, season } = data;

        // Valida el año
        const currentYear = new Date().getFullYear();
        if (year < 1900 || year > currentYear) {
            setError('El año debe estar entre 1900 y el año actual.');
            return;
        }

        // Valida la temporada
        const validSeasons = ['winter', 'spring', 'summer', 'fall'];
        if (!validSeasons.includes(season)) {
            setError('Por favor, selecciona una temporada válida.');
            return;
        }

        // Si pasa todas las validaciones, activa el modo de filtrado
        setSelectedYear(year);
        setSelectedSeason(season);
        setViewMode('filtered');
        setCurrentPage(1); // Reinicia la página a 1
        setError(null); // Limpia los errores
        reset(); // Limpia el formulario
    };

    // Botón para volver a la temporada actual
    const handleBackToCurrentSeason = () => {
        setViewMode('current'); // Volver al modo de temporada actual
        setCurrentPage(1); 
        setError(null); 
    };

    // Botón para ver la próxima temporada
    const handleUpcomingSeason = () => {
        setViewMode('upcoming'); // Cambia al modo de próxima temporada
        setCurrentPage(1); 
        setError(null); 
    };

    return (
        <main className="anime-container">
            {/* Formulario de filtrado */}
            <div className="filter-container">
                <form onSubmit={handleSubmit(handleFilterSubmit)} className="filter-form">
                    <label>
                        Año:
                        <input
                            type="number"
                            {...register('year', {
                                required: 'El año es obligatorio.',
                                min: {
                                    value: 1900,
                                    message: 'El año debe ser mayor o igual a 1900.',
                                },
                                max: {
                                    value: new Date().getFullYear(),
                                    message: `El año debe ser menor o igual a ${new Date().getFullYear()}.`,
                                },
                            })}
                            placeholder='Año (1900-2023)'
                        />
                        {errors.year && <p className="validation-error">{errors.year.message}</p>}
                    </label>
                    <label>
                        Temporada:
                        <select
                            {...register('season', {
                                required: 'La temporada es obligatoria.',
                                validate: (value) =>
                                    ['winter', 'spring', 'summer', 'fall'].includes(value) ||
                                    'Selecciona una temporada válida.',
                            })}
                        >
                            <option value="">Selecciona una temporada</option>
                            <option value="winter">Invierno</option>
                            <option value="spring">Primavera</option>
                            <option value="summer">Verano</option>
                            <option value="fall">Otoño</option>
                        </select>
                        {errors.season && <p className="validation-error">{errors.season.message}</p>}
                    </label>
                    <button type="submit" className="filter-button">
                        Filtrar
                    </button>
                </form>
            </div>

            {/* Botones para cambiar entre modos */}
            <div className="view-mode-buttons">
                {viewMode !== 'current' && (
                    <button className="mode-button" onClick={handleBackToCurrentSeason}>
                        Ver Temporada Actual
                    </button>
                )}
                {viewMode !== 'upcoming' && (
                    <button className="mode-button" onClick={handleUpcomingSeason}>
                        Ver Próxima Temporada
                    </button>
                )}
            </div>

            {/* Título principal */}
            {viewMode === 'current' && (
                <h2 className="anime-title">Animes de la Temporada Actual</h2>
            )}
            {viewMode === 'upcoming' && (
                <h2 className="anime-title">Animes de la Próxima Temporada</h2>
            )}
            {viewMode === 'filtered' && (
                <h2 className="anime-title">
                    Animes de {selectedSeason.charAt(0).toUpperCase() + selectedSeason.slice(1)} {selectedYear}
                </h2>
            )}

            {loading && (
                <div className="loading">
                    <p>Cargando animes...</p>
                </div>
            )}

            {error && (
                <div className="error">
                    <p>{error}</p>
                </div>
            )}

            {!loading && !error && (
                <>
                    {/* Listado de animes */}
                    <ul className="anime-grid">
                        {animes.map((anime) => (
                            <li key={anime.mal_id} className="anime-card">
                                <Link to={`/anime/${anime.mal_id}`} className="anime-link">
                                    <div className="anime-image-container">
                                        <img
                                            src={anime.images.jpg.image_url}
                                            alt={anime.title}
                                            className="anime-image"
                                        />
                                        {/* Título acortado */}
                                        <p className="anime-name-overlay">{truncateTitle(anime.title)}</p>
                                    </div>
                                    {/* Información adicional */}
                                    <div className="anime-info">
                                        <p className="anime-type">Tipo: {anime.type || 'N/A'}</p>
                                        <p className="anime-score">Puntuación: {anime.score || 'N/A'}</p>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>

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
                </>
            )}
        </main>
    );
}