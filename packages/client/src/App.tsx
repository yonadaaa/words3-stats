import { latticeTestnet } from "@latticexyz/common/chains";
import {
  TableWithRecords,
  createIndexerClient,
} from "@latticexyz/store-sync/trpc-indexer";
import { useEffect, useState } from "react";
import { createPublicClient, fallback, http, webSocket } from "viem";
import { Link } from "react-router-dom";

export const address = "0x69ccD9B6A62e16E21230C5cB1fADD3509DB10d45";

export const publicClient = createPublicClient({
  chain: latticeTestnet,
  transport: fallback([webSocket(), http()]),
});

export const indexer = createIndexerClient({
  url: "https://indexer.base-mainnet-mud-services.linfra.xyz",
});

const style = { borderStyle: "solid", borderCollapse: "collapse" };

const MUDTable = ({ table }: { table: TableWithRecords }) => {
  return (
    <div>
      <h3>{table.name}</h3>
      <table style={style}>
        <thead>
          <tr style={style}>
            {Object.keys(table.keySchema).map((s) => (
              <th key={s} style={style}>
                Key #{s}
              </th>
            ))}
            {Object.keys(table.valueSchema).map((s) => (
              <th key={s} style={style}>
                {s}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.records.map((record, i) => {
            return (
              <tr key={i} style={style}>
                {Object.values(record.key).map((value, j) => (
                  <td key={j} style={style}>
                    {value.toString()}
                  </td>
                ))}
                {Object.values(record.value).map((value, j) => (
                  <td key={j} style={style}>
                    {value.toString()}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export const App = () => {
  const [selected, setSelected] = useState<string>();
  const [result, setResult] = useState<{
    blockNumber: bigint | null;
    tables: TableWithRecords[];
  }>();
  const [names, setNames] = useState<string[]>([]);

  useEffect(() => {
    indexer.findAll
      .query({
        chainId: publicClient.chain.id,
        address: address,
      })
      .then((r) => {
        setResult(r);
        setNames(r.tables.map((table) => table.name));
      });
  }, []);

  return (
    <div>
      <Link to="/">
        <h1>Words3 Stats</h1>
      </Link>
      <h2>MUD Tables</h2>
      {result ? (
        <div>
          <span>Select a table: </span>
          <select onChange={(event) => setSelected(event.target.value)}>
            {names.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div>Loading...</div>
      )}
      {result && result.tables.some((table) => table.name === selected) && (
        <MUDTable
          table={result.tables.find((table) => table.name === selected)}
        />
      )}
    </div>
  );
};
