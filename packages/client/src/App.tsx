import { latticeTestnet } from "@latticexyz/common/chains";
import {
  TableWithRecords,
  createIndexerClient,
} from "@latticexyz/store-sync/trpc-indexer";
import { useEffect, useState } from "react";
import { createPublicClient, fallback, http, webSocket } from "viem";

const address = "0x69ccD9B6A62e16E21230C5cB1fADD3509DB10d45";

const publicClient = createPublicClient({
  chain: latticeTestnet,
  transport: fallback([webSocket(), http()]),
});

const indexer = createIndexerClient({
  url: "https://indexer.base-mainnet-mud-services.linfra.xyz",
});

const style = { borderStyle: "solid", borderCollapse: "collapse" };

export const App = () => {
  const [result, setResult] = useState<{
    blockNumber: bigint | null;
    tables: TableWithRecords[];
  }>();

  useEffect(() => {
    indexer.findAll
      .query({
        chainId: publicClient.chain.id,
        address: address,
      })
      .then(setResult);
  }, []);

  console.log(result);

  return (
    <>
      <div>
        <h1>Tables:</h1>
        <span>
          {result &&
            result.tables.map((table) => (
              <div key={table.tableId}>
                <div>
                  <h2>{table.name}</h2>
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
              </div>
            ))}
        </span>
      </div>
    </>
  );
};
