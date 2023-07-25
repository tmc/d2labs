import {
  createBrowserRouter,
} from "react-router-dom";

import App from './App';
import GraphQLSandbox from './GraphQLSandbox'

import Playground from './Playground'

import ErrorPage from "./ErrorPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Playground />
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "sandbox",
    element: <GraphQLSandbox />
  },
  {
    path: "playground",
    element: <Playground />
  },
  {
    path: "app",
    element: <App />
  },
]);


