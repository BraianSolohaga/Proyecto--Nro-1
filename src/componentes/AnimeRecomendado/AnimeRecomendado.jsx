import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './AnimeRecomendado.css';

export function AnimeRecomendado() {
    const [recomendaciones, setRecomendaciones] = useState([]); // Lista de recomendaciones cargadas
    const [visibleRecomendaciones, setVisibleRecomendaciones] = useState([]); // Recomendaciones visibles
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual
    const [hasMore, setHasMore] = useState(true); // Indica si hay más datos disponibles
    const RECOMMENDATIONS_PER_PAGE = 10; // Límite de recomendaciones visibles por página

    // Función para obtener las recomendaciones
    const fetchRecomendaciones = async (page) => {
        try {
            console.log(`Cargando página ${page}...`);
            const response = await fetch(`https://api.jikan.moe/v4/recommendations/anime?page=${page}`);
            if (!response.ok) {
                throw new Error('No se pudieron cargar las recomendaciones.');
            }
            const data = await response.json();

            // Ordena las recomendaciones por fecha (de más nueva a más antigua)
            const sortedData = data.data.sort((a, b) => new Date(b.date) - new Date(a.date));

            // Agrega nuevas recomendaciones a las existentes
            setRecomendaciones((prevRecomendaciones) => [...prevRecomendaciones, ...sortedData]);

            // Mostra solo las primeras 10 recomendaciones
            setVisibleRecomendaciones((prevVisible) => [
                ...prevVisible,
                ...sortedData.slice(0, RECOMMENDATIONS_PER_PAGE),
            ]);

            // Verifica si hay más páginas disponibles
            setHasMore(page < data.pagination.last_visible_page);

            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    // Función para verificar nuevas recomendaciones
    const checkForNewRecommendations = async () => {
        try {
            const response = await fetch(`https://api.jikan.moe/v4/recommendations/anime?page=1`);
            if (!response.ok) {
                throw new Error('No se pudieron cargar las recomendaciones.');
            }
            const data = await response.json();

            // Ordena las recomendaciones por fecha (de más nueva a más antigua)
            const sortedData = data.data.sort((a, b) => new Date(b.date) - new Date(a.date));

            // Compara las nuevas recomendaciones con las actuales
            const currentIds = new Set(recomendaciones.map((rec) => rec.mal_id));
            const newRecommendations = sortedData.filter((rec) => !currentIds.has(rec.mal_id));

            if (newRecommendations.length > 0) {
                // Agrega las nuevas recomendaciones al inicio de la lista
                setRecomendaciones((prevRecomendaciones) => [...newRecommendations, ...prevRecomendaciones]);
                setVisibleRecomendaciones((prevVisible) => [...newRecommendations, ...prevVisible]);
                console.log(`Se encontraron ${newRecommendations.length} nuevas recomendaciones.`);
            }
        } catch (err) {
            console.error('Error al verificar nuevas recomendaciones:', err.message);
        }
    };

    // Carga inicialmente
    useEffect(() => {
        fetchRecomendaciones(currentPage); // Carga la primera página

        // Verifica nuevas recomendaciones cada 60 segundos
        const intervalId = setInterval(checkForNewRecommendations, 60000); // 60 segundos

        // Limpia el intervalo al desmontar el componente
        return () => clearInterval(intervalId);
    }, []);

    // Función para cargar más recomendaciones
    const loadMore = () => {
        const nextBatch = recomendaciones.slice(
            visibleRecomendaciones.length,
            visibleRecomendaciones.length + RECOMMENDATIONS_PER_PAGE
        );
        setVisibleRecomendaciones((prevVisible) => [...prevVisible, ...nextBatch]);
    };

    // Función para cargar menos recomendaciones
    const loadLess = () => {
        if (visibleRecomendaciones.length > RECOMMENDATIONS_PER_PAGE) {
            // Elimina las últimas 10 recomendaciones visibles
            setVisibleRecomendaciones((prevVisible) =>
                prevVisible.slice(0, prevVisible.length - RECOMMENDATIONS_PER_PAGE)
            );
        }
    };

    if (loading && currentPage === 1) {
        return <p>Cargando recomendaciones...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="anime-recomendado">
            <h2 className="title">Recomendaciones</h2>
            <ul className="recomendaciones-list">
                {visibleRecomendaciones.map((recomendacion) => {
                    if (!recomendacion.entry || recomendacion.entry.length === 0) {
                        return null;
                    }

                    const date = new Date(recomendacion.date);

                    return (
                        <li key={recomendacion.mal_id} className="recomendacion-item">
                            {/* Contenedor principal */}
                            <div className="recomendacion-card">
                                {/* Muestra las dos imágenes con sus títulos */}
                                <div className="image-container">
                                    {recomendacion.entry.map((entry, index) => (
                                        <Link
                                            key={index}
                                            to={`/anime/${entry.mal_id}`} // Redirige al detalle del anime correspondiente
                                            className="image-link"
                                        >
                                            <div className="image-with-title">
                                                <img
                                                    src={entry.images.jpg.large_image_url || entry.images.jpg.small_image_url}
                                                    alt={entry.title}
                                                    className="image"
                                                />
                                                <p className="image-title">{entry.title}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                                <div className="recomendacion-info">
                                    <p className="info-text">{recomendacion.content}</p>
                                    <p className="info-text">
                                        <strong className='user'><span className='users-span'>Usuario:</span></strong>{' '}
                                        <span className="user user-span">{recomendacion.user?.username || 'Desconocido'}</span>
                                    </p>
                                    <p className="info-text">
                                        <strong className='date'><span className='date-span'>Fecha:</span></strong>{' '}
                                        <span className="date">{date.toLocaleDateString()}</span>
                                    </p>
                                    <p className="info-text">
                                        <strong className='hour'><span className='hour-span'>Hora:</span></strong>{' '}
                                        <span className="hour">{date.toLocaleTimeString()}</span>
                                    </p>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>

            {/* Botones de Cargar más y Cargar menos */}
            <div className="load-buttons-container">
                {hasMore && (
                    <button className="load-more-button" onClick={loadMore}>
                        {loading ? 'Cargando...' : 'Cargar más'}
                    </button>
                )}
                {visibleRecomendaciones.length > RECOMMENDATIONS_PER_PAGE && (
                    <button className="load-less-button" onClick={loadLess}>
                        Cargar menos
                    </button>
                )}
            </div>
        </div>
    );
}