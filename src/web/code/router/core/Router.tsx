import * as React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import IndexRoute from './IndexRoute';
import { routes } from './routes';

const router = createBrowserRouter([
  {
    path: '/',
    element: <IndexRoute />,
  },
  ...routes,
]);

export default function Router() {
  return (<RouterProvider router={router} />);
}
