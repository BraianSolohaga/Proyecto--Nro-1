import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from "react-router-dom";
import { FaStar } from "react-icons/fa"; // Ícono de estrella
import "./AnimeDetalle.css";

export function AnimeDetalle() {
    const { id } = useParams();
    const [anime, setAnime] = useState(null);
    const [relations, setRelations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false); // Estado para verificar si el anime es favorito
    const [showToast, setShowToast] = useState(false); // Estado para mostrar el mensaje de confirmación

    // Carga los IDs de favoritos desde localStorage
    useEffect(() => {
        const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        setIsFavorite(favorites.includes(id));
    }, [id]);

    useEffect(() => {
        const fetchAnimeDetails = async () => {
            try {
                // Obtiene los detalles del anime
                const animeResponse = await axios.get(`https://api.jikan.moe/v4/anime/${id}/full`);
                setAnime(animeResponse.data.data);

                // Obtiene las relaciones del anime
                const relationsResponse = await axios.get(`https://api.jikan.moe/v4/anime/${id}/relations`);
                setRelations(relationsResponse.data.data);

                setLoading(false);
            } catch (error) {
                console.error('Error al cargar los detalles del anime:', error);
                setLoading(false);
            }
        };
        fetchAnimeDetails();
    }, [id]);

    if (loading) {
        return <div>Cargando detalles...</div>;
    }

    if (!anime) {
        return <div>No se encontraron detalles del anime.</div>;
    }

    // Función para manejar el clic en el botón de favoritos
    const toggleFavorite = () => {
        const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        if (isFavorite) {
            // Elimina de favoritos
            const updatedFavorites = favorites.filter((favId) => favId !== id);
            localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
            setIsFavorite(false);
            setShowToast(true); // Muestra el mensaje de confirmación
            setTimeout(() => setShowToast(false), 2000); // Oculta el mensaje después de 2 segundos
        } else {
            // Agrega a favoritos
            const updatedFavorites = [...favorites, id];
            localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
            setIsFavorite(true);
            setShowToast(true); // Muestra el mensaje de confirmación
            setTimeout(() => setShowToast(false), 2000); // Oculta el mensaje después de 2 segundos
        }
    };

    // Filtra las relaciones por tipo
    const adaptations = relations.filter(relation => relation.relation === "Adaptation");
    const sideStories = relations.filter(relation => relation.relation === "Side Story");
    const sequels = relations.filter(relation => relation.relation === "Sequel");

    return (
        <div className="anime-details">
            {/* Título */}
            <h1 className="anime-title">{anime.title}</h1>

            {/* Botón de Favoritos */}
            <div className="favorite-button-container">
                <button
                    className={`favorite-button ${isFavorite ? "favorited" : ""}`}
                    onClick={toggleFavorite}
                    title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
                >
                    <FaStar size={20} />
                    {isFavorite ? "Favorito" : "Guardar en Favoritos"}
                </button>
            </div>

            {/* Mensaje de Confirmación (Toast) */}
            {showToast && (
                <div className="toast-message">
                    {isFavorite ? "¡Añadido a favoritos!" : "Eliminado de favoritos."}
                </div>
            )}

            {/* Puntuación, Puesto y Popularidad */}
            <div className="anime-stats-horizontal">
                <p><strong><span>Puntuación:</span></strong> {anime.score}</p>
                <p><strong><span>Puesto:</span></strong> <span className='numeral'>#</span>{anime.rank}</p>
                <p><strong><span>Popularidad:</span></strong> <span className='numeral'>#</span>{anime.popularity}</p>
            </div>

            {/* Imagen y Detalles Principales */}
            <div className="anime-image-details">
                <img
                    src={anime.images.jpg.image_url}
                    alt={anime.title}
                    className="anime-image"
                />
                <div className="anime-details-info">
                    <p><strong>Tipo:</strong> {anime.type}</p>
                    <p><strong>Episodios:</strong> {anime.episodes}</p>
                    <p><strong>Estado:</strong> {anime.status}</p>
                    <p><strong>Emisión:</strong> {anime.aired.string}</p>
                    <p><strong>Temporada:</strong> {anime.season} {anime.year}</p>
                    <p><strong>Estudio:</strong> {anime.studios.map((studio) => studio.name).join(", ")}</p>
                    <p><strong>Fuente:</strong> {anime.source}</p>
                    <p><strong>Géneros:</strong> {anime.genres.map((genre) => genre.name).join(", ")}</p>
                    <p><strong>Tema:</strong> {anime.themes.map((theme) => theme.name).join(", ")}</p>
                    <p><strong>Productores:</strong> {anime.producers.map((producer) => producer.name).join(", ")}</p>
                    <p><strong>Duración:</strong> {anime.duration}</p>
                    <p><strong>Demografía:</strong> {anime.demographics.map((demo) => demo.name).join(", ")}</p>
                </div>
            </div>

            {/* Sinopsis y Fondo */}
            <div className="anime-synopsis-background">
                <div className="anime-synopsis">
                    <p><strong>Sinopsis:</strong> {anime.synopsis}</p>
                </div>
                <div className="anime-background">
                    <p><strong>Fondo:</strong> {anime.background || "No disponible"}</p>
                </div>
            </div>

            {/* Sección de Secuelas */}
            {sequels.length > 0 && (
                <div className="relation-section">
                    <h2 className="relation-title">Secuelas</h2>
                    <ul className="relation-list">
                        {sequels.flatMap(relation => relation.entry).map((entry, idx) => (
                            <li key={idx} className="relation-item">
                                <a
                                    href={
                                        entry.type === "anime"
                                            ? `/anime/${entry.mal_id}`
                                            : entry.url
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {entry.name} ({entry.type})
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Sección de Adaptaciones */}
            {adaptations.length > 0 && (
                <div className="relation-section">
                    <h2 className="relation-title">Adaptaciones</h2>
                    <ul className="relation-list">
                        {adaptations.flatMap(relation => relation.entry).map((entry, idx) => (
                            <li key={idx} className="relation-item">
                                <a
                                    href={
                                        entry.type === "anime"
                                            ? `/anime/${entry.mal_id}`
                                            : entry.url
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {entry.name} ({entry.type})
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Sección de Historias Secundarias */}
            {sideStories.length > 0 && (
                <div className="relation-section">
                    <h2 className="relation-title">Historias Secundarias</h2>
                    <ul className="relation-list">
                        {sideStories.flatMap(relation => relation.entry).map((entry, idx) => (
                            <li key={idx} className="relation-item">
                                <a
                                    href={
                                        entry.type === "anime"
                                            ? `/anime/${entry.mal_id}`
                                            : entry.url
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {entry.name} ({entry.type})
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}