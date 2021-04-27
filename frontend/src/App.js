import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Seacrh from "./Search/pages/home";

import ListLibraries from './Search/pages/ListLibraries';
import MainNavigation from './shared/Navigation/MainNavigation';
import Libraies from './Search/pages/Libraries';
import { AuthContext } from './shared/auth-context';
import ListBooks from './Search/pages/ListBooks';

const App = () => {

  const [lattitude, setLattitude] = useState();
  const [longitude, setLongitude] = useState();

  const setLat = useCallback(lat => {
    setLattitude(lat);
  }, []);

  const setLng = useCallback(lng => {
    setLongitude(lng);
  }, []);
  return (
    <AuthContext.Provider
      value={{
        lattitude: lattitude,
        longitude: longitude,
        setLat: setLat,
        setLng: setLng
      }}
    >
      <Router>
        <MainNavigation />
        <Switch>
          <Route path="/" exact>
            <Seacrh />
          </Route>
          <Route path="/books/:id" exact>
            <ListLibraries />
          </Route>
          <Route path="/libraries" exact>
            <Libraies />
          </Route>

          <Route path="/:lid/books" exact>
            <ListBooks />
          </Route>
          <Redirect to="/" />
        </Switch>
      </Router>
    </AuthContext.Provider>

  );
}

export default App;
