import { useEffect, useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'
import Summary from './components/Summary';
//import BasicTable from './components/BasicTable';
import WeatherChart from './components/WeatherChart';
import ControlPanel from './components/ControlPanel';
import Information from './components/Information';
import Indicator from './components/Indicator';
import ForecastTable from './components/ForecastTable';

interface Row {
  rango: string;
  temperatura: string;
  sensacion: string;
  humedad: string;
  presion: string;
}

function App() {
  //const [count, setCount] = useState(0)

  {/* Variable de estado y función de actualización */}

  let [informacion, setInformacion] = useState<React.ReactNode[]>([])

  let [now, setNow] = useState<React.ReactNode[]>([])

  let [rowsTable, setRowsTable] = useState<Row[]>([])

  let [dataGraph, setDataGraph] = useState<any[][]>([
    ["Hora", "Precipitación", "Humedad", "Nubosidad"]
  ])

  {/* Hook: useEffect */}
	
  useEffect(
      /* Efecto secundario a ejecutar */
      () => {
          (async () => {
          
              {/* Del LocalStorage, obtiene el valor de las claves forecastOpenWeatherMap y expiringTime */}

              let nowTextXML = localStorage.getItem("nowOpenWeatherMap")!
              let forecastTextXML = localStorage.getItem("forecastOpenWeatherMap")!
              let expiringTime = localStorage.getItem("expiringTime")

              {/* Estampa de tiempo actual */}

              let nowTime = (new Date()).getTime();

              {/* Realiza la petición asicrónica cuando: 
                  (1) La estampa de tiempo de expiración (expiringTime) es nula, o  
                  (2) La estampa de tiempo actual es mayor al tiempo de expiración */}
              
              if(expiringTime === null || nowTime > parseInt(expiringTime)) {
              
                  {/* Request */}
              
                  let API_KEY = "fe14d460788eb1506d194b4ed0ce3c80";
                  let nowResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Guayaquil&mode=xml&appid=${API_KEY}`);
                  nowTextXML = await nowResponse.text();
                  let forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=${API_KEY}`);
                  forecastTextXML = await forecastResponse.text();
              
                  {/* Diferencia de tiempo */}
              
                  let hours = 1
                  let delay = hours * 3600000
              
              
                  {/* En el LocalStorage, almacena texto en la clave forecastOpenWeatherMap y la estampa de tiempo de expiración */}
              
                  localStorage.setItem("nowOpenWeatherMap", nowTextXML)
                  localStorage.setItem("forecastOpenWeatherMap", forecastTextXML)
                  localStorage.setItem("expiringTime", (nowTime + delay ).toString() )
              }
          
              {/* Request
              
              let API_KEY = "fe14d460788eb1506d194b4ed0ce3c80";
              let forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=${API_KEY}`);
              let forecastTextXML = await forecastResponse.text();
              */}
              
              {/* XML Parser */}
              
              const parser = new DOMParser();
              const nowXml = parser.parseFromString(nowTextXML, "application/xml");
              const forecastXml = parser.parseFromString(forecastTextXML, "application/xml")
              
              {/* Arreglo para agregar los resultados */}
              
              let informacion = new Array()
              let now = new Array()

              {/* 
                  Análisis, extracción y almacenamiento del contenido del XML 
                  en el arreglo de resultados
              */}

              let datos = nowXml.getElementsByTagName("current")[0]

              let ciudad = datos.querySelector("city")!.getAttribute("name")
              informacion.push(["Ciudad", ciudad])

              let pais = datos.querySelector("country")?.textContent
              informacion.push(["Pais", pais])

              let zona = ["Zona Horaria", "GMT -5"]
              informacion.push(zona)

              let geobaseid = datos.querySelector("city")!.getAttribute("id")
              informacion.push(["Geobaseid", geobaseid])
              
              let latitud = datos.querySelector("coord")!.getAttribute("lat")
              informacion.push(["Latitud", latitud])
              
              let longitud = datos.querySelector("coord")!.getAttribute("lon")
              informacion.push(["Longitud", longitud])

              let temperaturaString = datos.querySelector("temperature")!.getAttribute("value")
              let temperatura = (Number.parseFloat(temperaturaString!) - 273.15).toPrecision(4)
              now.push(["Temperatura", "° C" , temperatura])

              let sensacionString = datos.querySelector("feels_like")!.getAttribute("value")
              let sensacion = (Number.parseFloat(sensacionString!) - 273.15).toPrecision(4)
              now.push(["Sensación Térmica", "° C" , sensacion])

              let humedad = datos.querySelector("humidity")!.getAttribute("value")
              let unidad = datos.querySelector("humidity")!.getAttribute("unit")
              now.push(["Humedad", unidad , humedad])

              let presion = datos.querySelector("pressure")!.getAttribute("value")
              unidad = datos.querySelector("pressure")!.getAttribute("unit")
              now.push(["Presión Atmosférica", unidad , presion])

              let velocidad = datos.querySelector("speed")!.getAttribute("value")
              unidad = datos.querySelector("speed")!.getAttribute("unit")
              now.push(["Velocidad", unidad , velocidad])

              let direccion = datos.querySelector("direction")!.getAttribute("value")
              unidad = "° " + datos.querySelector("direction")!.getAttribute("name")
              now.push(["Dirección", unidad , direccion])

              let predicciones = forecastXml.getElementsByTagName("time")
              let arrayPredicciones = Array.from(predicciones).map( (prediccion) => {
                let inicio = prediccion.getAttribute("from")!
                let fin = prediccion.getAttribute("to")!
                let rango = inicio.replace("T", " ") + " - " + fin.replace("T", " ")
                let temperaturaString = prediccion.querySelector("temperature")!.getAttribute("value")!
                let temperatura = (Number.parseFloat(temperaturaString) - 273.15).toPrecision(4)
                let sensacionString = prediccion.querySelector("feels_like")!.getAttribute("value")
                let sensacion = (Number.parseFloat(sensacionString!) - 273.15).toPrecision(4)
                let humedad = prediccion.querySelector("humidity")!.getAttribute("value")
                let presion = prediccion.querySelector("pressure")!.getAttribute("value")
                unidad = datos.querySelector("pressure")!.getAttribute("unit")
                let row : Row = {
                  "rango": rango,
                  "temperatura": temperatura,
                  "sensacion": sensacion,
                  "humedad": humedad!,
                  "presion": presion!
                }
                return row
              })

              let arrayGrafico = Array.from(predicciones).map((prediccion) => {
                let hora = prediccion.getAttribute("from")!.split("T")[1].substring(0, 5);
                let precipitacion = prediccion.querySelector("precipitation")!.getAttribute("probability")
                let humedad = prediccion.querySelector("humidity")!.getAttribute("value")
                let nubosidad = prediccion.querySelector("clouds")!.getAttribute("all")
                return [hora, parseFloat(precipitacion!), parseFloat(humedad!), parseFloat(nubosidad!)]
              })!
              
              
              {/* Renderice el arreglo de resultados en un arreglo de elementos Indicator */}
              
              let informacionElements = Array.from(informacion).map(
                (element) => <Information title={element[0]} value={element[1]} />
              )

              let nowElements = Array.from(now).map(
                (element) => <Indicator title={element[0]} subtitle={element[1]} value={element[2]} />
              )
            
              {/* Modificación de la variable de estado mediante la función de actualización */}
              
              setInformacion(informacionElements)

              setNow(nowElements)

              setRowsTable(arrayPredicciones)

              setDataGraph([
                ["Hora", "Precipitación", "Humedad", "Nubosidad"],
                ...arrayGrafico
              ])
            
            })()    
      },
      /* Arreglo de dependencias */
      []
      )

  return (
    <>
        <section id="informacion">
          <h1>Información</h1>
          <Grid container spacing={5}>
            <Grid xs={6} sm={4} md={3} lg={2}>
                {informacion[0]}
            </Grid>
            <Grid xs={6} sm={4} md={3} lg={2}>
                {informacion[1]}
            </Grid>
            <Grid xs={6} sm={4} md={3} lg={2}>
                {informacion[2]}
            </Grid>
            <Grid xs={6} sm={4} md={3} lg={2}>
                {informacion[3]}
            </Grid>
            <Grid xs={6} sm={4} md={3} lg={2}>
                {informacion[4]}
            </Grid>
            <Grid xs={6} sm={4} md={3} lg={2}>
                {informacion[5]}
            </Grid>
          </Grid>
        </section>
        <section id="actual">
          <h1>Clima actual</h1>
          <Grid container spacing={5}>
            <Grid xs={6} sm={6} md={3} lg={3}>
                {now[0]}
            </Grid>
            <Grid xs={6} sm={6} md={3} lg={3}>
                {now[1]}
            </Grid>
            <Grid xs={6} sm={6} md={3} lg={3}>
                {now[2]}
            </Grid>
            <Grid xs={6} sm={6} md={3} lg={3}>
                {now[3]}
            </Grid>
          </Grid>
          <h2>Viento</h2>
          <Grid container spacing={10} justifyContent={'center'}>
            <Grid xs={6} sm={6} md={3} lg={3}>
                {now[4]}
            </Grid>
            <Grid xs={6} sm={6} md={3} lg={3}>
                {now[5]}
            </Grid>
          </Grid>
        </section>
        <section id ="prediccion">
          <h1>Próximos 5 días</h1>
          <ForecastTable rows={rowsTable}></ForecastTable>
        </section>
        <section id="resumen">
          <h1>Resumen</h1>
        </section>
        <Grid container spacing={5}>
            <Grid xs={12} lg={2}>
              <ControlPanel />
            </Grid>
            <Grid xs={12} lg={10}>
              <WeatherChart datos={dataGraph}></WeatherChart>
            </Grid>
            <Summary></Summary>
	      </Grid>
    </>
  )
}

export default App
