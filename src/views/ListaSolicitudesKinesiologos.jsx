import React, { useState, useEffect } from 'react';
import { getKineRequests } from '../services/fetchSolicitudesKinesiologos';
import { Container,Tab, Tabs, Table, Button, Stack } from 'react-bootstrap';



// Función de utilidad para formatear el Timestamp
function formatTimestamp(timestamp) {
    if (timestamp && timestamp.toDate) {
        const date = timestamp.toDate(); // Convierte el Timestamp a un objeto Date de JavaScript
        
        const datePart = date.toLocaleDateString('es-CL'); // Ejemplo: 22/10/2025
        const timePart = date.toLocaleTimeString('es-CL', {
            hour: '2-digit',
            minute: '2-digit'
        }); // Ejemplo: 11:40
        return `${datePart} ${timePart}`;
    }
    return 'Fecha no disponible';
};



export default function ListaSolicitudesKinesiologos() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Hook useEffect para cargar datos al montar el componente
  useEffect(() => {
    const loadRequests = async () => {
      setLoading(true);
      try {
        const data = await getKineRequests(); // Llama a la función que creamos
        setRequests(data);
      } catch (error) {
        console.error("Fallo al cargar las solicitudes:", error);
        // Opcional: Mostrar un mensaje de error al usuario
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, []); // El array vacío asegura que solo se ejecute al montar el componente

  // 2. Estado de Carga (Loading State)
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center p-6 bg-white shadow-lg rounded-xl">
          <svg className="animate-spin h-8 w-8 text-indigo-600 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-lg text-gray-700 font-semibold">Cargando solicitudes...</p>
        </div>
      </div>
    );
  }
return (
  <Container>
    {requests.length === 0 ? 
      <p>No hay solicitudes</p> 
      :
      // CORRECCIÓN: Se envuelven <h1> y <Tabs> en un Fragmento de React (<>...</>)
      (
        <> 
          <h1>Solicitudes kinesiologos</h1>
          <Tabs
            defaultActiveKey="solicitudes"
            id="uncontrolled-tab-example"
            className="mb-3"
          >
            <Tab eventKey="solicitudes" title="Todas las solicitudes">
              <SolicitudesPendientes solicitudes={requests} /> 
            </Tab>
            <Tab eventKey="solicitudes-pendientes" title="Solicitudes pendientes">
              <SolicitudesPendientes solicitudes={requests} /> 
            </Tab>
            <Tab eventKey="contact" title="Contact" disabled>
              Tab content for Contact
            </Tab>
          </Tabs>
        </>
      )
    }
  </Container>
)

 
}


// Asume que la función formatTimestamp está definida en algún lugar de tu archivo o importada
// const formatTimestamp = (timestamp) => { ... };


// Asume que la función formatTimestamp está definida en algún lugar.

function TodasLasSolicitudes({ solicitudes }) {
  return (
    <Container>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID solicitud</th>
            <th>Usuario</th>
            <th>Fecha solicitud</th>
            <th>Documento</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {/* CORRECCIÓN: Usando retorno implícito con paréntesis () */}
          {solicitudes.map((solicitud) => (
            <tr key={solicitud.id}>
              <td>{solicitud.id}</td>
              <td>usuario (Ajustar api)</td>
              <td>{formatTimestamp(solicitud.fecha_solicitud)}</td>
              <td>@mdo</td>
              <td>@mdo</td>
            </tr>
          ))} {/* Se eliminaron las llaves y el return null innecesario */}
        </tbody>
      </Table>
    </Container>
  );
}


function SolicitudesPendientes({solicitudes}){
    return(
      <Container>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID solicitud</th>
              <th>ID Usuario</th>
              <th>Nombre usuario</th>
              <th>Fecha solicitud</th> {/* Aquí se mostrará la fecha formateada */}
              <th>Documento</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {solicitudes.map((solicitud) => {
              if (solicitud.estado === "pendiente") {
                return (
                  <tr key={solicitud.id}>
                    <td>{solicitud.id}</td>
                    <td> {solicitud.usuario.id} </td>
                    <td> {solicitud.usuario.nombre_completo} </td>
                    <td>{formatTimestamp(solicitud.fecha_solicitud)}</td> 
                    <td>
                      <a href={solicitud.documento} target="_blank"  rel="noopener noreferrer">Ver Documento</a>
                    </td>
                    <td>
                      
                        
                        <Stack direction="horizontal" gap={3}>
        <Button variant='danger'>
                          Rechazar
                        </Button>
                        <Button variant='success'>
                          Rechazar
                        </Button>
                        
                      
    </Stack>
                    </td>
                  </tr>
                );
              }
              return null;
            })}
          </tbody>
        </Table>
      </Container>
    );
}