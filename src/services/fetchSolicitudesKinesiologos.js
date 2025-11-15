import {
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore"; // 👈 Se añadió 'doc'
import { db } from "./firebase-config";

/**
 * Obtiene todas las solicitudes de kinesiología de 'solicitudes_kinesiologo',
 * incluyendo TODOS los datos del documento de usuario referenciado.
 * * @returns {Promise<Array>} Una promesa que resuelve a un array de objetos de solicitud
 * con todos los datos. El documento de usuario completo se guarda en 'solicitudData.usuario'.
 */
export async function getKineRequests() {
  try {
    const querySnapshot = await getDocs(
      collection(db, "solicitudes_kinesiologo")
    );

    // Mapear los documentos y resolver las referencias de usuario en paralelo
    const requestsPromises = querySnapshot.docs.map(async (docSnap) => {
      const solicitudData = {
        id: docSnap.id,
        ...docSnap.data(),
      };

      let userRef = solicitudData.usuario;

      // 1. CORRECCIÓN: Verificar si es una cadena (el ID) y reconstruir la referencia
      if (userRef && typeof userRef === "string") {
        // Se usa la función 'doc' (que se importó) para crear el objeto DocumentReference
        userRef = doc(db, "usuarios", userRef);
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
              ...userSnap.data(),
            };
          } else {
            solicitudData.usuario = {
              nombre: "Usuario eliminado",
              id: userRef.id,
            };
          }
        } catch (error) {
          console.error(
            `Error al obtener el usuario para la solicitud ${solicitudData.id}:`,
            error
          );
          solicitudData.usuario = { nombre: "Error de carga" };
        }
      } else {
        solicitudData.usuario = {
          nombre: "N/A (Referencia faltante o no válida)",
        };
      }

      return solicitudData;
    }); // 👈 Cierre del .map()

    // 2. Esperar a que TODAS las lecturas de solicitudes y usuarios terminen
    let loadedRequests = await Promise.all(requestsPromises);

    // 3. Ordenar los resultados en el cliente
    loadedRequests.sort(
      (a, b) => b.fecha_solicitud.toDate() - a.fecha_solicitud.toDate()
    );

    console.log(
      "Solicitudes cargadas y desnormalizadas con éxito:",
      loadedRequests.length
    );
    return loadedRequests;
  } catch (error) {
    console.error("Error al obtener las solicitudes de kinesiologo:", error);
    return [];
  }
}

export const aceptarSolicitud = async (solicitudId) => {
  // 1. Referencia a la solicitud
  const solicitudRef = doc(db, "solicitudes_kinesiologo", solicitudId);

  try {
    // 2. Obtener la solicitud para extraer el ID del usuario
    const solicitudSnap = await getDoc(solicitudRef);

    if (!solicitudSnap.exists()) {
      console.error(`La solicitud con ID ${solicitudId} no existe.`);
      return;
    }

    const solicitudData = solicitudSnap.data();

    // Asumiendo que el ID del usuario se encuentra en solicitudData.usuario.id
    const usuarioId = solicitudData.usuario;
    console.log("Usuario id:", usuarioId);

    if (!usuarioId) {
      console.error("ID de usuario no encontrado en la solicitud.");
      return;
    }

    // 3. Referencia al documento del usuario en la colección "usuarios"
    const usuarioRef = doc(db, "usuarios", usuarioId);

    // 4. Definir las actualizaciones para el usuario (ej: asignarle el nuevo rol)
    const updatesParaUsuario = {
      tipo_usuario: doc(db, "tipo_usuario", "3"), // Establecer el nuevo rol
      isPro: false,
      perfilDestacado: false,
      limitePacientes: 50,
    };

    // 5. Realizar ambas actualizaciones:

    // A. Actualizar el estado de la solicitud
    await updateDoc(solicitudRef, {
      estado: "aceptada",
    });

    // B. Actualizar el documento del usuario
    await updateDoc(usuarioRef, updatesParaUsuario);

    console.log(
      `Solicitud ${solicitudId} aceptada y usuario ${usuarioId} actualizado a kinesiologo.`
    );
  } catch (error) {
    console.error(
      "¡Error al aceptar la solicitud y actualizar el usuario! 😬",
      error
    );
  }
};

export const rechazarSolicitud = async (solicitudId) => {
  // 1. Obtener la referencia al documento
  const solicitudRef = doc(db, "solicitudes_kinesiologo", solicitudId);
  console.log(solicitudRef);
  try {
    // 2. Usar updateDoc para cambiar solo el campo 'estado'
    await updateDoc(solicitudRef, {
      estado: "rechazada",
    });

    console.log(
      `Estado de la solicitud ${solicitudId} actualizado a: rechazada`
    );
  } catch (error) {
    console.error("¡Error al actualizar el estado de la solicitud! 😬", error);
  }
};

export const getUsuarioDeSolicitud = async (solicitudId) => {
  // 1. Obtener la referencia al documento de la solicitud
  const solicitudRef = doc(db, "solicitudes_kinesiologo", solicitudId);

  try {
    // 2. Leer el documento
    const solicitudSnap = await getDoc(solicitudRef);

    if (solicitudSnap.exists()) {
      // 3. Extraer los datos del documento
      const data = solicitudSnap.data();

      // 4. Devolver el campo 'usuario' (que contiene los datos del usuario)
      console.log(`Usuario de la solicitud ${solicitudId} obtenido con éxito.`);
      return data.usuario;
    } else {
      console.warn(`No se encontró el documento con ID: ${solicitudId}`);
      return null;
    }
  } catch (error) {
    console.error("¡Error al obtener el usuario de la solicitud! 😔", error);
    return null;
  }
};
