import React, { Component } from 'react';

import PortalPage from '../layouts/Portal';
import UserPredictionsContainer from '../../components/predictions/UserPredictionsContainer';
import { Navigate, useParams } from 'react-router-dom';

export default function UserPredictionsPage() {
    const params = useParams();
    
    if (!Meteor.userId()) {
        Bert.alert( 'Lehe vaatamiseks pead sisse logima', 'danger' );
        return (<Navigate to="/login" replace />)
        
    } else {

        return (
            <PortalPage title="Vooru ennustused">
                <UserPredictionsContainer userId={params.userId}/>
            </PortalPage>
        )
    }
}