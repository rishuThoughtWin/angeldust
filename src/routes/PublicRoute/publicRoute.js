import Error from 'pages/404';
import React from 'react';
import {Route} from 'react-router-dom';

export const PublicRoutesOwner = ({ component: Component, owneruser, user, ...props }) => {
    return (
        <>
            <Route {...props} component={Component} />
        </>
    );
}

export const PublicRoutes = ({ component: Component, user, ...props }) => {
    return (
        <>
            <Route {...props} component={Component} />
        </>
    );
}