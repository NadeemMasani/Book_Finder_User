import { createContext } from 'react';

export const AuthContext = createContext({
  lattitude: null,
  longitude: null,
  setLat: () => { },
  setLng: () => { }
});
