import ReactDOM from "react-dom/client";
import { createBrowserRouter, Link, RouterProvider } from "react-router-dom";
import { App } from "./App";
import { Letters } from "./Letters";

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
        <div style={{ padding: 4 }}>
          <Link to="about">MUD Tables</Link>
        </div>
        <div style={{ padding: 4 }}>
          <Link to="letters">Most played letters</Link>
        </div>
      </div>
    ),
  },
  {
    path: "about",
    element: <App />,
  },
  {
    path: "letters",
    element: <Letters />,
  },
]);

root.render(<RouterProvider router={router} />);
