import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { address, indexer, publicClient } from "./Tables";

export const Plays = () => {
  const [plays, setPlays] = useState();

  useEffect(() => {
    indexer.findAll
      .query({
        chainId: publicClient.chain.id,
        address: address,
      })
      .then((result) => {
        const playResult = result.tables.find(
          (table) => table.name === "PlayResult"
        );
        const pointResult = result.tables.find(
          (table) => table.name === "PointsResult"
        );

        if (playResult && pointResult) {
          const combinedRecords = playResult.records.map((record) => {
            return {
              ...record,
              points: pointResult.records.find(
                (r) => r.key[0] === record.key[0]
              ).value.points,
            };
          });

          combinedRecords.sort((a, b) => b.points - a.points);
          setPlays(combinedRecords);
        }
      });
  }, []);

  return (
    <div>
      <Link to="/">
        <h1>Words3 Stats</h1>
      </Link>
      <h2>Best plays</h2>
      {plays ? (
        <div>
          {plays.map((play) => (
            <div>
              {play.value.player.slice(0, 6) +
                "..." +
                play.value.player.slice(-4)}{" "}
              played{" "}
              {play.value["filledWord"].map((letter) =>
                String.fromCharCode(64 + letter)
              )}{" "}
              on{" "}
              {play.value["word"].map((letter) =>
                String.fromCharCode(64 + letter)
              )}{" "}
              for {play.points} points
            </div>
          ))}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};
