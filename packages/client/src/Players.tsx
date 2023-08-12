import { useEffect, useState } from "react";
import { Cell, Pie, PieChart } from "recharts";
import { Link } from "react-router-dom";
import { address, indexer, publicClient } from "./Tables";
import { formatEther } from "viem";

interface Data {
  address: string;
  value: number;
}

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

// from https://stackoverflow.com/questions/3426404/create-a-hexadecimal-colour-based-on-a-string-with-javascript
const stringToColour = (str: string) => {
  let hash = 0;
  str.split("").forEach((char) => {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  });
  let colour = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    colour += value.toString(16).padStart(2, "0");
  }
  return colour;
};

export const Players = () => {
  const [data, setData] = useState<Data[]>();
  const [jackpot, setJackpoint] = useState<bigint>();

  useEffect(() => {
    indexer.findAll
      .query({
        chainId: publicClient.chain.id,
        address: address,
      })
      .then((result) => {
        const points = result.tables.find((table) => table.name === "Points");
        const treasury = result.tables.find(
          (table) => table.name === "Treasury"
        );

        if (treasury) {
          const j = treasury.records[0].value.value;
          setJackpoint(j);

          if (points) {
            const total = points.records
              .map((record) => record.value.value as number)
              .reduce((partialSum, a) => partialSum + a, 0);

            const d = points.records
              .map((record) => ({
                address: record.key[0] as string,
                value: record.value.value as number,
                fraction: record.value.value / total,
                payout: (Number(j) * record.value.value) / total,
              }))
              .filter(
                (record) =>
                  // filter out the zero address as it stores half the sum of all points?
                  record.address !== ZERO_ADDRESS
              );
            d.sort((a, b) => b.value - a.value);

            setData(d);
          }
        }
      });
  }, []);

  return (
    <div>
      <Link to="/">
        <h1>Words3 Stats</h1>
      </Link>
      {jackpot && <div>Jackpot: {formatEther(jackpot)} ETH</div>}
      <div>Key: address - points - predicted payout</div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {data ? <PlayersChart data={data} /> : <div>loading...</div>}
      </div>
    </div>
  );
};

const PlayersChart = ({ data }: { data: Data[] }) => {
  return (
    <PieChart width={1000} height={600}>
      <Pie
        data={data}
        dataKey="value"
        nameKey="address"
        fill="#8884d8"
        label={(datum) =>
          `${datum.address.slice(0, 6)}...${datum.address.slice(-2)} - ${
            datum.value
          } - ${Math.round(datum.payout / 10000000000000000) / 100} ETH`
        }
      >
        {data.map((entry) => (
          <Cell key={entry.address} fill={stringToColour(entry.address)} />
        ))}
      </Pie>
    </PieChart>
  );
};
