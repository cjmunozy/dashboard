//import * as React from 'react';
import { useState, useEffect} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

/*
function createData(
  rango: string,
  temperatura: number,
  sensacion: number,
  humedad: number,
  presion: number,
) {
  return { rango, temperatura, sensacion, humedad, presion };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];
*/

interface Row {
  rango: string;
  temperatura: string;
  sensacion: string;
  humedad: string;
  presion: string;
}

interface Config {
  rows: Array<Row>
}
 
export default function ForecastTable(data: Readonly<Config>) {

  {/* 
    Declare la variable de estado (rows) y la función de actualización (setRows).
    Use el mismo identificador de la variable con valores fijos (rows)
  */}

  let [rows, setRows] = useState<Row[]>([])

  {/* 
      Agregue el hook useEffect, controlado por el prop del componente (data), y
      Dentro del hook, invoque al métdo de actualización con el valor del prop (data.rows).
  */}

  useEffect( () => {

    (()=> {

        setRows(data.rows)

    })()

}, [data] )

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align='center'>Rango de horas</TableCell>
            <TableCell align="center">Temperatura (°C)</TableCell>
            <TableCell align="center">Sensación Térmica (°C)</TableCell>
            <TableCell align="center">Humedad (%)</TableCell>
            <TableCell align="center">Presión (hPa)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.rango}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row" align='center'>
                {row.rango}
              </TableCell>
              <TableCell align="center">{row.temperatura}</TableCell>
              <TableCell align="center">{row.sensacion}</TableCell>
              <TableCell align="center">{row.humedad}</TableCell>
              <TableCell align="center">{row.presion}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}