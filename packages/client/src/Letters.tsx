import { useEffect, useState } from "react";
import { address, indexer, publicClient } from "./Tables";
import { Link } from "react-router-dom";
import { Data, LetterChart } from "./LetterChart";
import { POINTS } from "./points";

export const Letters = () => {
  const [data, setData] = useState<Data[][]>();

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
          const d0 = letterCount.records.map((record) => ({
            letter: String.fromCharCode(64 + (record.key[0] as number)),
            y: record.value.value as number,
          }));
          const d1 = [...d0];
          const d2 = letterCount.records.map((record) => {
            const letter = String.fromCharCode(64 + (record.key[0] as number));
            return {
              letter,
              y: POINTS[letter],
            };
          });
          const d3 = letterCount.records.map((record) => {
            const letter = String.fromCharCode(64 + (record.key[0] as number));
            const count = record.value.value as number;
            return {
              letter,
              y: POINTS[letter] * count,
            };
          });
          const d4 = letterCount.records.map((record) => {
            const letter = String.fromCharCode(64 + (record.key[0] as number));
            const count = record.value.value as number;
            return {
              letter,
              y: count / POINTS[letter],
            };
          });

          d1.sort((a, b) => b.y - a.y);
          d2.sort((a, b) => b.y - a.y);
          d3.sort((a, b) => b.y - a.y);
          d4.sort((a, b) => b.y - a.y);

          setData([d0, d1, d2, d3, d4]);
        }
      });
  }, []);

  return (
    <div>
      <Link to="/">
        <h1>Words3 Stats</h1>
      </Link>
      {data ? (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-around",
          }}
        >
          <div style={{ borderStyle: "dotted", padding: 16 }}>
            <h2>Most commonly played letters</h2>
            <LetterChart data={data[1]} />
          </div>
          <div style={{ borderStyle: "dotted", padding: 16 }}>
            <h2>Points given per letter</h2>
            <LetterChart data={data[2]} />
          </div>
          <div style={{ borderStyle: "dotted", padding: 16 }}>
            <h2>
              Points given <i>divided</i> by times played
            </h2>
            <LetterChart data={data[4]} />
          </div>
          <div style={{ borderStyle: "dotted", padding: 16 }}>
            <h2>
              Points given <i>multiplied</i> by times played
            </h2>
            <LetterChart data={data[3]} />
          </div>
        </div>
      ) : (
        <div>loading...</div>
      )}
    </div>
  );
};
