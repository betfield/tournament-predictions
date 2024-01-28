import React from 'react';

import PortalPage from '../layouts/Portal';
import Activate from '../../components/activate/Activate';
import { Navigate } from 'react-router-dom';

export default function ActivatePage() {
    
    if (!Meteor.userId()) {
        Bert.alert( 'Lehe vaatamiseks pead sisse logima', 'danger' );
        return (<Navigate to="/login" replace />)
        
    } else {

        return (
            <PortalPage title="Aktiveeri ennustus">
                <Activate/>
            </PortalPage>
        )
    }
}
