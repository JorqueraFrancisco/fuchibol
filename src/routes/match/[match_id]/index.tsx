import { $, component$, useSignal, useStore, useVisibleTask$, useTask$ } from "@builder.io/qwik";
import { useLocation, type DocumentHead } from "@builder.io/qwik-city";
import { Teams } from "~/components/teams/teams";

import { db } from "~/fireabase";
import { collection, addDoc, doc, setDoc, getDocs, deleteDoc, query, orderBy, serverTimestamp } from "firebase/firestore";

export default component$(() => {
    interface Player {
        id: string;
        name: string;
        team: number;
    }

    const location = useLocation()
    const listState = useStore(
        {
            players: [] as Player[],
            places: [
                { locale: 'Pueblito peñuelas', cost: 28000 },
                { locale: 'Rossi', cost: 28000 },
                { locale: 'Primer tiempo', cost: 28000 },
                { locale: 'Strochi', cost: 28000 },
            ],
        }
    );
    const showTeamsState = useSignal(false)
    const playerInputState = useSignal('')
    const loadingState = useSignal(false)
    const playerLoadingState = useSignal('')

    //bd save
    const localeState = useSignal('')
    const dateState = useSignal('2024-02-04')
    const timeState = useSignal('11:00')
    const match_id = location.params.match_id


    const getPlayerList = $(async () => {
        let playersList: Player[] = []
        let playersDocs = await (getDocs(
            query(collection(db, "matches/" + match_id + "/players"), orderBy('timestamp'))
        ))



        playersDocs.forEach((doc) => {
            playersList.push({
                id: doc.id,
                name: doc.data().name,
                team: doc.data().team
            } as Player)
        });

        listState.players = playersList
        console.log(listState.players);
    })


    const addPlayerList = $(async (event, team: number) => {

        if (event.key === 'Enter') {
            loadingState.value = true
            playerInputState.value = ''
            const matches = addDoc(
                collection(db, "matches/" + match_id + "/players"),
                {
                    name: event.target.value,
                    timestamp: serverTimestamp(),
                },
            )
            await getPlayerList()
            loadingState.value = false
        }
    })

    const deletePlayer = $(async (id: string) => {
        playerLoadingState.value = id
        await deleteDoc(doc(db, "matches", match_id, "players", id));
        await getPlayerList()
    })

    useTask$(async () => {
        await getPlayerList()
        // const q = query(collection(db, "matches/" + match_id + "/players"));
        // onSnapshot(q, (querySnapshot) => {
        //     const players: string[] = [];
        //     querySnapshot.forEach((doc) => {
        //         players.push(doc.data().name);
        //         listState.players.push(doc.data().name)
        //     });
        //     console.log("Current cities in CA: ", players.join(", "), listState.players.length);
        // });

    })

    return (
        <>
            {
                showTeamsState.value ? <Teams /> :
                    <div>
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
                                <ul>
                                    {
                                        listState.players.map((player: Player, index) => (
                                            <li key={index}>

                                                <div class="icono">{index + 1} </div> {player.name}
                                                {
                                                    playerLoadingState.value == player.id ?
                                                        <i class="fa fa-refresh fa-spin"></i>
                                                        :
                                                        <i key={index} onClick$={() => deletePlayer(player.id)} class="fas fa-trash-alt"></i>
                                                }



                                            </li>
                                        ))
                                    }
                                </ul>
                                {loadingState.value ?
                                    <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                                    :
                                    <input
                                        onKeyDown$={(event) => addPlayerList(event, 1)}
                                        type="text"
                                        placeholder="Agregar jugador"
                                    />}

                            </div>
                            <button class="team-button" onClick$={() => showTeamsState.value = true}>Generar equipos</button>
                        </div>

                    </div>
            }
        </>
    );
});

export const Input = component$(() => {
    return <div>Partidopp</div>
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
