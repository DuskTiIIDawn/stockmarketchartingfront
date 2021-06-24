import React from 'react';
import { Route, Redirect } from 'react-router-dom';


import { authenticationService } from '../_services/authenticationService';

export const PrivateRoute = ({ component: Component, roles, ...rest }) => (
    <Route {...rest} render={props => {

        const currentUser = authenticationService.currentUserValue;
        if (!currentUser) {
            return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        }

        // check if route is restricted by role
        if (roles && roles.indexOf('Admin') !== -1 && !currentUser.isAdmin) {
            // role not authorised so redirect to home page
            return <Redirect to={{ pathname: '/' }} />
        }

        // authorised so return component
        return <Component {...props} isAdmin={currentUser.isAdmin} />
    }} />
)