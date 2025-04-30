import {
    component$,
    Signal,
    useContext,
    useSignal,
} from '@builder.io/qwik';
import { Form, useLocation } from '@builder.io/qwik-city';
import { MatchListContext } from '~/context';

interface MatchHeaderProps {
    action: () => void;
    localeState: Signal<string>;
    dateState: Signal<string>;
    timeState: Signal<string>;
    match_id: string;
}

export const MatchHeader = component$<MatchHeaderProps>(({
    action,
    localeState,
    dateState,
    timeState,
    match_id,
  }) => {

    const showConfState = useSignal(false);
    const listState = useContext(MatchListContext);

    // Solo usado localmente aquí (si lo necesitas, pasa como prop)
    const matchProviderState = useContext(MatchListContext); // Asumiendo que 'places' también está en MatchListContext
    return (
        <div class="header">
            {!showConfState.value ? (
                <div>
                    <p>{dateState.value}</p>
                    <p>{timeState.value}</p>
                    <p>{localeState.value}</p>
                    <div>
                        <i
                            class="fas fa-cog"
                            style={{ color: '#74C0FC' }}
                            onClick$={() => (showConfState.value = true)}
                        ></i>
                        <div class="info"></div>
                    </div>
                </div>
            ) : (
                <Form
                    action={action} // <-- Aquí debes pasar el `useMatchForm()` como prop si es necesario
                    onSubmitCompleted$={(e) => {
                        const { place, date, time } = e.detail.value;
                        localeState.value = place;
                        dateState.value = date;
                        timeState.value = time;
                        showConfState.value = false;
                    }}
                    class="info"
                >
                    <select name="place" bind:value={localeState.value}>
                        {matchProviderState.places.map((place, index) => (
                            <option key={index}>{place.locale}</option>
                        ))}
                    </select>
                    <input name="date" type="date" value={dateState.value} />
                    <select name="time" bind:value={timeState}>
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
                    <input name="match_id" type="hidden" value={match_id} />
                    <button type="submit">Confirmar</button>
                    <button type="button" onClick$={() => (showConfState.value = false)}>
                        Cancelar
                    </button>
                </Form>
            )}
            <h4>Jugadores: {listState.players.length}</h4>
        </div>
    );
});
