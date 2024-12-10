import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import GenerateDeck from "./components/GenerateDeck";
import GenerateSingleCard from "./components/GenerateSingleCard";
import CustomDecks from "./components/CustomDecks";
import UnboxDeck from "./components/UnboxDeck"; // Import UnboxDeck component
import {
  addDeck,
  deleteDeck,
  updateDeckName,
  deleteCardFromDeck,
} from "./store/deckActions";
import { useSelector, useDispatch } from "react-redux";

const App = () => {
  const dispatch = useDispatch();
  const customDecks = useSelector((state) => state.decks.customDecks); // Access customDecks from Redux

  const [expandedDeckIndex, setExpandedDeckIndex] = useState(null);

  // Function to handle creating a new deck
  const createNewDeck = (deckName) => {
    dispatch(addDeck(deckName));
  };

  return (
    <Router>
      <div className="app-container">
        {/* Sidebar for navigation */}
        <div className="sidebar">
          <h2>Menu</h2>
          <nav>
            <ul>
              <li>
                <Link to="/generate-single-card">Generate Single Card</Link>
              </li>
              <li>
                <Link to="/generate-deck">Generate Deck</Link>
              </li>
              <li>
                <Link to="/unbox-deck">Unbox a Pack</Link>
              </li>
              <li>
                <Link to="/custom-decks">View Custom Decks</Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main content area */}
        <div className="main-content">
          <Routes>
            <Route
              path="/generate-single-card"
              element={<GenerateSingleCard />}
            />
            <Route path="/generate-deck" element={<GenerateDeck />} />
            <Route path="/unbox-deck" element={<UnboxDeck />} />
            <Route
              path="/custom-decks"
              element={
                <CustomDecks
                  customDecks={customDecks}
                  createNewDeck={createNewDeck}
                  onUpdateDeckName={(deckIndex, newName) =>
                    dispatch(updateDeckName(deckIndex, newName))
                  }
                  onDeleteDeck={(deckIndex) => dispatch(deleteDeck(deckIndex))}
                  onDeleteCardFromDeck={(deckIndex, cardIndex) =>
                    dispatch(deleteCardFromDeck(deckIndex, cardIndex))
                  }
                />
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
