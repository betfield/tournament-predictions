import React, { Component } from 'react';

import { Link } from 'react-router-dom';

export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {  
            fixtureLink: this.getFixturesLink()
        };
    }

    componentDidMount() {
        if ($(window).width() < 769) {
            $("body").addClass("hide-sidebar"); 
        } else {
            $("body").removeClass("hide-sidebar");
        }
    }

    hideMenu = (e) => {
        e.preventDefault();
        $("body").toggleClass("hide-sidebar");
    }

    //TODO: Combine the navigation links of Header and Navigation components
    getFixturesLink = () => {
        Meteor.call("getActiveMatchday", (error, result) => {
            if (error) {
                Meteor.call("clientError", "Failed to get active matchday!", Meteor.userId(), error);
            } else if (result && result.round > 1) {
                this.setState({
                    fixtureLink: <li className=""><Link to="/fixtures">Tulemused</Link></li>
                })
            }
        })
    }

    getUserNavBar = () => {

        if (Meteor.userId()) {

            let activate = null;

            if (Roles.userIsInRole(Meteor.userId(),'Aktiveerimata')) {
                activate = <li><Link to="/activate">Aktiveeri ennustus</Link></li>
            }

            return (
                <ul className="nav navbar-nav">
                    <li><Link to="/portal">Pealeht</Link></li>
                    {activate}
                    <li><Link to="/predictions">Ennustused</Link></li>
                    <li><Link to="/table">Edetabel</Link></li>
                    <li><Link to="/calendar">Kalender</Link></li>
                    {this.state.fixtureLink}
                    <li className=""><Link to="/rules">Reeglid</Link></li>
                    <li><Link className="" to="/logout">Logi välja</Link></li>
                </ul>
            )
        } else {
            return (
                <ul className="nav navbar-nav">
                    <li><Link className="" to="/rules">Reeglid</Link></li>
                    <li><Link className="" to="/login">Logi sisse</Link></li>
                </ul>
            )
        }
    }

    render() {
        return (
            <div id="header">
                <Link to="/portal">
                    <div id="logo" className="light-version">
                    </div>
                </Link>
                <nav role="navigation">
                    <div className="header-link hide-menu" onClick={this.hideMenu}><i className="fa fa-bars"></i></div>
                    <div className="small-logo">
                        <span className="text-color">MM 2022</span>
                    </div>
                    <div className="mobile-menu">
                        <button type="button" className="navbar-toggle mobile-menu-toggle" data-toggle="collapse" data-target="#mobile-collapse">
                            <i className="fa fa-chevron-down"></i>
                        </button>
                        <div className="collapse mobile-navbar" id="mobile-collapse">
                            {this.getUserNavBar()}
                        </div>
                    </div>
                    <div className="navbar-right">
                        <ul className="nav navbar-nav no-borders">
                            <li className="dropdown">
                                <Link to="/logout">
                                    <i className="pe-7s-upload pe-rotate-90"></i>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        )
    }
}