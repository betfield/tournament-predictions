import React, { Component } from 'react';

import PortalPage from '../layouts/Portal';
import FixturesContainer from '../../components/fixtures/FixturesContainer';
import { Navigate, useParams } from 'react-router-dom';

export default function FixturesPage() {

    const params = useParams();
    
    if (!Meteor.userId()) {
        Bert.alert( 'Lehe vaatamiseks pead sisse logima', 'danger' );
        return (<Navigate to="/login" replace />)
        
    } else {
        return (
            <PortalPage title="Vooru tulemused">
                <FixturesContainer fixtureId={params.fixtureId}/>
            </PortalPage>
        )
    }
}
