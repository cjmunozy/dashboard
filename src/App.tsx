import { useEffect, useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'
import Indicator from './components/Indicator';
import Summary from './components/Summary';
import BasicTable from './components/BasicTable';
import WeatherChart from './components/WeatherChart';
import ControlPanel from './components/ControlPanel';
import Information from './components/Information';

function App() {
  //const [count, setCount] = useState(0)

  {/* Variable de estado y función de actualización */}

  let [informacion, setInformacion] = useState([])

  {/* Hook: useEffect */}
	
  useEffect(
      /* Efecto secundario a ejecutar */
      () => {
          (async () => {
          
              {/* Del LocalStorage, obtiene el valor de las claves openWeatherMap y expiringTime */}

              let savedTextXML = localStorage.getItem("openWeatherMap")
              let expiringTime = localStorage.getItem("expiringTime")

              {/* Estampa de tiempo actual */}

              let nowTime = (new Date()).getTime();

              {/* Realiza la petición asicrónica cuando: 
                  (1) La estampa de tiempo de expiración (expiringTime) es nula, o  
                  (2) La estampa de tiempo actual es mayor al tiempo de expiración */}
              
              if(expiringTime === null || nowTime > parseInt(expiringTime)) {
              
                  {/* Request */}
              
                  let API_KEY = "fe14d460788eb1506d194b4ed0ce3c80";
                  let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=${API_KEY}`);
                  savedTextXML = await response.text();
              
              
                  {/* Diferencia de tiempo */}
              
                  let hours = 1
                  let delay = hours * 3600000
              
              
                  {/* En el LocalStorage, almacena texto en la clave openWeatherMap y la estampa de tiempo de expiración */}
              
                  localStorage.setItem("openWeatherMap", savedTextXML)
                  localStorage.setItem("expiringTime", (nowTime + delay ).toString() )
              }
          
              {/* Request
              
              let API_KEY = "fe14d460788eb1506d194b4ed0ce3c80";
              let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=${API_KEY}`);
              let savedTextXML = await response.text();
              */}
              
              {/* XML Parser */}
              
              const parser = new DOMParser();
              const xml = parser.parseFromString(savedTextXML, "application/xml");
              
              {/* Arreglo para agregar los resultados */}
              
              let informacion = new Array()

              {/* 
                  Análisis, extracción y almacenamiento del contenido del XML 
                  en el arreglo de resultados
              */}

              let localidad = xml.getElementsByTagName("location")[1]
              console.log(localidad)

              let ciudad = ["Ciudad", "Guayaquil"]
              informacion.push(ciudad)

              let pais = ["Pais", "Ecuador"]
              informacion.push(pais)

              let zona = ["Zona horaria", "GMT -5"]
              informacion.push(zona)

              let geobase = localidad.getAttribute("geobaseid")
              informacion.push(["Geobaseid", geobase])
              
              let latitud = localidad.getAttribute("latitude")
              informacion.push(["Latitud", latitud])
              
              let longitud = localidad.getAttribute("longitude")
              informacion.push(["Longitud", longitud])
              
              {/* Renderice el arreglo de resultados en un arreglo de elementos Indicator */}
              
              let informacionElements = Array.from(informacion).map(
                (element) => <Information title={element[0]} value={element[1]} />
              )
            
              {/* Modificación de la variable de estado mediante la función de actualización */}
              
              setInformacion(informacionElements)
            
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
        </section>
        <section id ="prediccion">
          <h1>Próximos 3 días</h1>
        </section>
        <section id="resumen">
          <h1>Resumen</h1>
        </section>
        <Grid container spacing={5}>
            <Summary></Summary>
            <BasicTable></BasicTable>
            <Grid xs={12} lg={2}>
              <ControlPanel />
            </Grid>
            <Grid xs={12} lg={10}>
              <WeatherChart></WeatherChart>
            </Grid>
	      </Grid>
    </>
  )
}

export default App
