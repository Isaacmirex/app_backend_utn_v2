function convertirStringAFecha (fechaString) {
    const fecha = new Date(fechaString);
    if (isNaN(fecha) || fecha.toString() === "Invalid Date") {
        console.error("La cadena proporcionada no es una fecha válida.");
        return null;
    }
    return fecha;
}

// Ejemplo de uso:
const fechaString = "2024-01-28";
const fechaConvertida = convertirStringAFecha(fechaString);

if (fechaConvertida) {
    console.log("Fecha convertida:", fechaConvertida);
}
