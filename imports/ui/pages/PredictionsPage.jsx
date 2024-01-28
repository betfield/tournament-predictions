import React, { Component } from 'react';
import ReactDOM from 'react-dom'

import PortalPage from '../layouts/Portal';
import PredictionsContainer from '../../components/predictions/PredictionsContainer';
import Filter from '../layouts/portal/Filter';
import { Navigate } from 'react-router-dom';

export default class PredictionsPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            groupSelected: 'I'
        };

        this.domNode = document.createElement('div');
    }

    selectGroup = (group) => {
        this.setState({ groupSelected: group });
    }

    renderFilter() {
        return ReactDOM.createPortal(
            <Filter filter="group" selectGroup={this.selectGroup}/>,
            this.domNode
        )
    }

    componentDidMount() {
        if (Meteor.userId()) {
            Meteor.call('getActiveMatchdayRoman', (error, result) => {
                if (error) {
                    const msg = 'Aktiivse vooru infot ei olnud võimalik saada';
                    Meteor.call("clientError", msg, Meteor.userId(), error);
                } else {
                    this.setState({
                        groupSelected: result
                    });
                    $("[id='" + result + "']").addClass("fc-state-active").siblings().removeClass("fc-state-active");
                }
            });
            document.getElementById("filter").appendChild(this.domNode);
        }
    }

    render() {

        if (!Meteor.userId()) {
            Bert.alert( 'Ennustuste vaatamiseks pead sisse logima', 'danger' );
            return (<Navigate to="/login" replace />)
            
        } else {

            return (
                <PortalPage title="Minu ennustused">
                    <PredictionsContainer groupSelected={this.state.groupSelected}/>
                    {this.renderFilter()}
                </PortalPage>
            )
        }
    }
}