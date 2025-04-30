import { component$ } from '@builder.io/qwik';

export default component$(() => {
  




    return(
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
                        </div>F

    )
});