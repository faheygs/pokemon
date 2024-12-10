import {
  ADD_DECK,
  DELETE_DECK,
  UPDATE_DECK_NAME,
  DELETE_CARD_FROM_DECK,
  ADD_CARD_TO_DECK,
  SAVE_GENERATED_DECK,
} from "./deckActions";

const initialState = {
  customDecks: [], // State starts with an empty list of custom decks
};

const deckReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_DECK:
      if (state.customDecks.some((deck) => deck.name === action.payload.name)) {
        alert("A deck with this name already exists.");
        return state;
      }
      return {
        ...state,
        customDecks: [...state.customDecks, action.payload],
      };

    case DELETE_DECK:
      return {
        ...state,
        customDecks: state.customDecks.filter(
          (_, index) => index !== action.payload
        ),
      };

    case UPDATE_DECK_NAME:
      return {
        ...state,
        customDecks: state.customDecks.map((deck, index) =>
          index === action.payload.deckIndex
            ? { ...deck, name: action.payload.newName }
            : deck
        ),
      };

    case DELETE_CARD_FROM_DECK: {
      const { deckIndex, cardIndex } = action.payload;
      return {
        ...state,
        customDecks: state.customDecks.map((deck, index) =>
          index === deckIndex
            ? {
                ...deck,
                cards: deck.cards.filter((_, idx) => idx !== cardIndex),
              }
            : deck
        ),
      };
    }

    case ADD_CARD_TO_DECK: {
      const { deckName, card } = action.payload;
      return {
        ...state,
        customDecks: state.customDecks.map((deck) => {
          if (deck.name === deckName) {
            // Check for duplicates before adding the card
            const isDuplicate = deck.cards.some(
              (existingCard) => existingCard.id === card.id
            );
            if (isDuplicate) {
              alert("This Pokémon is already in the deck.");
              return deck; // No changes if the card is already in the deck
            }
            return {
              ...deck,
              cards: [...deck.cards, card],
            };
          }
          return deck;
        }),
      };
    }

    case SAVE_GENERATED_DECK:
      if (state.customDecks.some((deck) => deck.name === action.payload.name)) {
        alert(
          "A deck with this name already exists. Please choose a different name."
        );
        return state;
      }
      return {
        ...state,
        customDecks: [...state.customDecks, action.payload],
      };

    default:
      return state;
  }
};

export default deckReducer;
