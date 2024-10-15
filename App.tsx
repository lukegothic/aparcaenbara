import React from 'react';
import { useEffect, useState } from 'react';
import styles from './styles';
import { View, Text, ScrollView } from 'react-native';
import { isWithinInterval, startOfTomorrow, closestIndexTo, format, differenceInMinutes } from 'date-fns';
import { es } from 'date-fns/locale/es';
/*import { useFonts } from 'expo-font';
import { ChivoMono_700Bold } from '@expo-google-fonts/chivo-mono';
*/
import * as SplashScreen from 'expo-splash-screen';
import ZonaCard from './components/ZonaCard';
import QuestionAnswer from './components/QuestionAnswer';


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

const availableParkingZones = (now: Date): Zonas => {
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



const App = () => {
  // const [fontsLoaded] = useFonts({ ChivoMono_700Bold });
  const [now, setNow] = useState(new Date());
  const [zonas, setZonas] = useState(availableParkingZones(now));

  useEffect(() => {
    setZonas(availableParkingZones(now));
  }, [now]);

  /*
  useEffect(() => {
    fontsLoaded && SplashScreen.hideAsync();
  }, [fontsLoaded]);
  */
  useEffect(() => {
    window.setInterval(() => setNow(new Date()), 5000);
  }, []);

  const sePuedeAparcar = Object.entries(zonas).some(([zona, datos]) => datos.activa);
  const sePuedeAparcarProximamente = Object.entries(zonas).some(([zona, datos]) => !datos.activa && differenceInMinutes(datos.fecha, now) <= 60);
  console.log(sePuedeAparcar, sePuedeAparcarProximamente);
  // Evitar que la pantalla de presentación se oculte automáticamente
  // SplashScreen.preventAutoHideAsync();

  return (
    <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Estacionamiento en Barañáin</Text>
        </View>
        {/* Current Time */}
        <View style={styles.currentTime}>
          <Text>Hora actual: <Text style={{ fontWeight: 'bold' }}>{format(now, "H:mm 'del' d 'de' MMMM", { locale: es })}</Text></Text>
        </View>
        {/* Zones Information */}
        { <View style={styles.zonesInfo}>
            {Object.entries(zonas).map(([zona, datos]) => <ZonaCard now={now} zona={zona} datos={datos} key={zona} /> )}
          </View>
        }
        
        <Text style={styles.questionsTitle}><Text style={styles.questionsIcon}>❓</Text> Preguntas frecuentes</Text>
        <QuestionAnswer question={"¿Puedes aparcar?"} answer={"Sí, aunque no seas residente, en el horario permitido."} />
        <QuestionAnswer question={"¿Tienes que pagar?"} answer={"No, el estacionamiento es gratuito."} />
        
        {/* Footer */}
        <View style={styles.footer}>
          <Text style={{ fontSize: 10, textAlign: 'justify' }}>
            <Text style={{ fontWeight: 'bold' }}>Disclaimer:</Text> Las indicaciones de esta página web han sido
            generadas automáticamente siguiendo la <a href="https://www.baranain.es/general/zert/" target="_blank">guía de horarios ZERT oficial del Ayuntamiento de Barañáin</a>. Los horarios
            de la ZERT cambian en los periodos festivos. Consulte la web del ayuntamiento si la fecha actual se encuentra
            en un periodo festivo.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default App;
