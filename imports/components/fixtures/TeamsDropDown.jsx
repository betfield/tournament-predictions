import React from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

export default class TeamsDropDown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dropdownOpen: false,
            selectTeam: '-- Vali --'
        }
    }

    submitForm = (fixtureId, team, isHome) => {
        Meteor.call("updateFixtureTeam", fixtureId, team, isHome, function (error, result) {
            if (error) {
                Meteor.call("clientError", "Meeskonna uuendamine ebaõnnestus!", Meteor.userId(), error )
                Bert.alert( "Meeskonna uuendamine ebaõnnestus!", "danger" );
            } else {
                Meteor.call("clientLog", "Team " + team.name + " updated for fixture: " + fixtureId + ", isHome: " + isHome, Meteor.userId() )
                Bert.alert( "Meeskonna uuendamine õnnestus!", "success" );
            }
        });

        this.setState({
            selectTeam: team.name
        });
    }

    toggle = () => {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    teamsList = (teams) => {
        const result = [];

        teams.forEach(team => {
            result.push(
                <DropdownItem key={team.name} onClick={() => this.submitForm(this.props.fixtureId, team, this.props.isHome)} >{team.name}</DropdownItem>
            );
        })
        return result;
    }

    render() {

        return (
            <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                <DropdownToggle caret>
                    {this.state.selectTeam}
                </DropdownToggle>
                <DropdownMenu>
                    {this.teamsList(this.props.teams)}
                </DropdownMenu>
            </Dropdown>
        );
    }
}
