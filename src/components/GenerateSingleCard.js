import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addCardToDeck } from "../store/deckActions";
import PokemonCard from "./PokemonCard";
import "./GenerateSingleCard.css";

const GenerateSingleCard = () => {
  const dispatch = useDispatch();
  const customDecks = useSelector((state) => state.decks.customDecks);
  const [card, setCard] = useState(null);
  const [canEvolve, setCanEvolve] = useState(true); // To control the evolve button state
  const [canDevolve, setCanDevolve] = useState(true); // To control the devolve button state

  // Function to generate a single random Pokémon card
  const generateSingleCard = async () => {
    try {
      const randomId = Math.floor(Math.random() * 898) + 1;
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${randomId}`
      );
      const data = await response.json();
      updateCardState(data);
      checkEvolutionAvailability(data);
    } catch (error) {
      console.error("Failed to fetch Pokémon card:", error);
    }
  };

  // Function to update the card state with the new Pokémon data
  const updateCardState = (data) => {
    setCard({
      id: data.id,
      name: data.name,
      hp: data.stats.find((stat) => stat.stat.name === "hp").base_stat,
      types: data.types.map((type) => type.type.name).join(", "),
      height: data.height,
      weight: data.weight,
      attacks: data.moves.slice(0, 2).map((move) => move.move.name),
      image: data.sprites.other["official-artwork"].front_default,
    });
  };

  // Function to evolve the current Pokémon (move to next evolution)
  const evolvePokemon = async () => {
    if (!card || !canEvolve) return;
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${card.id}`
      );
      const data = await response.json();

      const evolutionChainUrl = data.evolution_chain.url;
      const evolutionResponse = await fetch(evolutionChainUrl);
      const evolutionData = await evolutionResponse.json();

      // Find the current Pokémon in the evolution chain
      const evolutionChain = evolutionData.chain;
      const evolvedPokemonId = findNextEvolution(evolutionChain, card.name);

      if (evolvedPokemonId) {
        const evolvedResponse = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${evolvedPokemonId}`
        );
        const evolvedData = await evolvedResponse.json();
        updateCardState(evolvedData);
        checkEvolutionAvailability(evolvedData);
      } else {
        alert("No further evolutions available.");
        setCanEvolve(false); // Disable evolve button
      }
    } catch (error) {
      console.error("Failed to evolve Pokémon:", error);
    }
  };

  // Function to devolve the current Pokémon (move to previous evolution)
  const devolvePokemon = async () => {
    if (!card || !canDevolve) return;
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${card.id}`
      );
      const data = await response.json();

      const evolutionChainUrl = data.evolution_chain.url;
      const evolutionResponse = await fetch(evolutionChainUrl);
      const evolutionData = await evolutionResponse.json();

      // Find the current Pokémon in the evolution chain
      const evolutionChain = evolutionData.chain;
      const devolvedPokemonId = findPreviousEvolution(
        evolutionChain,
        card.name
      );

      if (devolvedPokemonId) {
        const devolvedResponse = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${devolvedPokemonId}`
        );
        const devolvedData = await devolvedResponse.json();
        updateCardState(devolvedData);
        checkEvolutionAvailability(devolvedData);
      } else {
        alert("No previous evolutions available.");
        setCanDevolve(false); // Disable devolve button
      }
    } catch (error) {
      console.error("Failed to devolve Pokémon:", error);
    }
  };

  // Helper function to find the next evolution in the chain
  const findNextEvolution = (chain, currentName) => {
    if (chain.species.name === currentName.toLowerCase()) {
      if (chain.evolves_to.length > 0) {
        return chain.evolves_to[0].species.url.split("/")[6]; // Extract ID from URL
      }
      return null;
    }
    for (let nextChain of chain.evolves_to) {
      const result = findNextEvolution(nextChain, currentName);
      if (result) return result;
    }
    return null;
  };

  // Helper function to find the previous evolution in the chain
  const findPreviousEvolution = (chain, currentName, previous = null) => {
    if (chain.species.name === currentName.toLowerCase()) {
      return previous ? previous.species.url.split("/")[6] : null; // Extract ID from URL
    }
    for (let nextChain of chain.evolves_to) {
      const result = findPreviousEvolution(nextChain, currentName, chain);
      if (result) return result;
    }
    return null;
  };

  // Function to check the evolution availability of the Pokémon
  const checkEvolutionAvailability = async (pokemonData) => {
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${pokemonData.id}`
      );
      const data = await response.json();

      const evolutionChainUrl = data.evolution_chain.url;
      const evolutionResponse = await fetch(evolutionChainUrl);
      const evolutionData = await evolutionResponse.json();

      // Check if there's a next evolution
      const nextEvolutionId = findNextEvolution(
        evolutionData.chain,
        pokemonData.name
      );
      setCanEvolve(!!nextEvolutionId); // Set true if there is a next evolution, otherwise false

      // Check if there's a previous evolution
      const previousEvolutionId = findPreviousEvolution(
        evolutionData.chain,
        pokemonData.name
      );
      setCanDevolve(!!previousEvolutionId); // Set true if there is a previous evolution, otherwise false
    } catch (error) {
      console.error("Failed to check evolution availability:", error);
    }
  };

  // Handle adding the card to a custom deck
  const handleAddToDeck = (deckName) => {
    if (card && deckName) {
      dispatch(addCardToDeck(deckName, card));
    }
  };

  return (
    <div className="generate-single-card-container">
      <h2>Generate Single Pokémon Card</h2>
      <button className="button generate-button" onClick={generateSingleCard}>
        Generate Card
      </button>

      {card && (
        <div className="card-container">
          {/* Evolution buttons (up and down arrows) above the card */}
          <div className="evolution-buttons above-card">
            <button
              className="button evolve-button"
              onClick={evolvePokemon}
              disabled={!canEvolve}
            >
              ↑
            </button>
            <button
              className="button devolve-button"
              onClick={devolvePokemon}
              disabled={!canDevolve}
            >
              ↓
            </button>
          </div>

          <div className="card-preview">
            <PokemonCard pokemon={card} loading={false} />
          </div>

          <div className="add-to-deck-container">
            <h4>Add to Custom Deck:</h4>
            {customDecks.length > 0 ? (
              customDecks.map((deck) => {
                // Check for duplicates by unique Pokemon ID per deck
                const isDuplicate = deck.cards.some(
                  (existingCard) => existingCard.id === card.id
                );
                return (
                  <div key={deck.name} className="deck-item">
                    <button
                      className="button add-button"
                      onClick={() => handleAddToDeck(deck.name)}
                      disabled={isDuplicate}
                    >
                      {isDuplicate ? "Already in Deck" : `Add to ${deck.name}`}
                    </button>
                    <div className="mini-cards">
                      {deck.cards.length > 0 ? (
                        deck.cards.map((pokemon, index) => (
                          <img
                            key={index}
                            src={pokemon.image}
                            alt={pokemon.name}
                            className="mini-card"
                            title={pokemon.name}
                          />
                        ))
                      ) : (
                        <p className="empty-deck">Empty</p>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="no-decks-message">
                No custom decks available. Create one in the "View Custom Decks"
                section.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateSingleCard;
