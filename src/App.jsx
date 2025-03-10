import React from 'react';
import { Routes, Route } from "react-router-dom";
import { Header } from './componentes/Header/Header';
import { ListaAnime } from './componentes/ListaAnime/ListaAnime';
import { AnimeDetalle } from './componentes/AnimeDetalles/AnimeDetalle';
import { AnimeTemporada } from './componentes/AnimeTemporada/AnimeTemporada';
import { AnimeRecomendado } from './componentes/AnimeRecomendado/AnimeRecomendado';

export function App() {
    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={<ListaAnime />} />
                <Route path="/anime/:id" element={<AnimeDetalle />} />
                <Route path="/anime-temporada" element={<AnimeTemporada />} />
                <Route path="/recomendaciones" element={<AnimeRecomendado />} />
            </Routes>
        </>
    );
}