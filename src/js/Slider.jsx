import styles from '../css/Slider.module.css'

function Slider({change, name}) {
  return (
    <label className={styles.switch}>
      <input type="checkbox" defaultChecked={false} onChange={() => change(name)}/>
      <span className={styles.slider}></span>
    </label>
  )
}

export default Slider