import ReactDOM from "react-dom/client";
import { createBrowserRouter, Link, RouterProvider } from "react-router-dom";
import { Tables } from "./Tables";
import { Letters } from "./Letters";
import { Plays } from "./Plays";
import { Players } from "./Players";

const rootElement = document.getElementById("react-root");
if (!rootElement) throw new Error("React root not found");
const root = ReactDOM.createRoot(rootElement);

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div>
        <Link to="/">
          <h1>Words3 Stats</h1>
        </Link>
        <div>
          <Link to="letters">Most played letters</Link>
        </div>
        <div>
          <Link to="plays">Best plays</Link>
        </div>
        <div>
          <Link to="players">Point distribution</Link>
        </div>
        <div>
          <Link to="about">MUD Tables</Link>
        </div>
      </div>
    ),
  },
  {
    path: "about",
    element: <Tables />,
  },
  {
    path: "letters",
    element: <Letters />,
  },
  {
    path: "plays",
    element: <Plays />,
  },
  {
    path: "players",
    element: <Players />,
  },
]);

root.render(<RouterProvider router={router} />);
