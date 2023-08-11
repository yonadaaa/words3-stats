import { BarChart, Bar, XAxis, YAxis } from "recharts";

export type Data = { letter: string; y: number };

export const LetterChart = ({ data }: { data: Data[] }) => {
  return (
    <div>
      <BarChart width={600} height={600} data={data}>
        <XAxis dataKey={"letter"} />
        <YAxis />
        <Bar dataKey="y" fill="#8884d8" />
      </BarChart>
    </div>
  );
};
