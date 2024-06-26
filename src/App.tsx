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

function App() {
  //const [count, setCount] = useState(0)

  {/* Variable de estado y función de actualización */}

  let [indicators, setIndicators] = useState([])

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
              
              let dataToIndicators = new Array()
              {/* 
                  Análisis, extracción y almacenamiento del contenido del XML 
                  en el arreglo de resultados
              */}
              let location = xml.getElementsByTagName("location")[1]
              
              let geobaseid = location.getAttribute("geobaseid")
              dataToIndicators.push(["Location","Geobaseid", geobaseid])
              
              let latitude = location.getAttribute("latitude")
              dataToIndicators.push(["Location","Latitude", latitude])
              
              let longitude = location.getAttribute("longitude")
              dataToIndicators.push(["Location","Longitude", longitude])
              
              console.log( dataToIndicators )
              
              {/* Renderice el arreglo de resultados en un arreglo de elementos Indicator */}
              
              let indicatorsElements = Array.from(dataToIndicators).map(
                (element) => <Indicator title={element[0]} subtitle={element[1]} value={element[2]} />
              )
            
              {/* Modificación de la variable de estado mediante la función de actualización */}
            
              setIndicators(indicatorsElements)
            
            })()    
      },
      /* Arreglo de dependencias */
      []
      )

  return (
    <>
        <Grid container spacing={5}>
            <Grid xs={12} sm={4} md={3} lg={2}>
                {indicators[0]}
                {/* <Indicator title='Precipitación' subtitle='Probabilidad' value={0.13} ></Indicator> */}
            </Grid>
	          <Grid xs={6} sm={4} md={3} lg={2}>
                {indicators[1]}
                {/* <Indicator title='Precipitación' subtitle='Probabilidad' value={0.13} ></Indicator> */}
            </Grid>
	          <Grid xs={6} sm={4} md={3} lg={2}>
                {indicators[2]}
                {/* <Indicator title='Precipitación' subtitle='Probabilidad' value={0.13} ></Indicator> */}
            </Grid>
	          <Grid xs={12} sm={4} md={3} lg={2}>4</Grid>
	          <Grid xs={6} sm={4} md={6} lg={2}>5</Grid>
	          <Grid xs={6} sm={4} md={6} lg={2}>6</Grid>
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
