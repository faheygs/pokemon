// src/store/store.js

import { configureStore } from "@reduxjs/toolkit";
import pokemonReducer from "./pokemonSlice";
import deckReducer from "./deckReducer";

export const store = configureStore({
  reducer: {
    pokemon: pokemonReducer,
    decks: deckReducer,
  },
});
