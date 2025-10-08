import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';

//Router
import { Routes, Route } from 'react-router-dom';

//views
import Home
 from './views/Home';
import PageNavbar from './components/PageNavbar';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <PageNavbar />
       <Routes>
        {/* Route define una ruta específica: path y el componente a renderizar */}
        <Route path="/" element={<Home />} />
        
      </Routes>
    </>
  )
}

export default App
