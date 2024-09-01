function generateGoogleCalendarLink(eventName, startDateTime, endDateTime = startDateTime, description = "", location = "", timezone = "") {
    const baseURL = "https://www.google.com/calendar/render?action=TEMPLATE";
    
    const text = encodeURIComponent(eventName);
    const dates = formatDateTime(startDateTime) + (endDateTime ? "/" + formatDateTime(endDateTime) : "");
    const details = encodeURIComponent(description);
    const loc = encodeURIComponent(location);
    const ctz = encodeURIComponent(timezone);
    
    const fullURL = `${baseURL}&text=${text}&dates=${dates}&details=${details}&location=${loc}&ctz=${ctz}`;
    
    return fullURL;
}

function formatDateTime(dateTime) {
    return dateTime.toISOString().replace(/-|:|\.\d{3}/g, "");
}
/*
// Ejemplo de uso
const eventName = "Reunión de equipo";
const startDateTime = new Date("2024-09-01T10:00:00");
const endDateTime = null; // No se especifica endDateTime
const description = "Reunión para discutir el progreso del proyecto.";
const location = "Oficina principal";
const timezone = "America/Los_Angeles";

const link = generateGoogleCalendarLink(eventName, startDateTime, endDateTime, description, location, timezone);
console.log(link);
*/

export { generateGoogleCalendarLink };