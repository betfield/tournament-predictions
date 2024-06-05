import React, { Component } from 'react';

import User from './User';
import Splash from '../loading/Splash';
import { Navigate } from 'react-router-dom';

export default class UserList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            registerEnd: null,
            emailHeader: "",
            emailText: ""
        }
        this.handleChangeEmailText = this.handleChangeEmailText.bind(this);
        this.handleChangeEmailHeader = this.handleChangeEmailHeader.bind(this);
    }

    componentDidMount() {
        Meteor.call("isRegisterEnd", (error, result) => {
            if (error) {
                const msg = 'Registreerimise staatust ei olnud võimalik saada';
                Meteor.call("clientError", msg, Meteor.userId(), error);
                Bert.alert( msg, 'danger' );
            } else {
                this.setState({
                    registerEnd: result
                })
            }
        });

    }

    componentWillUnmount() {
		this.props.usersHandle.stop();
	}


    // TODO: add check to filter out unregistered users after registration has ended
    getAllUserEmails() {
        const users = this.props.users;

        // Create an array with each user email included
	    let userEmails = [];
        
        users.forEach(user => {
            let email = user.userProfile.email;
            if(email !== undefined)
                userEmails.push(email);
        })

        return userEmails;
    }

    updateUserPointsHandler = (event) => {
        event.preventDefault();
        Meteor.call('updateAllUsersPredictionPoints', (error, result) => {
            if (error) {
                const msg = 'Kasutaja punktide uuendamine ebaõnnestus';

                Bert.alert( msg , 'danger' );
                Meteor.call("clientError", msg, Meteor.userId(), error )
             } else {
                const msg = 'Kasutajate punktide uuendamine õnnestus';
                Bert.alert( msg, 'success' );
                Meteor.call("clientLog", msg, Meteor.userId() )
             }
        });
    }

    handleChangeEmailText(event) {
        this.setState({
            emailText: event.target.value
        });
    }

    handleChangeEmailHeader(event) {
        this.setState({
            emailHeader: event.target.value
        });
    }

    sendEmail = (event) => {
        event.preventDefault();
        console.log(this.state.emailText);
        console.log(this.state.emailHeader);
        console.log(this.getAllUserEmails());

        Meteor.call('sendEmail', "", this.getAllUserEmails(), this.state.emailHeader, this.state.emailText, (error, result) => {
            if (error) {
                const msg = 'Emaili saatmine ebaõnnestus';

                Bert.alert( msg , 'danger' );
                Meteor.call("clientError", msg, Meteor.userId(), error )
             } else {
                const msg = 'Emaili saatmine õnnestus';
                Bert.alert( msg, 'success' );
                Meteor.call("clientLog", msg, Meteor.userId() )
             }
        });

    }


    render() {
        const users = this.props.users;
        const currentUser = Meteor.user();
        
        if (Roles.userIsInRole(currentUser,'Administraator')) {
            if (this.state.registerEnd === null) {
                return <Splash/>
            } else {
                return (
                    <table className="bf-table table table-striped table-hover table-bordered table-condensed">
                        <thead>
                            <tr>
                                <th>Pilt</th>
                                <th>Kasutaja</th>
                                <th>Aktiveeri</th>
                            </tr>
                        </thead>
                        <tbody>
                            { users.map((user) => {
                                return <User user={user} key={user._id}/>
                            })}
                        </tbody>
                        <tfoot className="emailTable">
                            <tr>
                                <td colSpan="3">
                                    <br/>
                                    <p>Saada email</p>
                                    <span>Pealkiri:</span>
                                    <input type="text" value={this.state.emailHeader} onChange={this.handleChangeEmailHeader} />
                                    <br/><br/>
                                    <span>Sõnumi sisu: </span>
                                    <textarea id="emailText" value={this.state.emailText} onChange={this.handleChangeEmailText} />
                                    <button type="submit" className="btn btn-success" onClick={this.sendEmail}>Saada</button>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                )
            }
        } else if (this.props.usersHandle.ready()) {
            Bert.alert( 'Kasutajate vaatamiseks pead olema administraatori õigustega', 'danger' );
            return (<Navigate to="/portal" replace />)
        }

        return null;
    }
}
