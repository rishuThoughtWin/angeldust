import React from "react";
import {Redirect, Route} from "react-router-dom";

const PrivateRoute = ({ component: Component, rest, authenticated }) => {
  return (
    <Route
      render={(props) =>
        authenticated ? <Component {...props} /> : <Redirect to="/signin" />
      }
      {...rest}
    />
  );
};
export default PrivateRoute;
