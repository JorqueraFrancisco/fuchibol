import { fetchMatchAndPlayers } from "~/services/firestore/match-service";
const { matchData, playersList } = await fetchMatchAndPlayers(match_id);
console.log({ matchData, playersList })

import {
    $,
    component$,
    useSignal,
    useStore,
    useVisibleTask$,
    useTask$,
    useContext,
} from "@builder.io/qwik";
import {
    routeAction$,
    useLocation,
    type DocumentHead,
    Form,
} from "@builder.io/qwik-city";

import { db } from "~/fireabase";
import {
    collection,
    addDoc,
    doc,
    setDoc,
    getDoc,
    getDocs,
    deleteDoc,
    query,
    orderBy,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";
import { MatchListContext } from "~/context";
import { MatchHeader } from "~/components/match/match-header";


/** Route action to handle match form submission */
export const useMatchForm = routeAction$(async (data) => {
    const { place, date, time, match_id } = data;
    await setDoc(doc(db, "matches", match_id), {
        date: date,
        time: time,
        place: place,
    });
    return data;
});

/** Main Component */
export default component$(() => {
    // Interfaces
    interface Player {
        id: string;
        name: string;
        team: number;
    }

    // States and Signals
    const showConfState = useSignal(false);
    const listState = useContext(MatchListContext);
    const teamViewState = useSignal(false);
    const playerInputState = useSignal("");
    const loadingState = useSignal(false);
    const playerLoadingState = useSignal("");

    const localeState = useSignal("");
    const dateState = useSignal("");
    const timeState = useSignal("");

    const teamAColor = useSignal("rojo");
    const teambColor = useSignal("#FFFFFF");

    const match_id = useLocation().params.match_id; /** MATCH ID */

    /** Fetch player list and match details */
    const getPlayerList = $(async () => {
        const playersList: Player[] = [];

        const matchDocRef = doc(db, "matches", match_id);
        const matchDoc = await getDoc(matchDocRef);

        const playersDocs = await getDocs(
            query(
                collection(db, `matches/${match_id}/players`),
                orderBy("timestamp")
            )
        );

        playersDocs.forEach((doc) => {
            playersList.push({
                id: doc.id,
                name: doc.data().name,
                team: doc.data().team,
            } as Player);
        });

        if (matchDoc.exists()) {
            localeState.value = matchDoc.data().place;
            dateState.value = matchDoc.data().date;
            timeState.value = matchDoc.data().time;
            teamViewState.value = matchDoc.data().teamView;
        } else {
            console.log("No such document!", match_id);
        }

        listState.players = playersList;
    });

    /** Add a player to the list */
    const addPlayerList = $(async (event, team: number) => {
        if (event.key === "Enter") {
            loadingState.value = true;
            playerInputState.value = "";
            await addDoc(collection(db, `matches/${match_id}/players`), {
                name: event.target.value,
                timestamp: serverTimestamp(),
            });
            await getPlayerList();
            loadingState.value = false;
        }
    });

    /** Delete a player from the list */
    const deletePlayer = $(async (id: string) => {
        listState.players = listState.players.filter((item) => item.id !== id);
        playerLoadingState.value = id;
        await deleteDoc(doc(db, "matches", match_id, "players", id));
    });

    /** Generate teams from players */
    const createTeams = $(async () => {
        const players = listState.players;

        players.sort(() => Math.random() - 0.5);

        players.forEach((player, index) => {
            const team = index % 2 === 0 ? 1 : 2;
            updateDoc(doc(db, "matches", match_id, "players", player.id), {
                team: team,
            });
            player.team = team;
        });

        listState.players = players;
        updateDoc(doc(db, "matches", match_id), {
            teamView: true,
        });
        teamViewState.value = true;

    });

    /** Initial data fetch */
    useTask$(async () => {
        await getPlayerList();
    });

    const set_team_color = (team: number, color: string) => {

    }

    /** Action for match form */
    const action = useMatchForm();

    /** Render the component */
    return (
        <>
            <MatchHeader 
                action={action}
                dateState={dateState} 
                localeState={localeState}
                timeState={timeState}
                match_id={match_id}
            />
            {
                teamViewState.value ?
                    <div>
                        <div class="container">
                            <div class="team" id="team1">
                                <div class="team-header container">
                                    <h2>Equipo 1</h2>
                                    <div class="container-team-name">
                                        <div class="color-box" id="colorBox1"></div>
                                        <select id="colorPicker1" bind:value={teamAColor}>
                                            <option value="#FFFFFF">Blanco</option>
                                            <option value="#FF0000">Rojo</option>
                                            <option value="#0000FF">Azul</option>
                                            <option value="#FFFF00">Amarillo</option>
                                            <option value="#008000">Verde</option>
                                            <option value="#A52A2A">Café</option>
                                            <option value="#000000">Negro</option>
                                        </select>


                                        <select id="colorPicker1">
                                            <option value="#FFFFFF">Blanco</option>
                                            <option value="#FF0000">Rojo</option>
                                            <option value="#0000FF">Azul</option>
                                            <option value="#FFFF00">Amarillo</option>
                                            <option value="#008000">Verde</option>
                                            <option value="#A52A2A">Café</option>
                                            <option value="#000000">Negro</option>
                                        </select>
                                    </div>
                                </div>
                                <ul>
                                    {
                                        listState.players.map((player: Player, index) => (
                                            <div key={player.id}>

                                                {
                                                    player.team == 1 ?
                                                        <li key={player.id}>

                                                            <div class="icono">{index + 1} </div> {player.name}
                                                            {
                                                                playerLoadingState.value == player.id ?
                                                                    <i class="fa fa-refresh fa-spin"></i>
                                                                    :
                                                                    <i key={index} onClick$={() => deletePlayer(player.id)} class="fas fa-trash-alt"></i>
                                                            }
                                                        </li>
                                                        : ""
                                                }
                                            </div>
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
                            <div class="team" id="team2">
                                <div class="team-header container">
                                    <h2>Equipo 2</h2>
                                    <div class="container-team-name">
                                        <div class="color-box" id="colorBox2"></div>
                                        <select id="colorPicker2">
                                            <option value="#FFFFFF">Blanco</option>
                                            <option value="#FF0000">Rojo</option>
                                            <option value="#0000FF">Azul</option>
                                            <option value="#FFFF00">Amarillo</option>
                                            <option value="#008000">Verde</option>
                                            <option value="#A52A2A">Café</option>
                                            <option value="#000000">Negro</option>
                                        </select>
                                    </div>
                                </div>
                                <ul>
                                    {
                                        listState.players.map((player: Player, index) => (
                                            <div key={player.id}>
                                                {
                                                    player.team == 2 ?
                                                        <li key={player.id}>
                                                            <div class="icono">{index + 1} </div> {player.name}
                                                            {
                                                                playerLoadingState.value == player.id ?
                                                                    <i class="fa fa-refresh fa-spin"></i>
                                                                    :
                                                                    <i key={index} onClick$={() => deletePlayer(player.id)} class="fas fa-trash-alt"></i>
                                                            }
                                                        </li>
                                                        : ""
                                                }
                                            </div>
                                        ))
                                    }
                                </ul>
                                {loadingState.value ?
                                    <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                                    :
                                    <input
                                        onKeyDown$={(event) => addPlayerList(event, 2)}
                                        type="text"
                                        placeholder="Agregar jugador"
                                    />}


                            </div>
                        </div>
                    </div>
                    :
                    <div>
                        <div class="container">
                            <div class="team">
                                <ul>
                                    {
                                        listState.players.map((player: Player, index) => (
                                            <li key={player.id}>
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
                            <button
                                class="mi-boton"
                                onClick$={() => createTeams()}
                            >
                                Crear equipos
                            </button>
                        </div>

                    </div>
            }
        </>
    );
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
