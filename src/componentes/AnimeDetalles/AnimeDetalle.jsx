import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from "react-router-dom";
import "./AnimeDetalle.css";

export function AnimeDetalle() {
    const { id } = useParams();
    const [anime, setAnime] = useState(null);
    const [relations, setRelations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnimeDetails = async () => {
            try {
                // Obtiene el detalles del anime
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

    // Filtra las relaciones por tipo
    const adaptations = relations.filter(relation => relation.relation === "Adaptation");
    const sideStories = relations.filter(relation => relation.relation === "Side Story");
    const sequels = relations.filter(relation => relation.relation === "Sequel");

    return (
        <div className="anime-details">
            {/* Título */}
            <h1 className="anime-title">{anime.title}</h1>

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