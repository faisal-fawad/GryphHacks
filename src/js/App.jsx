import { useState, useEffect } from 'react'
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


  function fetchData() {
    let markers = []
    let bounds = {}
  
    /* Filters of data */
    if (filters["Solar"]) {
      bounds["Solar"] = {}
      if (filters["Fair"]) {
        bounds["Solar"]["Fair"] = [[57, 67], [87, 97]]
      }
      if (filters["Peak"]) {
        bounds["Solar"]["Peak"] = [[67, 87]]
      }
    }
    if (filters["Wind"]) {
      bounds["Wind"] = {}
      if (filters["Fair"]) {
        bounds["Wind"]["Fair"] = [[12, 15], [18, 22]]
      }
      if (filters["Peak"]) {
        bounds["Wind"]["Peak"] = [[15, 18]]
      }
    }
    console.log(bounds)

    /* Creating array of react elements */
    let id = 0
    for (const item in json) {
      let results = []
      let valid = false
      let x = 0
      /* Iteration for filtering */
      if (Object.keys(bounds).length == 0) {
        valid = true
      }
      for (const type in bounds) {
        if (Object.keys(bounds[type]).length == 0) {
          valid = true
        }
        for (const condition in bounds[type]) {
          for (let i = 0; i < bounds[type][condition].length; i++) {
            if (bounds[type][condition][i][0] < json[item][(type == "Solar" ? "temp" : "windspeed")] && json[item][(type == "Solar" ? "temp" : "windspeed")] < bounds[type][condition][i][1]) {
              results.push(<span key={x}>{type} Rating: {condition}<br/></span>)
              x += 1
              valid = true
            }
          }
        }
      }
      /* Filter iteration complete */

      if (valid) {
        markers.push(
          <Marker key={id} position={[json[item]["latitude"], json[item]["longitude"]]}>
            <Popup>
              <strong>{item}:</strong><br/>
              <span>Temperature: {Math.round(json[item]["temp"] * 10) / 10} °F<br/></span>
              <span>Wind Speed: {Math.round(json[item]["windspeed"] * 10) / 10} m/s<br/></span>
              {results}
            </Popup>
          </Marker>
        )
        id += 1
      }
    }
    return markers
  }

  /* Easily creates the sliders */
  function setSliders() {
    let names = ["HR", "Solar", "Wind", "HR", "Peak", "Fair"]
    let sliders = []
    for (let i = 0; i < names.length; i++) {
      if (names[i] === "HR") {
        sliders.push(
          <li key={i}><hr></hr></li>
        )
      }
      else {
        sliders.push(
          <li key={i}>{names[i]}<Slider name={names[i]} change={changeFilters}/></li>
        )
      }
    }
    return sliders
  }

  /* Changes the active filters */
  function changeFilters(name) {
    let temp = filters
    temp[name] = !temp[name]
    setFilters(temp)
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
          {setSliders()}
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
