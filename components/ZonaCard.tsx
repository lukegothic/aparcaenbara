import { Linking, Text, TouchableOpacity, View } from "react-native";
import styles from "../styles";
import { generateGoogleCalendarLink } from "../Utils";
import { differenceInMinutes, format, isToday } from "date-fns";

const zoneColors = {
    "verde": {
        borderColor: "#4CAF50",
    },
    "roja": {
        borderColor: "#f44336",
    }
}

const addToCalendar = (zona, fecha) => {
  // Aquí puedes enlazar la lógica para agregar un recordatorio al calendario
  const url = generateGoogleCalendarLink("Mover coche de la zona " + zona.toUpperCase(), fecha, fecha, "", "", "Europe/Madrid");
  Linking.openURL(url); // Reemplaza con la URL o función para agregar al calendario
};

const ZonaCard = ({ now, zona, datos }) => {
  return (
    <View style={[styles.card, styles.zonesCard, { borderLeftColor: zoneColors[zona].borderColor, backgroundColor: datos.activa ? '#E6F9EB' : '#F9E6E6' }]}>
      {/* Background icon indicating if parking is allowed */}
      <View style={styles.iconBackground}>
        {datos.activa ? (
          <Text style={styles.icon}>✔️</Text>
        ) : (
          <Text style={styles.icon}>🚫</Text>
        )}
      </View>
      
      {/* Zone details */}
      <View style={styles.zoneInfo}>
        <Text style={styles.zoneName}>Zona {zona.toUpperCase()}</Text>
        <Text style={styles.zoneDetails}>
        { datos.activa ? `Hasta las ${format(datos.fecha, "HH:mm")} de ${isToday(datos.fecha) ? "hoy" : "mañana"}. ` : (differenceInMinutes(datos.fecha, now) <= 60 ? `No permitido, disponible en ${differenceInMinutes(datos.fecha, now)} minutos.` : "Estacionamiento no permitido.") }
        </Text>
        { datos.activa && <TouchableOpacity onPress={() => addToCalendar(zona, datos.fecha)}>
          <Text style={styles.calendarLink}>Añadir recordatorio en calendario</Text>
        </TouchableOpacity> }
      </View>
    </View>
  );
};

export default ZonaCard;
