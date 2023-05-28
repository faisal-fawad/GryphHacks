import styles from '../css/Slider.module.css'
import { useState } from 'react'

function Slider(props) {
  const [checked, setChecked] = useState(true)

  return (
    <label className={styles.switch}>
      <input data-type={props.type} type="checkbox" defaultChecked={checked} onChange={() => setChecked(!checked)}/>
      <span class={styles.slider}></span>
    </label>
  )
}

export default Slider