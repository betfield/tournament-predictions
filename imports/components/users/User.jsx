import React, { Component } from 'react';

export default class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userRoles: Roles.getRolesForUser(this.props.user)
        }
    }

    submitButton = (user) => {
        let buttonId, buttonClass, buttonTitle;

        if (Roles.userIsInRole(user,'Administraator')) {
            return;
        } else if (Roles.userIsInRole(user,'Aktiveerimata')) {
            if (this.state.registerEnd) {
                buttonId = "user-delete-submit";
                buttonClass = "btn btn-danger";
                buttonTitle = "Kustuta";
            } else {
                buttonId = "user-activate-submit";
                buttonClass = "btn btn-success";
                buttonTitle = "Aktiveeri";
            }
        } else if (Roles.userIsInRole(user,'Aktiveeritud')) {
            buttonId = "user-deactivate-submit";
            buttonClass = "btn btn-warning";
            buttonTitle = "Desaktiveeri";
        } else if (Roles.userIsInRole(user,'Kustutatud')) {
            return <span>Kustutatud</span>
        }
        return <button id={buttonId} type="submit" className={buttonClass} onClick={this.submitHandler}>{buttonTitle}</button>
    }

    updateUserRoles = (user) => {
        this.setState({
            userRoles: Roles.getRolesForUser(user)
        });
    }

    submitHandler = (event) => {
        // Prevent default browser form submit
        event.preventDefault();
        const user = this.props.user;
        const value = user._id;

        // TODO: currently code never reaches here
        // If registration is ended, add Delete button handler
        if (this.state.registerEnd) {
            Meteor.call("updateUserToDeleted", value, (error, response) => {
                if (error) {
                    const msg = 'Kasutajat ' + user.userProfile.name + ' ei saanud kustutada!';
                    Meteor.call("clientError", msg, Meteor.userId(), error);
                    Bert.alert( msg, 'danger' );
                } else {
                    this.updateUserRoles(user);
                    const msg = 'Kasutaja ' + user.userProfile.name + ' kustutatud';
                    Meteor.call("clientLog", msg, Meteor.userId());
                    Bert.alert( msg, 'success' );
                }
            });
        } else {
            // If user is inactive, add Activate button handler
            if (Roles.userIsInRole(value,'Aktiveerimata')) {
                Meteor.call("updateUserToRegistered", value, (error, response) => {
                    if (error) {
                        const msg = 'Kasutajat ' + user.userProfile.name + ' ei saanud aktiveerida!';
                        Meteor.call("clientError", msg, Meteor.userId(), error);
                        Bert.alert( msg, 'danger' );
                    } else {
                        this.updateUserRoles(user);
                        const msg = 'Kasutaja ' + user.userProfile.name + ' aktiveeritud';
                        Meteor.call("clientLog", msg, Meteor.userId());
                        Bert.alert( msg, 'success' );
                    }
                });
            // If user is active,  add Deactivate button handler
            }  else if (Roles.userIsInRole(value,'Aktiveeritud')) {
                Meteor.call("updateUserToUnRegistered", value, (error, response) => {
                    if (error) {
                        const msg = 'Kasutajat ' + user.userProfile.name + ' ei saanud desaktiveerida!';
                        Meteor.call("clientError", msg, Meteor.userId(), error);
                        Bert.alert( msg, 'danger' );
                    } else {
                        this.updateUserRoles(user);
                        const msg = 'Kasutaja ' + user.userProfile.name + ' desaktiveeritud';
                        Meteor.call("clientLog", msg, Meteor.userId());
                        Bert.alert( msg, 'success' );
                    }
                });
            }
        }
    }

    render() {

        const user = this.props.user;

        return (
            <tr>
                <td><img className="img-circle m-b" src={user.userProfile && user.userProfile.picture}/></td>
                <td>{user.userProfile && user.userProfile.name}</td>
                <td>{this.submitButton(user)}</td>
            </tr>
        )
    }
}