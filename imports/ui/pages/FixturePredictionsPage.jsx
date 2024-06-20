import React from 'react';

import PortalPage from '../layouts/Portal';
import FixturePredictionsContainer from '../../components/fixtures/FixturePredictionsContainer';
import { Navigate, useParams, useSearchParams } from 'react-router-dom';

export default function FixturePredictionsPage() {

    const params = useParams();
    const [searchParams] = useSearchParams();

    if (!Meteor.userId()) {
        Bert.alert( 'Lehe vaatamiseks pead sisse logima', 'danger' );
        return (<Navigate to="/login" replace />)
        
    } else {
        return (
            <PortalPage title="Mängijate ennustused">
                <FixturePredictionsContainer fixtureId={params.fixtureId} h={searchParams.get('h')} a={searchParams.get('a')}/>
            </PortalPage>
        )
    }
}
