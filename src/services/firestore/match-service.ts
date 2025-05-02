import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { db } from '~/fireabase';

// Types
export interface Player {
  id: string;
  name: string;
  team: number;
}

// Obtener jugadores y datos del partido
export const fetchMatchAndPlayers = async (match_id: string) => {
  const matchDocRef = doc(db, 'matches', match_id);
  const matchDoc = await getDoc(matchDocRef);

  const playersList: Player[] = [];
  const playersDocs = await getDocs(
    query(collection(db, `matches/${match_id}/players`), orderBy('timestamp'))
  );

  playersDocs.forEach((docSnap) => {
    playersList.push({
      id: docSnap.id,
      name: docSnap.data().name,
      team: docSnap.data().team,
    });
  });

  const matchData = matchDoc.exists() ? matchDoc.data() : null;

  return { matchData, playersList };
};

// Agregar jugador
export const addPlayer = async (match_id: string, name: string) => {
  return await addDoc(collection(db, `matches/${match_id}/players`), {
    name: name,
    team: 0,
    timestamp: serverTimestamp(),
  });
};

// Eliminar jugador
export const removePlayer = async (match_id: string, player_id: string) => {
  await deleteDoc(doc(db, 'matches', match_id, 'players', player_id));
};

// Actualizar equipos
export const assignTeams = async (match_id: string, players: Player[]) => {
  players.sort(() => Math.random() - 0.5);

  for (let i = 0; i < players.length; i++) {
    const team = i % 2 === 0 ? 1 : 2;
    players[i].team = team;

    await updateDoc(doc(db, 'matches', match_id, 'players', players[i].id), {
      team,
    });
  }

  await updateDoc(doc(db, 'matches', match_id), {
    teamView: true,
  });

  return players;
};

// Guardar/Actualizar detalles del partido
export const saveMatchDetails = async (
  match_id: string,
  data: { locale: string; date: string; time: string }
) => {
  await setDoc(doc(db, 'matches', match_id), data);
};
