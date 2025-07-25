import * as React from 'react';

export const pingRoute = {
  path: '/ping',
  element: <PingPage />,
  navLabel: 'Ping',
};

function PingPage() {
  return (<div>Pong</div>);
}
