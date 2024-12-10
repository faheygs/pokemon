import React, { useState } from "react";
import "./DeckDetails.css";

const DeckDetails = ({ deck, onDeleteCard, onBack }) => {
  const [deckName, setDeckName] = useState(deck.name);

  // Handle deleting an individual card
  const handleDeleteCard = (cardIndex) => {
    onDeleteCard(cardIndex);
  };

  return (
    <div className="deck-details-container">
      <button className="back-button" onClick={onBack}>
        Back to Decks
      </button>
      <h2>{deckName}</h2>

      <div className="deck-cards">
        {deck.cards.length === 0 ? (
          <p>No cards in this deck.</p>
        ) : (
          deck.cards.map((card, index) => (
            <div key={index} className="card-detail">
              <img src={card.image} alt={card.name} />
              <p>{card.name}</p>
              <button
                className="delete-card-button"
                onClick={() => handleDeleteCard(index)}
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DeckDetails;
