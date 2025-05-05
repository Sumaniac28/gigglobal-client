import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'src/index.scss';
import App from 'src/App.tsx';
import { Persistor } from 'redux-persist';
import persistStore from 'redux-persist/es/persistStore';
import { store } from 'src/store/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

const persistor: Persistor = persistStore(store);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>
);
