import React from 'react';
import {Redirect, Route} from 'react-router-dom';

export const PrivateRouteOwner = ({ component: Component, owneruser,user, ...props }) => {

  return (
    <>
      {owneruser ? <Route {...props} component={Component} /> :<Redirect to='/' />}
    </>
  );
}

export const PrivateRoute = ({ component: Component, user, ...props }) => {
  return (
    <>
      {user ? <Route {...props} component={Component} /> :null}
    </>
  );
}