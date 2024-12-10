// src/store/pokemonSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentPokemon: null,
  deck: [],
  loading: false,
};

const pokemonSlice = createSlice({
  name: "pokemon",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setCurrentPokemon: (state, action) => {
      state.currentPokemon = action.payload;
    },
    addToDeck: (state) => {
      if (state.currentPokemon) {
        state.deck.push(state.currentPokemon);
      }
    },
    setDeck: (state, action) => {
      state.deck = action.payload;
    },
  },
});

export const { setLoading, setCurrentPokemon, addToDeck, setDeck } =
  pokemonSlice.actions;

export default pokemonSlice.reducer;
