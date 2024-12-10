import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { saveGeneratedDeck } from "../store/deckActions"; // Importing Redux action
import PokemonCard from "./PokemonCard";
import ripSound from "../assets/rip.mp3";
import whooshSound from "../assets/whoosh.mp3";
import "./UnboxDeck.css";

const UnboxDeck = () => {
  const dispatch = useDispatch();
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [deckType, setDeckType] = useState(""); // Added state for deck type
  const [currentIndex, setCurrentIndex] = useState(0); // Start from the center card
  const [revealedCards, setRevealedCards] = useState([]);
  const [newDeckName, setNewDeckName] = useState(""); // For saving custom deck

  // Rare Pokémon IDs
  const rarePokemonIds = [
    6, 9, 65, 94, 149, 130, 143, 144, 145, 146, 150, 151, 181, 248, 249, 250,
    251, 381, 382, 383, 384, 385, 386, 445, 448, 484, 485, 487, 488, 491, 493,
    612,
  ];

  // Fetch rare Pokémon details by ID
  const fetchPokemonDetails = async (id) => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await response.json();
    return {
      id: data.id,
      name: data.name,
      hp: data.stats.find((stat) => stat.stat.name === "hp").base_stat,
      types: data.types.map((type) => type.type.name).join(", "),
      height: data.height,
      weight: data.weight,
      attacks: data.moves.slice(0, 2).map((move) => move.move.name),
      image: data.sprites.other["official-artwork"].front_default,
    };
  };

  // Handle selecting a deck
  const handleSelectDeck = async (deckType) => {
    try {
      setDeckType(deckType); // Set the type of the selected deck

      // Select 3 unique rare Pokémon IDs
      const randomIds = [];
      while (randomIds.length < 3) {
        const randomId =
          rarePokemonIds[Math.floor(Math.random() * rarePokemonIds.length)];
        if (!randomIds.includes(randomId)) {
          randomIds.push(randomId);
        }
      }

      // Fetch Pokémon details
      const newDeck = await Promise.all(
        randomIds.map((id) => fetchPokemonDetails(id))
      );

      setSelectedDeck(newDeck);
      setCurrentIndex(0); // Start from the first card of the newly selected deck
      setRevealedCards([]);
      playAudio(ripSound);
    } catch (error) {
      console.error("Failed to fetch Pokémon for deck:", error);
    }
  };

  // Play audio function
  const playAudio = (audioFile) => {
    const audio = new Audio(audioFile);
    audio.play();
  };

  // Reveal the next card with sound effect, one by one
  useEffect(() => {
    if (selectedDeck && revealedCards.length < selectedDeck.length) {
      const timer = setTimeout(() => {
        playAudio(whooshSound);
        setRevealedCards((prevCards) => [
          ...prevCards,
          selectedDeck[revealedCards.length],
        ]);
      }, 1000); // Reveal each card after 1 second

      return () => clearTimeout(timer);
    }
  }, [selectedDeck, revealedCards]);

  // Handle left and right arrow clicks to navigate through the deck
  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + revealedCards.length) % revealedCards.length
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % revealedCards.length);
  };

  // Get visible deck for infinite scrolling effect
  const getVisibleDeck = () => {
    if (revealedCards.length === 0) return [];
    const visibleDeck = [];
    for (let i = -2; i <= 2; i++) {
      const index =
        (currentIndex + i + revealedCards.length) % revealedCards.length;
      visibleDeck.push(revealedCards[index]);
    }
    return visibleDeck;
  };

  // Handle saving the generated deck to Redux store
  const handleSaveDeck = () => {
    if (newDeckName.trim() === "") {
      alert("Please enter a deck name.");
      return;
    }
    // Dispatch an action to save the deck using Redux
    dispatch(saveGeneratedDeck(newDeckName.trim(), selectedDeck));
    setNewDeckName(""); // Clear the input after saving
  };

  return (
    <div className="unbox-deck-container">
      {!selectedDeck ? (
        <div className="deck-selection-container">
          <h2>Choose Your Deck to Unbox</h2>
          <div className="deck-options">
            <button
              className="deck-button green-emerald"
              onClick={() => handleSelectDeck("green-emerald")}
            >
              Green Emerald Deck
            </button>
            <button
              className="deck-button purple-emerald"
              onClick={() => handleSelectDeck("ruby-red")}
            >
              Purple Emerald Deck
            </button>
            <button
              className="deck-button diamond"
              onClick={() => handleSelectDeck("diamond")}
            >
              Diamond Deck
            </button>
          </div>
        </div>
      ) : (
        <>
          <h2>Unboxing Your Selected Deck</h2>
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
                    showEvolutionButtons={false}
                    deckType={deckType} // Pass the deck type as a prop
                  />
                </div>
              ))}
            </div>
            <button className="arrow right-arrow" onClick={handleNext}>
              ▶
            </button>
          </div>

          {/* Save Unboxed Deck Section */}
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

export default UnboxDeck;
