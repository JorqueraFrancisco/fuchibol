import { component$, Slot, useContextProvider, useStore } from "@builder.io/qwik";
import { MatchListContext, type MatchListState } from "./match-list.context";



export const MatchProvider = component$(() => {

    const listState = useStore<MatchListState>({
        players: [],
        places: [
            { locale: "Pueblito peñuelas", cost: 28000 },
            { locale: "Rossi", cost: 28000 },
            { locale: "Primer tiempo", cost: 28000 },
            { locale: "Strochi", cost: 28000 },
            { locale: "COOOONTEXTO", cost: 28000 },
        ],
    });

    useContextProvider(MatchListContext, listState);

    return <Slot />;
});