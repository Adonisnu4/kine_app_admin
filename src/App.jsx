import { useState } from 'react'
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
import ListaSolicitudesKinesiologos from './views/ListaSolicitudesKinesiologos';


function App() {
  

  return (
    <>
    <PageNavbar />
       <Routes>
        
        {/* Route define una ruta específica: path y el componente a renderizar */}
        <Route path="/" element={<Home />} />
        <Route path="/lista-usuarios" element={<ListaUsuarios />} />
        <Route path="/usuario/:id" element={<VerUsuario />} />
        <Route path="/metricas" element={<Metricas />} />
        <Route path="/solicitudes-kinesiologos" element={<ListaSolicitudesKinesiologos />} />
        
      </Routes>
    </>
  )
}

export default App;
