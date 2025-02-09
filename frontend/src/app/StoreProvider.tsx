'use client';
import { Provider } from 'react-redux';
import React, { ReactNode } from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../lib/store/store';

const StoreProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};

export default StoreProvider;
