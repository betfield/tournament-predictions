import React from 'react';

import PortalPage from '../layouts/Portal';
import CalendarContainer from '../../components/calendar/CalendarContainer';
import { Navigate } from 'react-router-dom';

export default function CalendarPage() {

    if (!Meteor.userId()) {
        Bert.alert( 'Kalendri vaatamiseks pead sisse logima', 'danger' );
        return (<Navigate to="/login" replace />)
        
    } else {

        return (
            <PortalPage title="Kalender">
                <CalendarContainer/>
            </PortalPage>
        )
    }
}
