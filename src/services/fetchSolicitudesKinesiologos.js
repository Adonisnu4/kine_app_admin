import { collection, getDocs, getDoc, doc } from 'firebase/firestore'; // 👈 Se añadió 'doc'
import { db } from './firebase-config';

/**
 * Obtiene todas las solicitudes de kinesiología de 'solicitudes_kinesiologo',
 * incluyendo TODOS los datos del documento de usuario referenciado.
 * * @returns {Promise<Array>} Una promesa que resuelve a un array de objetos de solicitud
 * con todos los datos. El documento de usuario completo se guarda en 'solicitudData.usuario'.
 */
export async function getKineRequests() {
    try {
        const querySnapshot = await getDocs(collection(db, 'solicitudes_kinesiologo'));
        
        // Mapear los documentos y resolver las referencias de usuario en paralelo
        const requestsPromises = querySnapshot.docs.map(async (docSnap) => {
            const solicitudData = {
                id: docSnap.id,
                ...docSnap.data(),
            };

            let userRef = solicitudData.usuario; 
            
            // 1. CORRECCIÓN: Verificar si es una cadena (el ID) y reconstruir la referencia
            if (userRef && typeof userRef === 'string') {
                // Se usa la función 'doc' (que se importó) para crear el objeto DocumentReference
                userRef = doc(db, 'usuarios', userRef); 
            }
            
            // Si userRef es un DocumentReference (tiene la propiedad .path), procedemos a leer
            if (userRef && userRef.path) { 
                try {
                    const userSnap = await getDoc(userRef); 
                    
                    console.log(userSnap);
                    
                    if (userSnap.exists()) {
                        // Guardar TODOS los datos del usuario en solicitudData.usuario
                        solicitudData.usuario = {
                            id: userSnap.id,
                            ...userSnap.data()
                        };
                    } else {
                        solicitudData.usuario = { nombre: "Usuario eliminado", id: userRef.id };
                    }
                } catch (error) {
                    console.error(`Error al obtener el usuario para la solicitud ${solicitudData.id}:`, error);
                    solicitudData.usuario = { nombre: "Error de carga" };
                }
            } else {
                solicitudData.usuario = { nombre: "N/A (Referencia faltante o no válida)" };
            }

            return solicitudData;
        }); // 👈 Cierre del .map()

        // 2. Esperar a que TODAS las lecturas de solicitudes y usuarios terminen
        let loadedRequests = await Promise.all(requestsPromises);

        // 3. Ordenar los resultados en el cliente
        loadedRequests.sort((a, b) => b.fecha_solicitud.toDate() - a.fecha_solicitud.toDate());


        console.log("Solicitudes cargadas y desnormalizadas con éxito:", loadedRequests.length);
        return loadedRequests;

    } catch (error) {
        console.error("Error al obtener las solicitudes de kinesiologo:", error);
        return [];
    }
}