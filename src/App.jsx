import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';

//Router
import { Routes, Route } from 'react-router-dom';
import { HashRouter } from 'react-router-dom';

//views
import Home
 from './views/Home';
import PageNavbar from './components/PageNavbar';
import VerUsuario from './views/VerUsuario';
import ListaUsuarios from './views/ListaUsuarios';
import Metricas from './views/Metricas';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <PageNavbar />
       <HashRouter>
        <Routes>
        {/* Route define una ruta específica: path y el componente a renderizar */}
        <Route path="/" element={<Home />} />
        <Route path="/lista-usuarios" element={<ListaUsuarios />} />
        <Route path="/usuario/:id" element={<VerUsuario />} />
        <Route path="/metricas" element={<Metricas />} />
        </Routes>
      </HashRouter>
    </>
  )
}

export default App
