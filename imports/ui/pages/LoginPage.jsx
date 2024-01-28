import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import PortalPage from '../layouts/Portal';
import Login from '../../components/login/Login';

export default function LoginPage(props) {   
    const navigate = useNavigate();
    const id = Meteor.userId();

    //Check if user is logged in
    if (id) {

        //If user logged in and logout parameter exists, proceed with user logout
        if (props.logout) {
            Meteor.logout(err => {
                if (err) {
                    const msg = 'Väljalogimine ebaõnnestus';
                    Bert.alert( msg , 'danger' );
                    Meteor.call("clientError", msg + ", user: " + id, Meteor.userId(), err);
                } else {
                    const msg = 'Oled edukalt välja logitud';
                    Bert.alert( msg , 'success' );
                    Meteor.call("clientLog", msg + ", user: " + id, Meteor.userId());
                }
            });
            return (<Navigate to="/login" replace />);
        } else {
            return (<Navigate to="/portal" replace />)
        }   
    } else {
        //If user does not exist then proceed with the normal login flow
        return (
            <PortalPage title="Logi sisse">
                <Login />
            </PortalPage>
        )
    }
    
}