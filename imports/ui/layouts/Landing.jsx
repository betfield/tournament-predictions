import React, { Component } from 'react';

import Navigation from './landing/Navigation';
import Header from './landing/Header';
import HowToPlay from './landing/HowToPlay';
import Rules from './landing/Rules';
import Contact from './landing/Contact';
import Footer from './landing/Footer';
import ScrollTop from './landing/ScrollTop';

import Splash from '../../components/loading/Splash';

import '../../../client/js/scrolling/jquery.easing.min';
import '../../../client/js/classie/classie';

export default class Landing extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            userCount: null 
        };
    }

    componentDidMount() {
        Meteor.call("registeredUsersCount", (error, result) => {
            if (error) {
                const msg = 'Registreeritud kasutajate arvu leidmine ebaõnnestus';
                Meteor.call("clientError", msg, Meteor.userId(), error )
            } else {
                this.setState({
                    userCount: result
                });
            }
        });
    }

    render() {
        const userCount = this.state.userCount;

        if (userCount != null) {
            return (
                <div id="landing">
                    <Navigation userCount = {userCount}/>
                    <Header/>
                    <HowToPlay/>
                    <Rules/>
                    <Contact/>
                    <Footer/>
                    <ScrollTop/>
                </div>
            )
        } else {
            return <Splash/>
        }
    }
}
