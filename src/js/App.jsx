import { useState, useEffect } from 'react'
import styles from '../css/App.module.css'
import Slider from './Slider.jsx'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import json from '../json/data.json'

function App() {
  const [active, setActive] = useState(false)
  const [data, setData] = useState([])
  const [filters, setFilters] = useState([])

  /* On mount */
  useEffect(() => {
    setFilters(fetchFilters())
    setData(fetchData())
  }, []);

  function fetchData() {
    let markers = []
    /* Filters of data */

    /* Creating array of react elements */
    for (const item in json) {
      let minutes = Math.floor(json[item]["sun_time"] / 60)
      let hours = Math.floor(json[item]["sun_time"] / 3600)
      markers.push(
        <Marker position={[json[item]["latitude"], json[item]["longitude"]]}>
          <Popup>
            <strong>{item}:</strong> <br/>
            Temperature: {Math.round(json[item]["temp"] * 10) / 10} <br/>
            Sun Time: {hours} hours, {minutes - (hours * 60)} mins <br/>
            Wind Speed: {Math.round(json[item]["windspeed"] * 10) / 10} <br/>
            Solar: <br/>
            Wind: <br/>
          </Popup>
        </Marker>
      )
    }
    return markers
  }

  function fetchFilters() {
    let filters = {}
    let inputs = document.getElementsByTagName("input");
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].type == "checkbox") {
        filters[inputs[i].getAttribute("data-type")] = inputs[i].checked
      }  
    }
    console.log(filters)
    return filters
  }

  return (
    <>
      <nav className={active ? [styles.nav, styles.active].join(" ") : styles.nav}>
        <div className={styles.search}></div>
        <button onClick={(e) => {
          setActive(!active)
        }} className={styles.btn}>
          <span className={styles.ham}>
            <div></div>
            <div></div>
            <div></div>
          </span>
          <span>Filter</span>
        </button>
        <ul className={styles.options}>
          <li><hr></hr></li>
          <li>Solar<Slider type="solar"/></li>
          <li>Wind<Slider type="wind"/></li>
          <li><hr></hr></li>
          <li>Peak<Slider type="peak"/></li>
          <li>Fair<Slider type="fair"/></li>
          <li>Poor<Slider type="poor"/></li>
        </ul>
      </nav>
      <MapContainer center={[43.5448, -80.2482]} zoom={10} minZoom={3} maxZoom={18}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {data}
      </MapContainer> 
    </>
  )
}

export default App
