// src/components/ListaUsuarios.jsx

import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase-config'; // Asegúrate de que esta ruta es correcta
import { collection, getDocs } from 'firebase/firestore'; 
import { Button, Container, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// ///////////ESTO PARA TESTEAR, DESPUES ELIMINAR
// NOTA: Para un mejor testing, añadí 'email' a este mock, ya que lo usas en la tabla.
const mock_usuarios = [
    { "id": "101", "nombre": "Elena García", "email": "elena@test.com", "tipo_usuarios": "Administrador" },
    { "id": "102", "nombre": "Javier López", "email": "javier@test.com", "tipo_usuarios": "Editor" },
    { "id": "103", "nombre": "Sofía Martínez", "email": "sofia@test.com", "tipo_usuarios": "Lector" },
    { "id": "104", "nombre": "Carlos Ruiz", "email": "carlos@test.com", "tipo_usuarios": "Administrador" },
    { "id": "105", "nombre": "Ana Sánchez", "email": "ana@test.com", "tipo_usuarios": "Lector" }
];

function ListaUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Referencia a la colección "usuarios"
    const usuariosCollectionRef = collection(db, "usuarios"); 

    useEffect(() => {
        const getUsuarios = async () => {
            setLoading(true);
            try {
                const data = await getDocs(usuariosCollectionRef);
                
                // Mapea la data para incluir el ID del documento junto con los campos
                const usuariosDB = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                
                if(usuariosDB.length > 0) {
                    setUsuarios(usuariosDB);
                } else {
                    // Si no hay datos en la BD, se puede mostrar un mensaje específico o el mock
                    console.warn("No hay datos en la colección 'usuarios' de Firebase.");
                    setUsuarios(mock_usuarios); 
                }
                
            } catch (error) {
                console.error("Error al obtener los usuarios desde Firebase:", error);
                // Si la conexión falla, usamos el mock
                setUsuarios(mock_usuarios);
            } finally {
                setLoading(false);
            }
        };

        getUsuarios();
    }, []);

    // Muestra un mensaje mientras se cargan los datos
    if (loading) {
        return <Container><p>Cargando lista de usuarios...</p></Container>;
    }
    
    // Si la lista de usuarios está vacía DESPUÉS de cargar
    if (usuarios.length === 0) {
        return <Container><p>No se encontraron usuarios en la base de datos.</p></Container>;
    }

    return (
        <Container>
            <h2>👥 Listado de Usuarios Registrados</h2>
            <Table striped bordered hover responsive> 
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Tipo usuario</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map((usuario) => (
                        // Usamos el ID del documento como 'key' única
                        <tr key={usuario.id}>
                            <td> {usuario.id} </td> 
                            <td> 
                                {usuario.nombre} {usuario.apellido || ''} 
                            </td>
                            
                            <td> {usuario.email || "Email no registrado"} </td> 
                            
                            <td> {usuario.tipo_usuarios || "Sin rol asignado"} </td> 
                            
                            <td> <VerUsuarioButton id_usuario={usuario.id} /> </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
}

export default ListaUsuarios;


// Este componente se mantiene igual, ya que está correcto para la navegación
function VerUsuarioButton({ id_usuario }) {
    const urlDestino = `/usuario/${id_usuario}`;

    return (
        <Button 
            as={Link} 
            to={urlDestino} 
            variant="primary" 
        >
            Ver
        </Button>
    );
}