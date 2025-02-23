import './index.css';

import MuiProvider from './providers/MuiProvider';
import Router from './providers/RouterProvider';
import TanstackQueryProvider from './providers/TanstackQueryProvider';

const App = () => {
  return (
    <TanstackQueryProvider>
      <MuiProvider>
        <Router />
      </MuiProvider>
    </TanstackQueryProvider>
  );
};

export default App;
