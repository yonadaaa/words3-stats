import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Legend } from "recharts";
import { address, indexer, publicClient } from "./App";

type Data = { letter: string; count: number };

export const LetterChartLive = () => {
  const [data, setLetterCounts] = useState<Data[]>();

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

  return <div>{data && <LetterChart data={data} />}</div>;
};

const LetterChart = ({ data }: { data: Data[] }) => {
  return (
    <div>
      <BarChart width={600} height={600} data={data}>
        <XAxis dataKey="letter" />
        <YAxis />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </div>
  );
};
