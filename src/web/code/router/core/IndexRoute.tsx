import * as React from 'react';
import { routes } from './routes';

export default function IndexRoute() {
  return (
    <div>
      Index
      <ul>
        {routes.map(r => (
          <li key={r.path}><a href={r.path}>{r.navLabel}</a></li>
        ))}
      </ul>
    </div>
  );
}
