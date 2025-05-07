import { $, component$, Signal, useContext, useSignal } from '@builder.io/qwik';
import { MatchListContext, Player } from '~/context';
import { addPlayer, removePlayer } from '~/services/firestore/match-service';

interface MatchTeamProps {
    match_id: string;
    teamViewState: Signal<boolean>;
}

export const MatchTeam = component$<MatchTeamProps>(({
    match_id,
    teamViewState,
}) => {

    const loadingState = useSignal(false);
    const playerLoadingState = useSignal("");
    const matchInfo = useContext(MatchListContext);

    /** Delete a player from the list */
    const deletePlayer = $(async (player_id: string) => {
        matchInfo.players = matchInfo.players.filter((item) => item.id !== player_id);
        playerLoadingState.value = player_id;
        await removePlayer(match_id, player_id);
    });

    /** Add a player to the list */
    const addPlayerList = $(async (event, team: number) => {
        if (event.key === "Enter") {
            loadingState.value = true;

            const docRef = await addPlayer(
                match_id,
                event.target.value,
            );

            matchInfo.players.push({
                id: docRef.id,
                name: event.target.value,
                team: 0,
            } as Player);

            loadingState.value = false;
        }
    });

    return (
        <div class="team">
            <ul>
                {
                    matchInfo.players.map((player: Player, index) => (
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
    )
});