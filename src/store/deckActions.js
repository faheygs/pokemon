export const ADD_DECK = "ADD_DECK";
export const DELETE_DECK = "DELETE_DECK";
export const UPDATE_DECK_NAME = "UPDATE_DECK_NAME";
export const DELETE_CARD_FROM_DECK = "DELETE_CARD_FROM_DECK";
export const ADD_CARD_TO_DECK = "ADD_CARD_TO_DECK";
export const SAVE_GENERATED_DECK = "SAVE_GENERATED_DECK";

export const saveGeneratedDeck = (deckName, deckCards) => ({
  type: SAVE_GENERATED_DECK,
  payload: {
    name: deckName,
    cards: deckCards,
  },
});

export const addCardToDeck = (deckName, card) => ({
  type: ADD_CARD_TO_DECK,
  payload: {
    deckName,
    card,
  },
});

export const addDeck = (deckName) => ({
  type: ADD_DECK,
  payload: {
    name: deckName,
    cards: [], // Newly created deck starts empty
  },
});

export const deleteDeck = (deckIndex) => ({
  type: DELETE_DECK,
  payload: deckIndex,
});

export const updateDeckName = (deckIndex, newName) => ({
  type: UPDATE_DECK_NAME,
  payload: {
    deckIndex,
    newName,
  },
});

export const deleteCardFromDeck = (deckIndex, cardIndex) => ({
  type: DELETE_CARD_FROM_DECK,
  payload: {
    deckIndex,
    cardIndex,
  },
});
