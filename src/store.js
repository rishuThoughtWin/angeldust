import {createStore} from "redux";
import {persistReducer, persistStore} from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web and AsyncStorage for react-native
import rootReducer from "./reducers";

const persistConfig = {
  key: "flokin",
  storage,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

export default function configureStore(initialState) {
  const store = createStore(persistedReducer, initialState);
  let persistor = persistStore(store);

  return { store, persistor };
}
