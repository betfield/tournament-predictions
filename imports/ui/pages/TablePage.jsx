import React from 'react';

import PortalPage from '../layouts/Portal';
import TableContainer from '../../components/table/TableContainer';
import { Navigate } from 'react-router-dom';

export default function TablePage() {

    if (!Meteor.userId()) {
        Bert.alert( 'Tabeli vaatamiseks pead sisse logima', 'danger' );
        return (<Navigate to="/login" replace />)
        
    } else {
        return (
            <PortalPage title="Edetabel">
                <TableContainer/>
            </PortalPage>
        )
    }
}
