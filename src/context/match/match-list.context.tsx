import { createContextId } from "@builder.io/qwik";

export interface Player {
  id: string;
  name: string;
  team: number;
}

export interface MatchListState {
  players: Player[];
  places: { locale: string; cost: number }[];
}

export const MatchListContext = createContextId<MatchListState>('match.list-context');