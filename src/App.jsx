import React from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "../src/componentes/ThemeContext/ThemeContext";
import { Header } from "./componentes/Header/Header";
import { ListaAnime } from "./componentes/ListaAnime/ListaAnime";
import { AnimeDetalle } from "./componentes/AnimeDetalles/AnimeDetalle";
import { AnimeTemporada } from "./componentes/AnimeTemporada/AnimeTemporada";
import { AnimeRecomendado } from "./componentes/AnimeRecomendado/AnimeRecomendado";
import { Favoritos } from "./componentes/Favoritos/Favoritos";
import {Footer} from "./componentes/Footer/Footer";
import "./reset.css";

export function App() {
    return (
        <ThemeProvider>
            <Header />
            <Routes>
                <Route path="/" element={<ListaAnime />} />
                <Route path="/anime/:id" element={<AnimeDetalle />} />
                <Route path="/anime-temporada" element={<AnimeTemporada />} />
                <Route path="/recomendaciones" element={<AnimeRecomendado />} />
                <Route path="/favoritos" element={<Favoritos />} />
            </Routes>
            <Footer/>
        </ThemeProvider>
    );
}