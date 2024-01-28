import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();

    gLogin = (e) => {
        e.preventDefault();

        Meteor.loginWithGoogle({}, function(err){
            if (err) {
                let msg = "Sisselogimine ebaõnnestus!";
                Meteor.call("clientError", "Google: " + msg, Meteor.userId(), err );

                if (err.error === "register-ended") {
                    msg = msg + " " + err.reason;
                }

                Bert.alert( msg, "danger" );
            } else {
                Meteor.call("clientLog", "Google sisselogimine õnnestus", Meteor.userId());
                Bert.alert( "Tere tulemast, " + Meteor.user().userProfile.name, "success" );
                navigate('/portal');
            }
        });
    }

    return (
        <div className="row">
            <div className="col-md-12 text-center">
                <div className="hpanel">
                    <div className="panel-body login-page-panel">
                        <div className="col-md-3 text-center">
                        </div>
                        <div className="col-md-6 text-center">
                            <form id="login-form" onSubmit={this.gLogin}>
                                <div className="login-page-image">
                                    <img src="images/activate_logo.png"/>    
                                </div>
                                <button id="login-page" type="submit" className="btn btn-danger">
                                    <span><i className="fab fa-google-plus-g" aria-hidden="true"></i> LOGI SISSE</span>
                                </button>
                            </form>
                            <p>NB! Sisselogides nõustud leheküljel seatud reeglitega - rohkem infot <Link to={"/rules"}>siit</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}