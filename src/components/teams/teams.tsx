import { $, component$, useSignal, useStore } from "@builder.io/qwik";


export const Teams = component$(() => {

    const teamsState = useStore(
        {
            one: ['Francisco', 'Carlos', 'Pedro'],
            two: ['Pepe', 'Benja', 'Juan']
        }
    );

    const playerOneState = useSignal('')
    const playerTwoState = useSignal('')

    const addTeamPlayer = $((event, team: number) => {
        if (event.key === 'Enter') {
            if (team == 1) {
                teamsState.one.push(event.target.value);
                playerOneState.value = ' '
            }
            if (team == 2) {
                teamsState.two.push(event.target.value)
                playerTwoState.value = ' '
            }
        }
    })

    return (
        <>
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
                        onKeyDown$={(event) => addTeamPlayer(event, 1)}
                        type="text"
                        value={playerOneState.value}
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
                        onKeyDown$={(event) => addTeamPlayer(event, 2)}
                        type="text"
                        value={playerTwoState.value}
                        placeholder="Agregar jugador"
                    />

                </div>
            </div>
        </>
    )
});