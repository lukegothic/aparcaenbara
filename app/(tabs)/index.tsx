import { Image, StyleSheet, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { isWithinInterval, startOfTomorrow, closestIndexTo, format, isToday } from 'date-fns';
// import { es } from 'date-fns/locale/es';
// https://date-fns.org/v3.6.0/docs/isToday
// TODO: meter lo del plano/gps tb
// array base "dia de la semana" => 0: domingo, 1: lunes... 6 sábado
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
  }
]);

const tramoToDate = (tramo, date: Date) => {
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
const obtenerTramoRelevante = (now, tramosPorDia) => {
  // VERDE
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

  return Object.entries(zonas).reduce((acc, value) => {
    acc[value[0]] = obtenerTramoRelevante(now, value[1]);
    return acc;
  }, {});
}

export default function HomeScreen() {
  const now = new Date();
  const parkingZones = availableParkingZones(now);
  const zonaVerdeHabilitada = isWithinInterval(now, parkingZones.verde);
  const zonaVerdeFechaReferencia = zonaVerdeHabilitada ? parkingZones.verde.end : parkingZones.verde.start;
  const zonaRojaHabilitada = isWithinInterval(now, parkingZones.roja);
  const zonaRojaFechaReferencia = zonaRojaHabilitada ? parkingZones.roja.end : parkingZones.roja.start;
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Estado de las ZONAS de ESTACIONAMIENTO RESTRINGIDO TEMPORAL (ZERT) en Barañáin</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Zona Verde {zonaVerdeHabilitada ? "✔️" : "🚫"}</ThemedText>
        <ThemedText>
          {zonaVerdeHabilitada ? "Acaba a las ": "Comienza a las "}{format(zonaVerdeFechaReferencia, "HH:mm")}{isToday(zonaVerdeFechaReferencia) ? "." : " de mañana." }
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Zona Roja {zonaRojaHabilitada ? "✔️" : "🚫"}</ThemedText>
        <ThemedText>
          {zonaRojaHabilitada ? "Acaba a las ": "Comienza a las "}{format(zonaRojaFechaReferencia, "HH:mm")}{isToday(zonaRojaFechaReferencia) ? "." : " de mañana." }
        </ThemedText>
      </ThemedView>
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
