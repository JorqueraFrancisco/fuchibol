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
import {
    fetchMatchAndPlayers,
    addPlayer,
    removePlayer,
    assignTeams,
} from "~/services/firestore/match-service";
import { MatchTeam } from "~/components/match/match-team";


/** Route action to handle match form submission */
export const useMatchForm = routeAction$(async (data) => {
    const { locale, date, time, match_id } = data;
    await setDoc(doc(db, "matches", match_id), {
        date: date,
        time: time,
        locale: locale,
    });
    return data;
});

// El use signal se puede modificar desde el componente hijo mediante el uso de Signal 
// en la interface del prop del componente hijo, en cambio el use store no se puede 
// modificar desde el componente hijo, por lo que es mejor usar el use signal 
// para los estados que se van a modificar desde el componente hijo. 
// O usar el useContext para compartir el estado entre componentes.

/** Main Component */
export default component$(() => {
    // Interfaces
    interface Player {
        id: string;
        name: string;
        team: number;
    }

    // States and Signals
    const teamViewState = useSignal(false);
    const loadingState = useSignal(false); // remover

    const matchInfo = useContext(MatchListContext);

    const teamAColor = useSignal("rojo");
    const teambColor = useSignal("#FFFFFF");

    const match_id = useLocation().params.match_id; /** MATCH ID */

    /** Generate teams from players */
    const createTeams = $(async () => {
        const players = matchInfo.players;

        players.forEach((player, index) => {
            const team = index % 2 === 0 ? 1 : 2;
            player.team = team;
        });

        await assignTeams(match_id, players);
        matchInfo.players = players;
        teamViewState.value = true;
    });

    /** Initial data fetch */
    useTask$(async () => {

        console.log("Fetching match data...");

        const { matchData, playersList } = await fetchMatchAndPlayers(match_id);
        matchInfo.players = playersList
        Object.assign(matchInfo, matchData);
        const hasTeamAssigned = matchInfo.players.some(
            player => player.team === 1 || player.team === 2
        );
        console.log("hasTeamAssigned", hasTeamAssigned);
        teamViewState.value = hasTeamAssigned;
        loadingState.value = false;

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
                match_id={match_id}
                teamViewState={teamViewState}
            />
            {
                teamViewState.value ?
                    <div>
                        <div class="container">
                                <div class="team-header container">
                                    <h2>Equipo 1</h2>
                                    <div class="container-team-name">
                                    </div>
                                </div>
                                <MatchTeam
                                    match_id={match_id}
                                    teamViewState={teamViewState}
                                    team={1}
                                />
                          
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
                                <MatchTeam
                                    match_id={match_id}
                                    teamViewState={teamViewState}
                                    team={2}
                                />

                        </div>
                    </div>
                    :
                    <div>
                        <div class="container">
                            <MatchTeam
                                match_id={match_id}
                                teamViewState={teamViewState}
                            />
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
