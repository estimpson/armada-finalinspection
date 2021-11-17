import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Home from './components/Home';
import { IIdentity, selectIdentity } from './features/identity/identitySlice';
import { useAppSelector } from './app/hooks';

export function Routes() {
    const identity: IIdentity = useAppSelector(selectIdentity);

    const validLoginRoutes: JSX.Element[] = [
        // <Route path={'/route'} key="1" component={component} />,
    ];

    return (
        <Switch>
            <Route exact path={'/'} component={Home} />
            {identity.userName ? validLoginRoutes.map((route) => route) : <></>}
            {/* check if this is the problem with loading home when not logged in */}
            <Redirect to={'/'} />
        </Switch>
    );
}
