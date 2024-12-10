// src/components/Deck.js

import React from "react";
import { SimpleGrid, Box, Heading, Text } from "@chakra-ui/react";
import PokemonCard from "./PokemonCard";

const Deck = ({ deck }) => {
  return (
    <Box mt={8} w="full" textAlign="center">
      <Heading mb={4}>Your Pokémon Deck</Heading>
      {deck.length === 0 ? (
        <Text>No Pokémon in the deck yet. Generate and add some!</Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {deck.map((pokemon, index) => (
            <PokemonCard key={index} pokemon={pokemon} />
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default Deck;
