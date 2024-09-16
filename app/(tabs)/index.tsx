import { Image, StyleSheet, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { isWithinInterval, startOfTomorrow, closestIndexTo, format, isToday, differenceInMinutes } from 'date-fns';
import { useEffect, useState } from 'react';
import { es } from 'date-fns/locale/es';
import { generateGoogleCalendarLink } from '@/src/utils';
// https://date-fns.org/v3.6.0/docs/isToday
// TODO: meter lo del plano/gps tb
// array base "dia de la semana" => 0: domingo, 1: lunes... 6 sábado
interface Time {
  hour: number,
  minute: number,
  second: number
}
interface Tramo {
  start: Time,
  end: Time
}

const zonaVerdePorDiaSemana = [
  [
    {
      start: { hour: 0, minute: 0, second: 0 },
      end: { hour: 21, minute: 0, second: 0 }
    }
  ], [
    {
      start: { hour: 10, minute: 0, second: 0 },
      end: { hour: 21, minute: 0, second: 0 }
    }
  ], [
    {
      start: { hour: 10, minute: 0, second: 0 },
      end: { hour: 21, minute: 0, second: 0 }
    }
  ], [
    {
      start: { hour: 10, minute: 0, second: 0 },
      end: { hour: 21, minute: 0, second: 0 }
    }
  ], [
    {
      start: { hour: 10, minute: 0, second: 0 },
      end: { hour: 21, minute: 0, second: 0 }
    }
  ], [
    {
      start: { hour: 10, minute: 0, second: 0 },
      end: { hour: 21, minute: 0, second: 0 }
    }
  ], [
    {
      start: { hour: 10, minute: 0, second: 0 },
      end: { hour: 45, minute: 0, second: 0 }
    }
  ]
];

const zonaRojaPorDiaSemana = new Array(7).fill([{
    start: { hour: 20, minute: 0, second: 0 },
    end: { hour: 32, minute: 0, second: 0 }
  }, {
    start: { hour: 0, minute: 0, second: 0 },
    end: { hour: 8, minute: 0, second: 0 }
  }
]);

const tramoToDate = (tramo: Tramo, date: Date) => {
  const start = new Date(date);
  start.setHours(tramo.start.hour, tramo.start.minute, tramo.start.second);
  const end = new Date(date);
  end.setHours(tramo.end.hour, tramo.end.minute, tramo.end.second);
  return {
    start,
    end
  }
}
// Puede devolver bien el tramo en el que estamos, o el siguiente tramo disponible
// now: fecha
// tramosPorDia: Array[7] con los tramos por día, siendo 0:Domingo, 1:Lunes... 6:Sábado
const obtenerTramoRelevante = (now: Date, tramosPorDia: Tramo[][]) => {
  const zonaHoy = tramosPorDia[now.getDay()].map(tramo => tramoToDate(tramo, now));
  const tramoAhora = zonaHoy.find(tramo => isWithinInterval(now, tramo));
  if (tramoAhora) {
    return tramoAhora;
  } else {
    const tomorrow = startOfTomorrow();
    const tramosSiguientesHoy = zonaHoy.filter(tramo => tramo.start > now);
    const tramosSiguientesManana = tramosPorDia[tomorrow.getDay()].map(tramo => tramoToDate(tramo, tomorrow));
    const tramosSiguientes = (new Array()).concat(tramosSiguientesHoy, tramosSiguientesManana)
    const tramoNextIndex = closestIndexTo(now, tramosSiguientes.map(tramo => tramo.start))!;
    return tramosSiguientes[tramoNextIndex];
  }
}

interface DatosZona {
  activa: boolean;
  fecha: Date;
}

interface Zonas {
  [key: string]: DatosZona;
}

const availableParkingZones = (now: Date) => {
  // Para cada zona, se devuelve el tramo relevante, el código es equivalente al siguiente código no dinámico pero más explicito
  /*
  return {
    verde: obtenerTramoRelevante(now, zonaVerdePorDiaSemana),
    roja: obtenerTramoRelevante(now, zonaRojaPorDiaSemana),
  }
  */

  const zonas = {
    "verde": zonaVerdePorDiaSemana,
    "roja": zonaRojaPorDiaSemana
  };

  return Object.entries(zonas).reduce((acc: Zonas, [zona, tramosDiarios]) => {
    const tramoRelevante = obtenerTramoRelevante(now, tramosDiarios);
    const tramoEstaActivo = isWithinInterval(now, tramoRelevante);
    acc[zona] = {
      activa: tramoEstaActivo,
      fecha: tramoEstaActivo ? tramoRelevante.end : tramoRelevante.start
    }
    return acc;
  }, {});
}

export default function HomeScreen() {
  const [now, setNow] = useState(new Date());
  const [zonas, setZonas] = useState(availableParkingZones(now));

  useEffect(() => {
    setZonas(availableParkingZones(now));
  }, [now]);

  useEffect(() => {
    window.setInterval(() => setNow(new Date()), 5000);
  }, []);

  // TODO: poner bonito
  const sePuedeAparcar = Object.entries(zonas).some(([zona, datos]) => datos.activa);
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/aparcaenbara.jpeg')}
          style={styles.reactLogo}
        />
      }> 
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Estado de las ZONAS de ESTACIONAMIENTO RESTRINGIDO TEMPORAL (ZERT) en Barañáin</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Hora actual ⏰ {format(now, "H:mm 'del' d 'de' MMMM", { locale: es })}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">¿Puedes aparcar? {sePuedeAparcar ? "Si, aunque no seas residente" : "No"}</ThemedText>
      </ThemedView>
      { sePuedeAparcar && <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">¿Tienes que pagar? No</ThemedText>
      </ThemedView>
      }     
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">¿Dónde puedes aparcar?</ThemedText>
      </ThemedView>
      {
        Object.entries(zonas).map(([zona, datos]) =>
          <ThemedView key={zona} style={styles.stepContainer}>
            <ThemedText type="subtitle">Zona {zona.toUpperCase()} {datos.activa ? "✔️" : "🚫"}</ThemedText>
            <ThemedText>
              {datos.activa && `Hasta las ${format(datos.fecha, "HH:mm")} de ${isToday(datos.fecha) ? "hoy" : "mañana"}.`}
              {(!datos.activa && differenceInMinutes(datos.fecha, now) <= 60) && `Activa en ${differenceInMinutes(datos.fecha, now)} minutos.`} 
            </ThemedText>
            {datos.activa && 
            <ThemedText>
               <a href={generateGoogleCalendarLink("Mover coche de la zona " + zona.toUpperCase(), datos.fecha, datos.fecha, "", "", "Europe/Madrid")} target="_blank">Añadir recordatorio en calendario</a>
            </ThemedText>
            }
          </ThemedView>
        )
      }
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Disclaimer</ThemedText>
        <ThemedText>
          Las indicaciones de esta página web han sido generadas automáticamente siguiendo la <a href="https://www.baranain.es/general/zert/">guía de horarios ZERT oficial del Ayuntamiento de Barañain.</a> Los horarios de la ZERT cambian en los periodos festivos tales como la semana de festejos de Barañáin y el periodo de Navidad. Consulte la web proporcionada si la fecha actual se encuentra en un periodo festivo.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
