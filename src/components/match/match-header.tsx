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
    match_id: string;
    teamViewState: Signal<boolean>;
}

export const MatchHeader = component$<MatchHeaderProps>(({
    action,
    match_id,
    teamViewState,
  }) => {

    const showConfState = useSignal(false);
    const matchInfo = useContext(MatchListContext);

    return (
        <div class="header">
            {!showConfState.value ? (
                <div>
                    <p>{matchInfo.date}</p>
                    <p>{matchInfo.time}</p>
                    <p>{matchInfo.locale}</p>
                    <div>
                        <i
                            class="fas fa-cog"
                            style={{ color: '#74C0FC' }}
                            onClick$={() => (showConfState.value = true)}
                        ></i>
                        <div class="info"></div>
                    </div>
                    <button  onClick$={() => teamViewState.value = !teamViewState.value}>Cambiar vista</button>
                </div>
            ) : (
                <Form
                    action={action} // <-- Aquí debes pasar el `useMatchForm()` como prop si es necesario
                    onSubmitCompleted$={(e) => {
                        const { locale, date, time } = e.detail.value;
                        matchInfo.locale = locale;
                        matchInfo.date = date;
                        matchInfo.time = time;
                        showConfState.value = false;
                    }}
                    class="info"
                >
                    <select name="locale" bind:value={matchInfo.locale}>
                        {matchInfo.places.map((place, index) => (
                            <option key={index}>{place.locale}</option>
                        ))}
                    </select>
                    <input name="date" type="date" value={matchInfo.date} />
                    <select name="time" bind:value={matchInfo.time}>
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
            <h4>Jugadores: {matchInfo.players.length}</h4>
        </div>
    );
});
