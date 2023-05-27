import { useState } from 'react'
import '../css/App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div onClick={() => setCount((prevCount) => prevCount + 1)}>Hello World: {count}</div>
  )
}

export default App
