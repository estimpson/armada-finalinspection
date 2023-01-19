import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Home from './components/Home';
import { IIdentity, selectIdentity } from './features/identity/identitySlice';
import { useAppSelector } from './app/hooks';

export function Routes() {
    const identity: IIdentity = useAppSelector(selectIdentity);

    const validLoginRoutes = [
        // <Route path={'/route'} key="1" component={component} />,
    ];

    return (
        <Switch>
            <Route exact path={'/'} component={Home} />
            <Redirect to={'/'} />
        </Switch>
    );
}
