import React, { useEffect, useState } from "react";
import "./PokemonCard.css";

const typeIcons = {
  fire: "🔥",
  water: "💧",
  grass: "🌿",
  electric: "⚡",
  psychic: "🔮",
  ice: "❄️",
  dragon: "🐉",
  dark: "🌑",
  fairy: "✨",
  normal: "⭐",
  fighting: "👊",
  flying: "🕊️",
  poison: "☠️",
  ground: "👊",
  rock: "🪨",
  bug: "🐛",
  ghost: "👻",
  steel: "⚙️",
};

const typeColors = {
  fire: "#F08030",
  water: "#6890F0",
  grass: "#78C850",
  electric: "#F8D030",
  psychic: "#F85888",
  ice: "#98D8D8",
  dragon: "#7038F8",
  dark: "#705848",
  fairy: "#EE99AC",
  normal: "#A8A878",
  fighting: "#C03028",
  flying: "#A890F0",
  poison: "#A040A0",
  ground: "#E0C068",
  rock: "#B8A038",
  bug: "#A8B820",
  ghost: "#705898",
  steel: "#B8B8D0",
};

// Function to get the type icon
const getTypeIcon = (types) => {
  const primaryType = types[0].toLowerCase();
  return typeIcons[primaryType] || "❓";
};

// Function to get the gradient background color based on the Pokémon type
const getGradientBackground = (types) => {
  const primaryType = types[0].toLowerCase();
  const color = typeColors[primaryType] || "#F8F8F8";
  return `linear-gradient(135deg, ${color} 20%, #ffffff 100%)`;
};

const PokemonCard = ({ pokemon, loading, deckType }) => {
  const [currentPokemon, setCurrentPokemon] = useState(pokemon);
  const [flavorText, setFlavorText] = useState("Fetching lore...");

  useEffect(() => {
    if (pokemon) {
      setCurrentPokemon(pokemon);
    }
  }, [pokemon]);

  useEffect(() => {
    const fetchFlavorText = async () => {
      if (currentPokemon && currentPokemon.name) {
        const apiUrl = `https://pokeapi.co/api/v2/pokemon-species/${currentPokemon.name.toLowerCase()}`;

        try {
          const response = await fetch(apiUrl);

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();

          const englishEntries = data.flavor_text_entries.filter(
            (entry) => entry.language.name === "en"
          );

          if (englishEntries.length > 0) {
            const randomEntry = englishEntries[
              Math.floor(Math.random() * englishEntries.length)
            ].flavor_text.replace(/\n|\f/g, " ");

            // Limit flavor text to a maximum of 2 sentences
            const sentences = randomEntry.split(/(?<=\.)\s+/);
            const limitedFlavorText = sentences.slice(0, 2).join(" ");

            setFlavorText(limitedFlavorText);
          } else {
            setFlavorText("No available lore for this Pokémon.");
          }
        } catch (error) {
          console.error("Error fetching Pokémon species data:", error);
          setFlavorText("Failed to fetch lore. Please try again.");
        }
      }
    };

    fetchFlavorText();
  }, [currentPokemon]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentPokemon) {
    return <div>Click Generate!</div>;
  }

  return (
    <div className="pokemon-card-container">
      {/* Card Section */}
      <div
        className={`pokemon-card-classic ${deckType ? deckType : ""}`}
        style={{
          background: deckType
            ? "" // Remove inline background if a deckType is provided
            : getGradientBackground(currentPokemon.types.split(", ")),
        }}
      >
        {/* Card Header, Image, Info, etc */}
        <div className="card-header">
          <div className="pokemon-name">{currentPokemon.name}</div>
          <div className="pokemon-hp-section">
            <span className="pokemon-hp">{currentPokemon.hp} HP</span>
            <span className="pokemon-type-icon">
              {getTypeIcon(currentPokemon.types.split(", "))}
            </span>
          </div>
        </div>
        <div className="image-container">
          <img src={currentPokemon.image} alt={currentPokemon.name} />
        </div>
        <div className="info-banner">
          <div className="info-text">
            Type: {currentPokemon.types.split(", ")[0]} | Height:{" "}
            {currentPokemon.height / 10} m | Weight:{" "}
            {currentPokemon.weight / 10} kg
          </div>
        </div>
        <div className="moves-footer-flavor-section">
          {currentPokemon.attacks.slice(0, 2).map((attack, index) => (
            <div key={index} className="move">
              <div className="move-header">
                <span className="move-name">{attack}</span>
                <span className="move-damage">
                  {Math.floor(Math.random() * 40) + 10}
                </span>
                <span className="energy-symbol">
                  {getTypeIcon(currentPokemon.types.split(", "))}
                </span>
              </div>
              <div className="move-description">
                - Flip a coin. If heads, this attack does additional damage.
              </div>
              {index < 1 && <hr className="move-divider" />}
            </div>
          ))}
          <hr className="move-footer-divider" />
          <div className="footer-stats">
            <div className="footer-item">
              <strong>Weakness:</strong>
              <span>⚡</span>
            </div>
            <div className="footer-item">
              <strong>Resistance:</strong>
              <span>🛡️</span>
            </div>
            <div className="footer-item">
              <strong>Retreat Cost:</strong>
              <span>⚪</span>
            </div>
          </div>
          <div className="flavor-text gold-border">{flavorText}</div>
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;
