import React, { useState } from "react";
import "./CustomDecks.css";
import PokemonCard from "./PokemonCard";

const CustomDecks = ({
  customDecks,
  createNewDeck,
  onUpdateDeckName,
  onDeleteDeck,
  onDeleteCardFromDeck,
}) => {
  const [editingDeckIndex, setEditingDeckIndex] = useState(null);
  const [editedDeckName, setEditedDeckName] = useState("");
  const [expandedDeckIndex, setExpandedDeckIndex] = useState(null);
  const [newDeckName, setNewDeckName] = useState("");

  // Handle deck expansion/collapse
  const toggleDeckExpansion = (deckIndex) => {
    setExpandedDeckIndex((prevIndex) =>
      prevIndex === deckIndex ? null : deckIndex
    );
  };

  // Handle starting the deck name edit process
  const handleEditDeckName = (deckIndex) => {
    setEditingDeckIndex(deckIndex);
    setEditedDeckName(customDecks[deckIndex].name);
  };

  // Handle saving the edited deck name
  const handleSaveDeckName = (deckIndex) => {
    if (editedDeckName.trim() === "") {
      alert("Please enter a valid deck name.");
      return;
    }

    // Check if the new deck name already exists (ignoring the current deck name)
    const duplicateDeck = customDecks.some(
      (deck, index) =>
        deck.name.toLowerCase() === editedDeckName.trim().toLowerCase() &&
        index !== deckIndex
    );

    if (duplicateDeck) {
      alert(
        "A deck with this name already exists. Please enter a unique name."
      );
      return;
    }

    onUpdateDeckName(deckIndex, editedDeckName);
    setEditingDeckIndex(null); // Exit editing mode
    setEditedDeckName(""); // Clear input field
  };

  // Handle creating a new deck
  const handleCreateDeck = () => {
    if (
      newDeckName.trim() === "" ||
      customDecks.some(
        (deck) => deck.name.toLowerCase() === newDeckName.trim().toLowerCase()
      )
    ) {
      alert("Deck name must be unique and non-empty!");
      return;
    }
    createNewDeck(newDeckName);
    setNewDeckName(""); // Clear the input field after creating the deck
  };

  // Handle horizontal scroll using button click with smooth animation
  const handleScroll = (deckIndex, direction) => {
    const deckContainer = document.getElementById(`deck-${deckIndex}`);
    if (!deckContainer) return;

    const scrollAmount = 300; // Number of pixels to scroll
    const newScrollLeft =
      direction === "left"
        ? deckContainer.scrollLeft - scrollAmount
        : deckContainer.scrollLeft + scrollAmount;

    deckContainer.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });
  };

  return (
    <div className="custom-decks-container">
      <h2>My Custom Decks</h2>

      {/* Create New Deck Section */}
      <div className="create-deck">
        <input
          type="text"
          value={newDeckName}
          onChange={(e) => setNewDeckName(e.target.value)}
          placeholder="Enter new deck name"
          className="deck-input"
        />
        <button className="button create-button" onClick={handleCreateDeck}>
          Create Deck
        </button>
      </div>

      {/* Display Existing Decks */}
      {customDecks.length > 0 ? (
        customDecks.map((deck, deckIndex) => (
          <div key={deck.name} className="deck-card">
            <div className="deck-header">
              {editingDeckIndex === deckIndex ? (
                <>
                  <input
                    type="text"
                    value={editedDeckName}
                    onChange={(e) => setEditedDeckName(e.target.value)}
                    placeholder="Edit deck name"
                    className="edit-deck-name-input"
                  />
                  <button
                    className="button save-button"
                    onClick={() => handleSaveDeckName(deckIndex)}
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <h3>{deck.name}</h3>
                  <span className="deck-count">{deck.cards.length} cards</span>
                  <button
                    className="button edit-button"
                    onClick={() => handleEditDeckName(deckIndex)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="button delete-button"
                    onClick={() => onDeleteDeck(deckIndex)}
                  >
                    🗑️ Delete
                  </button>
                  <button
                    className="button expand-button"
                    onClick={() => toggleDeckExpansion(deckIndex)}
                  >
                    {expandedDeckIndex === deckIndex ? "Collapse" : "Expand"}
                  </button>
                </>
              )}
            </div>

            {/* Deck Details if Expanded */}
            {expandedDeckIndex === deckIndex && (
              <div className="deck-details">
                {deck.cards.length > 0 ? (
                  <div className="pokemon-cards-scroll-container">
                    <button
                      className="scroll-button left-scroll-button"
                      onClick={() => handleScroll(deckIndex, "left")}
                    >
                      ◀
                    </button>
                    <div
                      className="pokemon-cards-scroll-wrapper"
                      id={`deck-${deckIndex}`}
                    >
                      <div className="pokemon-cards-container">
                        {deck.cards.map((pokemon, cardIndex) => (
                          <div key={cardIndex} className="mini-pokemon-card">
                            <PokemonCard pokemon={pokemon} loading={false} />
                            <div className="delete-card-button-container">
                              <button
                                className="button delete-pokemon-button"
                                onClick={() =>
                                  onDeleteCardFromDeck(deckIndex, cardIndex)
                                }
                              >
                                🗑️ Remove Card
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button
                      className="scroll-button right-scroll-button"
                      onClick={() => handleScroll(deckIndex, "right")}
                    >
                      ▶
                    </button>
                  </div>
                ) : (
                  <p>This deck has no Pokémon cards yet.</p>
                )}
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No custom decks created yet. Create one and add Pokémon cards!</p>
      )}
    </div>
  );
};

export default CustomDecks;
