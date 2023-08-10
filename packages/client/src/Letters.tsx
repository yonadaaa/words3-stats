import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { address, indexer, publicClient } from "./App";

export const Letters = () => {
  return (
    <div>
      <Link to="/">
        <h1>Words3 Stats</h1>
      </Link>
      <h2>Most played letters</h2>
      <h3>In alphabetical order</h3>
      <LettersAlphabetical />
      <h3>In order of count</h3>
      <LettersCount />
    </div>
  );
};

export const LettersAlphabetical = () => {
  const [letterCounts, setLetterCounts] =
    useState<{ letter: string; count: number }[]>();

  useEffect(() => {
    indexer.findAll
      .query({
        chainId: publicClient.chain.id,
        address: address,
      })
      .then((result) => {
        const letterCount = result.tables.find(
          (table) => table.name === "LetterCount"
        );

        if (letterCount) {
          const counts = letterCount.records.map((record) => ({
            letter: String.fromCharCode(64 + (record.key[0] as number)),
            count: record.value.value as number,
          }));

          counts.sort((a, b) =>
            a.letter < b.letter ? -1 : a.letter > b.letter ? 1 : 0
          );

          setLetterCounts(counts);
        }
      });
  }, []);

  return (
    <div>
      {letterCounts ? (
        <div>
          {letterCounts.map(({ letter, count }) => (
            <div key={letter}>
              {letter}: {count}
            </div>
          ))}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export const LettersCount = () => {
  const [letterCounts, setLetterCounts] =
    useState<{ letter: string; count: number }[]>();

  useEffect(() => {
    indexer.findAll
      .query({
        chainId: publicClient.chain.id,
        address: address,
      })
      .then((result) => {
        const letterCount = result.tables.find(
          (table) => table.name === "LetterCount"
        );

        if (letterCount) {
          const counts = letterCount.records.map((record) => ({
            letter: String.fromCharCode(64 + (record.key[0] as number)),
            count: record.value.value as number,
          }));

          counts.sort((a, b) => b.count - a.count);

          setLetterCounts(counts);
        }
      });
  }, []);

  return (
    <div>
      {letterCounts ? (
        <div>
          {letterCounts.map(({ letter, count }) => (
            <div key={letter}>
              {letter}: {count}
            </div>
          ))}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};
