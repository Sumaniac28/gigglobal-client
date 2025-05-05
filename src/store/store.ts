// import { combineReducers, configureStore, Reducer } from '@reduxjs/toolkit';
// import storage from 'redux-persist/lib/storage';
// import { FLUSH, PAUSE, PERSIST, persistReducer, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
// import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
// import { api } from 'src/store/api';
// import { authReducer } from 'src/features/auth/reducers/auth.reducer';

// const persistConfig = {
//   key: 'root',
//   storage: storage,
//   blacklist: ['clientApi', '_persist']
// };

// export const combineReducer = combineReducers({
//   [api.reducerPath]: api.reducer,
//   authUser: authReducer
// });

// export const rootReducers: Reducer = (state, action) => {
//   // this is to reset the state to default when user logs out
//   if (action.type === 'logout/logout') {
//     state = {} ;
//   }
//   return combineReducer(state, action);
// };

// const persistedReducer = persistReducer(persistConfig, rootReducers);

// export const store = configureStore({
//   devTools: true, // enable Redux DevTools Extension later set env variable
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
//       }
//     }).concat(api.middleware)
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

// export const useAppDispatch = () => useDispatch<AppDispatch>();
// export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

import { configureStore, combineReducers, Reducer, AnyAction } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import { api } from 'src/store/api';
import { authReducer } from 'src/features/auth/reducers/auth.reducer';
import { logoutReducer } from 'src/features/auth/reducers/logout.reducer';

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['clientApi', '_persist'] 
};


const combinedReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  authUser: authReducer,
  logout: logoutReducer
});


const rootReducer: Reducer<ReturnType<typeof combinedReducer>, AnyAction> = (state, action) => {
  if (action.type === 'logout/logout') {
    // Reset to initial state by setting undefined
    state = undefined;
  }
  return combinedReducer(state, action);
};


const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    }).concat(api.middleware)
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
