import { $, component$, useSignal, useStore } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Teams } from "~/components/teams/teams";

import { db } from "~/fireabase";
import { collection, addDoc, doc, setDoc } from "firebase/firestore"; 

export default component$(() => {
  const listState = useStore(
    {
      players: [
        'Francisco',
        'Carlos',
        'Pedro'
      ],
      places: [
        { locale: 'Pueblito peñuelas', cost: 28000 },
        { locale: 'Rossi', cost: 28000 },
        { locale: 'Primer tiempo', cost: 28000 },
        { locale: 'Strochi', cost: 28000 },
      ],
    }
  );
  const showTeamsState = useSignal(false)
  const playerState = useSignal('')

  //bd save
  const localeState = useSignal('')
  const dateState = useSignal('2024-02-04')
  const timeState = useSignal('11:00')

  const addPlayerList =  $(async(event, team: number) => {
    if (event.key === 'Enter') {
      listState.players.push(event.target.value);
      playerState.value = ' '
      try {
        const matches = collection(db, "matches")
        const match = addDoc(collection(matches, "partido-01"),{
          place: "penuelas",
          fecha: "22-02-02"
        })
 
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
  })

  return (
    <>
      {
        showTeamsState.value ? <Teams /> :
          <div class="container">
            <div class="team">
              <div class="header">
                <div class="info">
                  <h1>Lista Partido</h1>
                  <select>
                    {
                      listState.places.map((place, index) => (
                        <option key={index}>{place.locale}</option>
                      ))
                    }

                  </select>
                  <input type="date" value={dateState.value} />
                  <input type="time" value={timeState.value} min="12:00" max="22:00" />
                  <h4>Jugadores: {listState.players.length}</h4>
                </div>
              </div>
              <ul id="team1List">
                {
                  listState.players.map((player, index) => (
                    <li key={index}>
                      {index + 1} - {player} <i class="fas fa-trash-alt"></i>
                    </li>
                  ))
                }
              </ul>
              <input
                onKeyDown$={(event) => addPlayerList(event, 1)}
                type="text"
                value={playerState.value}
                placeholder="Agregar jugador"
              />
            </div>
            <button onClick$={() => showTeamsState.value = true}>Generar equipos</button>
          </div>
      }
    </>
  );
});

export const Input = component$(() => {
  return <div>Hello Qwik!</div>
});

export const head: DocumentHead = {
  title: "Fuchibol",
  meta: [
    {
      name: "Lista para partidos",
      content: "Qwik site description",
    },
  ],
};
