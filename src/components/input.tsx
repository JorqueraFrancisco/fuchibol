import { component$ } from "@builder.io/qwik";

interface Props {
    player:string;
    addTeamPlayer: Function;
}

export const PlayerInput = component$(({player, addTeamPlayer}:Props) => {
  return (
  <>
    <input 
        onKeyDown$={(event) => addTeamPlayer(event, 2)}
        type="text"
        value={player}
        placeholder="Agregar jugador al Equipo 2"
    />
  </>
)
});