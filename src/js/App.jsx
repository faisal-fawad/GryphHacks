import { useState, useEffect, useRef } from 'react'
import styles from '../css/App.module.css'
import Slider from './Slider.jsx'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import json from '../json/data.json'

function App() {
  const [active, setActive] = useState(false)
  const [filters, setFilters] = useState({
    Solar: true,
    Wind: true,
    Peak: true,
    Fair: true
  })

  function changeFilters(name) {
    let temp = {...filters}
    temp[name] = !temp[name]
    setFilters(() => temp)
  }

  function fetchData() {
    console.log(filters)
    let markers = []

    /* Creating array of react elements */
    let id = 0
    for (const item in json) {
      let wind
      let solar

      /* Determing efficiency */
      if (67 < json[item]["temp"] && json[item]["temp"] < 87) {
        solar = "Peak"
      }
      else if (57 < json[item]["temp"] && json[item]["temp"] < 97) {
        solar = "Fair"
      }
      else {
        solar = "Poor"
      }

      if (15 < json[item]["windspeed"] && json[item]["windspeed"] < 18) {
        wind = "Peak"
      }
      else if (12 < json[item]["windspeed"] && json[item]["windspeed"] < 22) {
        wind = "Fair"
      }
      else {
        wind = "Poor"
      }

      markers.push(
        <Marker key={id} position={[json[item]["latitude"], json[item]["longitude"]]}>
          <Popup>
            <strong>{item}:</strong><br/>
            <span>Temperature: {Math.round(json[item]["temp"] * 10) / 10} °F<br/></span>
            <span>Wind Speed: {Math.round(json[item]["windspeed"] * 10) / 10} m/s<br/></span>
            <span>Solar Rating: {solar}<br/></span>
            <span>Wind Rating: {wind}<br/></span>
          </Popup>
        </Marker>
      )
      id += 1
    }
    return markers
  }

  return (
    <>
      <nav className={active ? [styles.nav, styles.active].join(" ") : styles.nav}>
        <div className={styles.search}></div>
        <button onClick={() => setActive(!active)} className={styles.btn}>
          <span className={styles.ham}>
            <div></div>
            <div></div>
            <div></div>
          </span>
          <span>Filter</span>
        </button>
        <ul className={styles.options}>
          <li><hr></hr></li>
          <li>{"Solar"}<Slider name={"Solar"} change={changeFilters}/></li>
          <li>{"Wind"}<Slider name={"Wind"} change={changeFilters}/></li>
          <li><hr></hr></li>
          <li>{"Peak"}<Slider name={"Peak"} change={changeFilters}/></li>
          <li>{"Fair"}<Slider name={"Fair"} change={changeFilters}/></li>
        </ul>
      </nav>
      <MapContainer center={[43.5448, -80.2482]} zoom={10} minZoom={3} maxZoom={18}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {fetchData()}
      </MapContainer> 
    </>
  )
}

export default App
