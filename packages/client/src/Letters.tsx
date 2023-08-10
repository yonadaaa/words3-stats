import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { address, indexer, publicClient } from "./App";
import { LetterChartLive } from "./LetterChartLive";

export const Letters = () => {
  return (
    <div>
      <Link to="/">
        <h1>Words3 Stats</h1>
      </Link>
      <div style={{ display: "flex", justifyContent: "space-evenly" }}>
        <div>
          <h2>Letters vs times played</h2>
          <LetterChartLive />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h2>Most played letters</h2>
          <LettersCount />
        </div>
      </div>
    </div>
  );
};

const LettersCount = () => {
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
              <b>{letter}</b>: {count}
            </div>
          ))}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};
