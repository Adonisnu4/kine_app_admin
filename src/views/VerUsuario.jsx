// src/components/VerUsuario.jsx (Nombre sugerido)

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore'; 

// Importa tu instancia de Firestore (db)
import { db } from '../services/firebase-config'; // <<-- ¡Verifica esta ruta!
import { Button } from 'react-bootstrap';

export default function VerUsuario() {
    const { id } = useParams(); // Obtiene el ID dinámico de la URL (ej: '101')
    const [usuario, setUsuario] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Ejecuta la búsqueda solo si tenemos un ID
        if (!id) {
            setCargando(false);
            setError("Error: ID de usuario no proporcionado en la URL.");
            return;
        }

        const obtenerUsuario = async () => {
            setCargando(true); // Reinicia el estado de carga
            setError(null);    // Limpia errores anteriores

            try {
                // 1. Crear la referencia al documento específico
                // Colección: "usuarios", ID del documento: el 'id' de la URL
                const docRef = doc(db, "usuarios", id);
                
                // 2. Obtener el documento de la base de datos
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    // 3. Documento encontrado: Guarda los datos
                    setUsuario({
                        id: docSnap.id, 
                        ...docSnap.data() 
                    });
                } else {
                    // 4. Documento no encontrado
                    setUsuario(null);
                    setError(`No se encontró un usuario con ID: ${id} en la base de datos.`);
                }

            } catch (err) {
                // 5. Manejo de errores de conexión o permisos
                console.error("Error al obtener el documento: ", err);
                setError("Hubo un error al comunicarse con la base de datos. Consulta la consola para más detalles.");
                setUsuario(null);
            } finally {
                // 6. Finaliza el estado de carga
                setCargando(false);
            }
        };

        obtenerUsuario();
    }, [id]); // Dependencia del ID: se ejecuta cada vez que el ID de la URL cambia

    // --- Renderizado del Componente ---

    if (cargando) {
        return <p>Cargando perfil del usuario con ID **{id}**...</p>;
    }

    if (error) {
        return <div style={{ color: 'red', padding: '20px' }}>{error}</div>;
    }

    // Si todo salió bien y el usuario existe:
    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '600px', margin: '20px auto' }}>
            <h2>👤 Perfil del Usuario</h2>
            <h3>{usuario.nombre || "Sin Nombre"} {usuario.apellido}</h3>
            
            <p><strong>ID de usuario:</strong> {usuario.id}</p>
            <p><strong>Email:</strong> {usuario.email || "No registrado"}</p>
            <p><strong>Tipo de Usuario:</strong> {usuario.tipo_usuarios || "Sin rol asignado"}</p>
            
            {/* Si tienes más campos en Firestore, puedes agregarlos aquí: */}
            {/* <p><strong>Teléfono:</strong> {usuario.telefono}</p> */}            
            <Button variant='primary'>Volver</Button>
        </div>
    );
}