import { $, component$, useSignal, useStore, useVisibleTask$, useTask$, } from "@builder.io/qwik";
import { routeAction$, useLocation, type DocumentHead, Form } from "@builder.io/qwik-city";
import { Teams } from "~/components/teams/teams";

import { db } from "~/fireabase";
import { collection, addDoc, doc, setDoc, getDoc, getDocs, deleteDoc, query, orderBy, serverTimestamp } from "firebase/firestore";


export const useMatchForm = routeAction$(async (data) => {
    const { place, date, time, match_id } = data
    setDoc(doc(db, "matches", match_id), {
        date: date,
        time: time,
        place: place,
    });
    return data
});

export default component$(() => {
    interface Player {
        id: string;
        name: string;
        team: number;
    }

    const showConfState = useSignal(false)
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
    const dateState = useSignal('')
    const timeState = useSignal('')
    const match_id = location.params.match_id


    const getPlayerList = $(async () => {
        const playersList: Player[] = []

        const matchDocRef = doc(db, "matches", match_id)
        const matchDoc = await getDoc(matchDocRef)

        const playersDocs = await (getDocs(
            query(collection(db, "matches/" + match_id + "/players"), orderBy('timestamp'))
        ))

        playersDocs.forEach((doc) => {
            playersList.push({
                id: doc.id,
                name: doc.data().name,
                team: doc.data().team
            } as Player)
        });

        if (matchDoc.exists()) {
            localeState.value = matchDoc.data().place
            dateState.value = matchDoc.data().date
            timeState.value = matchDoc.data().time
        } else {
            console.log("No such document!", match_id);
        }

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
        listState.players = listState.players.filter(item => item.id !== id);
        console.log(listState.players);
        playerLoadingState.value = id
        await deleteDoc(doc(db, "matches", match_id, "players", id));
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

    const action = useMatchForm();

    const teamsState = useStore(
        {
            one: ['Francisco', 'Carlos', 'Pedro'],
            two: ['Pepe', 'Benja', 'Juan']
        }
    );
    return (
        <>
            {
                showTeamsState.value ?
                    <div>
                        <div class="header">
                            <div class="info">
                                <h1>Pueblito peñuelas</h1>
                                <h4>22/7/2024</h4>
                                <h4>19:30</h4>
                            </div>
                        </div>
                        <div class="container">
                            <div class="team" id="team1">
                                <div class="team-header container">
                                    <h2>Equipo 1</h2>
                                    <div class="container-team-name">
                                        <div class="color-box" id="colorBox1"></div>
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
                                <ul id="team1List">
                                    {
                                        teamsState.one.map((player, index) => (
                                            <li key={index}>
                                                {index + 1} - {player} <i class="fas fa-trash-alt"></i>
                                            </li>
                                        ))
                                    }
                                </ul>
                                <input
                                    onKeyDown$={(event) => {}}
                                    type="text"
                                    placeholder="Agregar jugador"
                                />
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
                                <ul id="team2List">
                                    {
                                        teamsState.two.map((player, index) => (
                                            <li key={index}>
                                                {index + 1} - {player} <i class="fas fa-trash-alt"></i>
                                            </li>
                                        ))
                                    }
                                </ul>

                                <input
                                    onKeyDown$={(event) => {}}
                                    type="text"
                                
                                    placeholder="Agregar jugador"
                                />

                            </div>
                        </div>
                    </div>
                    :
                    <div>
                        <div class="container">
                            <div class="team">
                                <div class="header">
                                    <h1>Lista Partido</h1>
                                    {showConfState.value ?
                                        ''
                                        :
                                        <div>
                                            <p>{dateState.value}</p>
                                            <p>{timeState.value}</p>
                                            <p>{localeState.value}</p>
                                            <div>
                                                <i
                                                    class="fas fa-cog"
                                                    style={{ color: "#74C0FC" }}
                                                    onClick$={() => (showConfState.value = true)}
                                                ></i>
                                                <div class="info"></div>
                                            </div>
                                        </div>

                                    }
                                    <div class="info">
                                        {
                                            showConfState.value ?
                                                <Form
                                                    action={action}
                                                    onSubmitCompleted$={(e) => {
                                                        const { place, date, time } = e.detail.value
                                                        localeState.value = place
                                                        dateState.value = date
                                                        timeState.value = time
                                                        showConfState.value = false
                                                    }}
                                                    class="info">
                                                    <select name="place" bind:value={localeState}>
                                                        {
                                                            listState.places.map((place, index) => (
                                                                <option key={index}>{place.locale}</option>
                                                            ))
                                                        }

                                                    </select>
                                                    <input name="date" type="date" value={dateState.value} />
                                                    <select name="time">
                                                        <option>11:00</option>
                                                        <option>12:00</option>
                                                        <option>13:00</option>
                                                        <option>14:00</option>
                                                        <option>15:00</option>
                                                        <option>16:00</option>
                                                        <option>17:00</option>
                                                        <option>18:00</option>
                                                        <option>19:00</option>
                                                        <option>20:00</option>
                                                        <option>21:00</option>
                                                        <option>22:00</option>
                                                        <option>23:00</option>
                                                    </select>
                                                    <input name="match_id" type="hidden" value={match_id}></input>
                                                    <button type="submit" class="">Confirmar</button>
                                                    <button type="button" class="" onClick$={() => showConfState.value = false}>Cancelar</button>

                                                </Form> : ''
                                        }

                                        <h4>Jugadores: {listState.players.length}</h4>
                                    </div>
                                </div>
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
                            <button class="mi-boton" onClick$={() => showTeamsState.value = true}>Generar equipos</button>
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
