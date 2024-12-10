import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { saveGeneratedDeck } from "../store/deckActions"; // Importing saveGeneratedDeck action
import PokemonCard from "./PokemonCard";
import "./GenerateDeck.css";

const GenerateDeck = () => {
  const dispatch = useDispatch();
  const [deck, setDeck] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [newDeckName, setNewDeckName] = useState("");

  // Function to fetch a new deck of random Pokémon cards
  const fetchRandomDeck = async () => {
    try {
      const newDeck = [];
      for (let i = 0; i < 5; i++) {
        const randomId = Math.floor(Math.random() * 898) + 1;
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${randomId}`
        );
        const data = await response.json();
        newDeck.push({
          id: data.id,
          name: data.name,
          hp: data.stats.find((stat) => stat.stat.name === "hp").base_stat,
          types: data.types.map((type) => type.type.name).join(", "),
          height: data.height,
          weight: data.weight,
          attacks: data.moves.slice(0, 2).map((move) => move.move.name),
          image: data.sprites.other["official-artwork"].front_default,
        });
      }
      setDeck(newDeck);
      setCurrentIndex(0); // Reset the current index to the beginning of the new deck
    } catch (error) {
      console.error("Failed to fetch Pokémon deck:", error);
    }
  };

  // Function to handle updating the deck after evolving or devolving a card
  const updateDeck = (index, updatedPokemon) => {
    setDeck((prevDeck) => {
      const newDeck = [...prevDeck];
      newDeck[index] = updatedPokemon; // Update the Pokémon at the specified index
      return newDeck;
    });
  };

  // Handle left and right arrow clicks to navigate through the deck
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + deck.length) % deck.length);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % deck.length);
  };

  // Generate the visible deck for infinite looping
  const getVisibleDeck = () => {
    if (deck.length === 0) return [];
    const visibleDeck = [];
    for (let i = -2; i <= 2; i++) {
      const index = (currentIndex + i + deck.length) % deck.length;
      visibleDeck.push(deck[index]);
    }
    return visibleDeck;
  };

  // Handle saving the generated deck
  const handleSaveDeck = () => {
    if (newDeckName.trim() === "") {
      alert("Please enter a deck name.");
      return;
    }
    // Dispatching action to save the deck using Redux
    dispatch(saveGeneratedDeck(newDeckName.trim(), deck));
    setNewDeckName(""); // Clear the input after saving
  };

  return (
    <div className="generate-deck-container">
      <h1>Pokémon Card Deck Generator</h1>
      <div className="controls-container">
        <button className="button" onClick={fetchRandomDeck}>
          Generate Random Deck
        </button>
      </div>

      {deck.length > 0 && (
        <>
          <div className="deck-slider-container">
            <button className="arrow left-arrow" onClick={handlePrev}>
              ◀
            </button>
            <div className="deck-slider">
              {getVisibleDeck().map((pokemon, index) => (
                <div
                  key={index}
                  className={`card-slide ${
                    index === 2 ? "active" : "inactive"
                  }`}
                >
                  <PokemonCard
                    pokemon={pokemon}
                    loading={false}
                    updateDeck={updateDeck}
                    index={
                      (currentIndex + index - 2 + deck.length) % deck.length
                    } // Calculating the correct index in the deck
                    showEvolutionButtons={true}
                  />
                </div>
              ))}
            </div>
            <button className="arrow right-arrow" onClick={handleNext}>
              ▶
            </button>
          </div>

          {/* Save Generated Deck Section */}
          <div className="save-deck-container">
            <input
              type="text"
              value={newDeckName}
              onChange={(e) => setNewDeckName(e.target.value)}
              placeholder="Enter deck name"
              className="deck-name-input"
            />
            <button className="button save-button" onClick={handleSaveDeck}>
              Save Deck as Custom Deck
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default GenerateDeck;
