import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import "./Favoritos.css";

export function Favoritos() {
    const [animeDetails, setAnimeDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const ANIMES_PER_PAGE = 10;

    useEffect(() => {
        const loadFavorites = async () => {
            try {
                const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
                if (storedFavorites.length > 0) {
                    const reversedFavorites = [...storedFavorites].reverse();
                    const requests = reversedFavorites.map((id) =>
                        axios.get(`https://api.jikan.moe/v4/anime/${id}/full`)
                    );
                    const responses = await Promise.all(requests);
                    const details = responses.map((response) => response.data.data);
                    setAnimeDetails(details);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error al cargar favoritos:", error);
                setLoading(false);
            }
        };

        loadFavorites();
    }, []);

    const indexOfLastAnime = currentPage * ANIMES_PER_PAGE;
    const indexOfFirstAnime = indexOfLastAnime - ANIMES_PER_PAGE;
    const currentAnimes = animeDetails.slice(indexOfFirstAnime, indexOfLastAnime);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) {
        return <div>Cargando favoritos...</div>;
    }

    if (animeDetails.length === 0) {
        return (
            <section className="no-favorites-container">
                <div className="no-favorites-content">
                    <h2 className="no-favorites-title">¡Aún no tienes animes favoritos!</h2>
                    <p className="no-favorites-message">
                        Agrega tus animes favoritos desde la página.
                    </p>
                    <img
                        src="/Img/Favoritos.avif"
                        alt="No hay favoritos"
                        className="no-favorites-image"
                    />
                </div>
            </section>
        );
    }

    return (
        <main className="favoritos-container">
            <h1 className="favoritos-title">Mis Favoritos</h1>
            <ul className="favoritos-list">
                {currentAnimes.map((anime) => (
                    <li key={anime.mal_id} className="favorito-item">
                        <Link to={`/anime/${anime.mal_id}`} className="favorito-link">
                            <img
                                src={anime.images.jpg.image_url}
                                alt={anime.title}
                                className="favorito-image"
                            />
                            <div className="favorito-info">
                                <h3 className="favorito-title">{anime.title}</h3>
                                <p><strong className='favorito-type'>Tipo:</strong><span className='favorito-type-span'>{anime.type}</span></p>
                                <p><strong className='favorito-score'>Puntuación:</strong><span className='favorito-score-span'>{anime.score}</span></p>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
            <div className="pagination">
                <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="pagination-button"
                >
                    Anterior
                </button>
                <span className="pagination-info">
                    Página {currentPage} de {Math.ceil(animeDetails.length / ANIMES_PER_PAGE)}
                </span>
                <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === Math.ceil(animeDetails.length / ANIMES_PER_PAGE)}
                    className="pagination-button"
                >
                    Siguiente
                </button>
            </div>
        </main>
    );
}