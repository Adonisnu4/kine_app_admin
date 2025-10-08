// src/components/ListaUsuarios.jsx (Nombre sugerido para el componente)

import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase-config'; // Asegúrate de que esta ruta es correcta
import { collection, getDocs } from 'firebase/firestore'; 

function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 🎯 Cambia el nombre de la colección a "usuarios"
  const usuariosCollectionRef = collection(db, "usuarios"); 

  useEffect(() => {
    const getUsuarios = async () => {
      setLoading(true);
      try {
        const data = await getDocs(usuariosCollectionRef);
        
        // Mapea la data para incluir el ID del documento junto con los campos
        setUsuarios(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
      } finally {
        setLoading(false);
      }
    };

    getUsuarios();
  }, []);

  // Muestra un mensaje mientras se cargan los datos
  if (loading) {
    return <p>Cargando lista de usuarios...</p>;
  }
  
  // Si no hay usuarios (o hubo un error de conexión que dejó el array vacío)
  if (usuarios.length === 0) {
      return <p>No se encontraron usuarios en la base de datos.</p>;
  }

  return (
    <div>
      <h2>👥 Listado de Usuarios Registrados</h2>
      {usuarios.map((usuario) => (
        // Usa el ID del documento como 'key' única
        <div> {usuario.nombre || "sin nombre"} </div>
      ))}
    </div>
  );
}

// Estilos básicos para la presentación
const styles = {
    card: {
        border: '1px solid #ddd',
        borderRadius: '5px',
        padding: '15px',
        margin: '10px 0',
        boxShadow: '2px 2px 5px rgba(0,0,0,0.1)'
    },
    fecha: {
        fontSize: '0.8em',
        color: '#666'
    }
}

export default ListaUsuarios;