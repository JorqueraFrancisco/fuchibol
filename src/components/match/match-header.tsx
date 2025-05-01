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
    locale: Signal<string>;
    date: Signal<string>;
    time: Signal<string>;
    places: [];
    match_id: string;
}

export const MatchHeader = component$<MatchHeaderProps>(({
    action,
    locale,
    date,
    time,
    places,
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
                    <p>{date}</p>
                    <p>{time}</p>
                    <p>{locale}</p>
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
                        console.log(e.detail.value)
                        console.log(showConfState.value)
                        const { newLocale, newDate, newTime } = e.detail.value;
                        locale.value = newLocale;
                        date.value = newDate;
                        time.value = newTime;
                        showConfState.value = false;
                        console.log(showConfState.value)
                    }}
                    class="info"
                >
                    <select name="locale" bind:value={locale}>
                        {places.map((place, index) => (
                            <option key={index}>{place.locale}</option>
                        ))}
                    </select>
                    <input name="date" type="date" value={date} />
                    <select name="time" bind:value={time}>
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
