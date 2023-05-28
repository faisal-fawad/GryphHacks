import { useState } from 'react'
import styles from '../css/App.module.css'
import Slider from './Slider.jsx'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import json from '../json/data.json'
import L from 'leaflet'

function fetchIcon(color) {
  var svgIcon = L.divIcon({
    html: `<svg width="99" height="122" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M11.3856 23.789L11.3831 23.7871L11.3769 23.7822L11.355 23.765C11.3362 23.7501 11.3091 23.7287 11.2742 23.7008C11.2046 23.6451 11.1039 23.5637 10.9767 23.4587C10.7224 23.2488 10.3615 22.944 9.92939 22.5599C9.06662 21.793 7.91329 20.7041 6.75671 19.419C5.60303 18.1371 4.42693 16.639 3.53467 15.0528C2.64762 13.4758 2 11.7393 2 10C2 7.34784 3.05357 4.8043 4.92893 2.92893C6.8043 1.05357 9.34784 0 12 0C14.6522 0 17.1957 1.05357 19.0711 2.92893C20.9464 4.8043 22 7.34784 22 10C22 11.7393 21.3524 13.4758 20.4653 15.0528C19.5731 16.639 18.397 18.1371 17.2433 19.419C16.0867 20.7041 14.9334 21.793 14.0706 22.5599C13.6385 22.944 13.2776 23.2488 13.0233 23.4587C12.8961 23.5637 12.7954 23.6451 12.7258 23.7008C12.6909 23.7287 12.6638 23.7501 12.645 23.765L12.6231 23.7822L12.6169 23.7871L12.615 23.7885C12.615 23.7885 12.6139 23.7894 12 23L12.6139 23.7894C12.2528 24.0702 11.7467 24.0699 11.3856 23.789ZM12 23L11.3856 23.789C11.3856 23.789 11.3861 23.7894 12 23ZM15 10C15 11.6569 13.6569 13 12 13C10.3431 13 9 11.6569 9 10C9 8.34315 10.3431 7 12 7C13.6569 7 15 8.34315 15 10Z" fill="${color}"/>
    </svg>`,
    className: "svg-icon",
    iconSize: [24, 40],
    iconAnchors: [12, 40]
  });
  return svgIcon
}

function App() {
  const [active, setActive] = useState(false)
  const [filters, setFilters] = useState({
    PeakSolar: false,
    FairSolar: false,
    PeakWind: false,
    FairWind: false
  })
  const [infoActive, infoSetActive] = useState(false)

  function changeFilters(name) {
    let temp = {...filters}
    temp[name] = !temp[name]
    setFilters(() => temp)
  }

  function fetchData() {
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

      /* Determing color */
      let color;
      if (solar == "Peak" || wind == "Peak") {
        color = "#6aa84f"
      }
      else if (solar == "Fair" || wind == "Fair") {
        color = "#f1c232"
      }
      else {
        color = "#cc0000"
      }

      let valid = false
      let flag = false
      for (const type in filters) {
        if (filters[type] === true) {
          flag = true
          if (type.includes("Solar") && type.includes(solar)) {
            valid = true
          }
          else if (type.includes("Wind") && type.includes(wind)) {
            valid = true
          }
        }
      }
      if (!flag) { 
        valid = true 
      }
      
      if (valid) {
        markers.push(
          <Marker className={styles.test} key={id} position={[json[item]["latitude"], json[item]["longitude"]]} icon={fetchIcon(color)}>
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
    }
    return markers
  }

  return (
    <>
      <button onClick={() => infoSetActive(!infoActive)} className={styles.infoBtn}><img src="info.svg"></img></button>
      <div className={infoActive ? [styles.info, styles.infoActive].join(" ") : styles.info} onClick={(e) => {
        if (e.currentTarget === e.target) {
          infoSetActive(!infoActive)
        }
      }}>
        <div className={styles.infoContainer}>
          <p>This map provides the best locations for renewable energy sources. See the legend below for efficiency:</p>
          <ul>
            <li><div style={{background: "#cc0000"}}></div>Poor</li>
            <li><div style={{background: "#f1c232"}}></div>Fair</li>
            <li><div style={{background: "#6aa84f"}}></div>Peak</li>
          </ul>
        </div>
      </div>
      <nav className={active ? [styles.nav, styles.active].join(" ") : styles.nav}>
        <button onClick={() => setActive(!active)} className={styles.btn}>
          <span className={styles.ham}>
            <div></div>
            <div></div>
            <div></div>
          </span>
          <span>Filter</span>
        </button>
        <ul className={styles.options}>
          <li className={styles.headers}>Solar</li>
          <li>Peak<Slider name={"PeakSolar"} change={changeFilters}/></li>
          <li>Fair<Slider name={"FairSolar"} change={changeFilters}/></li>
          <li className={styles.headers}>Wind</li>
          <li>Peak<Slider name={"PeakWind"} change={changeFilters}/></li>
          <li>Fair<Slider name={"FairWind"} change={changeFilters}/></li>
        </ul>
      </nav>
      <MapContainer center={[43.5448, -80.2482]} zoom={10} minZoom={3} maxZoom={18} worldCopyJump={true}>
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
