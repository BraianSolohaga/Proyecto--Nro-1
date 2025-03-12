import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Estado para manejar el modo
    const [theme, setTheme] = useState("light");

    // Función para alternar entre el modo claro y oscuro
    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme); // Guarda el modo en el localStorage
    };

    useEffect(() => {
        // Verifica si hay un modo guardado en localStorage
        const savedTheme = localStorage.getItem("theme");
        const prefersDark =
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches;

        // Establece el modo inicial
        const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
        setTheme(initialTheme);

        // Escucha los cambios segun la preferencia del color del sistema
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = (e) => {
            if (!localStorage.getItem("theme")) {
                setTheme(e.matches ? "dark" : "light");
            }
        };

        mediaQuery.addEventListener("change", handleChange);

        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    // Valor que se pasa al contexto
    const value = {
        theme,
        toggleTheme,
    };

    return (
        <ThemeContext.Provider value={value}>
            <div className={theme}>{children}</div>
        </ThemeContext.Provider>
    );
};