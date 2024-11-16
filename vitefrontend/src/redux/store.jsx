import { combineReducers, configureStore } from '@reduxjs/toolkit'
import postReducer from "./postSlice"
import {
  persistReducer,
  persistStore
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
}
const rootReducer = combineReducers({
  post: postReducer,
})
const persistedReducer = persistReducer(persistConfig, rootReducer)
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }),
})
export const persistor = persistStore(store)