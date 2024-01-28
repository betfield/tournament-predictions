import React from 'react';

import PortalPage from '../layouts/Portal';
import UserListContainer from '../../components/users/UserListContainer';
import { Navigate } from 'react-router-dom';

export default function UsersPage() {

    if (!Meteor.userId()) {
        Bert.alert( 'Lehe vaatamiseks pead sisse logima', 'danger' );
        return (<Navigate to="/login" replace />)
        
    } else {
        return (
            <PortalPage title="Kasutajad">
                <UserListContainer/>
            </PortalPage>
        )
    }
}