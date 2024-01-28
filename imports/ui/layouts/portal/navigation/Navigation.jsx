import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Splash from '../../../../components/loading/Splash';

import '../../../../../client/vendor/metisMenu/metisMenu';

export default class Navigation extends Component {
    constructor(props) {
        super(props);
        this.state = {  
            date: new Date(),
            ticker: this.getTicker(),
            fixtureLink: this.getFixturesLink()
        };
    }

    componentDidMount() {
        // Initialize metsiMenu plugin to sidebar menu
        $('#side-menu').metisMenu();

        // Update ticker every minute
        this.interval = setInterval(() => this.setState({
            date: new Date(),
            ticker: this.getTicker()
        }), 60 * 1000);
    }

    componentWillUnmount() {
        // Stop updating the ticker
        clearInterval(this.interval);
    }

    getTicker = () => {
        if (Meteor.userId()) {
            Meteor.call('getFirstRoundFixtureDates', (error, result) => {
                if (error) {
                    Meteor.call("clientError", "Failed to get fixture dates for first matches of the rounds!", Meteor.userId(), error);
                } else if (result) {
                    const firstRoundFixtureDates = result;
                    let currentDate = this.state.date;
                    
                    if (Meteor.settings.public.INVALID_TEST_TIME !== "") {
                        currentDate = new Date(Meteor.settings.public.INVALID_TEST_TIME);
                    }

                    let roundElem = {};

                    firstRoundFixtureDates.some(elem => {
                        roundElem = elem;
                        return currentDate.toISOString() < elem.ts
                    });

                    let roundDate = new Date(roundElem.ts);

                    let diff = roundDate.getTime() - currentDate.getTime();
                    let prevRoundElem = this.getPreviousRound(roundElem, firstRoundFixtureDates);
                    let prevDiff = 0;
                    
                    if (prevRoundElem) {
                        const prevRoundDate = new Date(prevRoundElem.ts);
                        prevDiff = currentDate.getTime() - prevRoundDate.getTime();
                    }

                    //Show ticker if there is less than 24h left until round end
                    if (diff > 0 && diff < (24*60*60*1000)) {
                        let url = "https://freesecure.timeanddate.com/countdown/i58fl2g4/cf11/cm0/cu4/ct1/cs1/ca0/co1/cr0/ss0/cac8d0808/cpcc0392b/pcfff/tcfff/fs100/szw256/szh108/tatVooru%20sulgemiseni%3A/tac966c6f/tpc966c6f/iso" + roundElem.ts;
                        this.setState({
                            ticker: <iframe src={url} frameBorder="0" width="136" height="32"/>
                        });
                    
                    //Show round closed during 1h after the deadline
                    } else if (prevDiff > 0 && prevDiff < (1*60*60*1000)) {
                        this.setState({
                            ticker: <span>{prevRoundElem.round}. voor suletud!</span>
                        });
                    //If last round then use current diff value
                    } else if (roundElem.round === firstRoundFixtureDates.length && Math.abs(diff) < (1*60*60*1000)) {
                        this.setState({
                            ticker: <span>{roundElem.round}. voor suletud!</span>
                        });
                    } else {
                        this.setState({
                            ticker: null
                        });
                    }
                }
            });
        }
    }

    getDropDownUserRole = (currentUser) => {
        const userRoleName = Roles.getRolesForUser(Meteor.userId());
        let className = "text-activate";

        if (Roles.userIsInRole(currentUser,'Aktiveeritud')) {
            className = "text-muted";
        } else if (Roles.userIsInRole(currentUser,'Administraator')) {
            className = "text-admin";
        } 

        return (
            <small className={className}>{userRoleName}<b className="caret"></b></small>
        )
    }

    getDropDownData = (currentUser) => {
        if (Roles.userIsInRole(currentUser,'Aktiveerimata')) {
            return (
                <li><Link to="/activate">Aktiveeri ennustus</Link></li>
            )
        } 
    }

    getLastPredictions = (currentUser) => {
        if (Roles.userIsInRole(currentUser,'Aktiveeritud')) {
            const userPoints = Points.findOne({"user._id": Meteor.userId()});
            
            return (
                <div>
                    <h4 className="font-extra-bold m-b-xs">
                        <span className="color-blue">{userPoints ? userPoints.user.pos : " "}. koht</span> ({userPoints ? userPoints.total : " "}p)
                    </h4>
                </div>
            )       
        }
    }
                                
    getLoggedInUserData = (currentUser) => {
        if (currentUser !== undefined && currentUser !== null && currentUser.userProfile !== undefined) {

            return (
                <div className="profile-picture">
                    <Link to="/portal">
                        <img src={currentUser.userProfile.picture} 
                            alt={currentUser.userProfile.name} className="img-circle m-b"/>
                    </Link>

                    <div className="stats-label text-color">
                        <span className="font-extra-bold font-uppercase">{currentUser.userProfile.name}</span>
                        <div className="dropdown">
                            <Link className="dropdown-toggle" to="#" data-toggle="dropdown">
                                {this.getDropDownUserRole(currentUser)}
                            </Link>
                            <ul className="dropdown-menu animated flipInX m-t-xs">
                                <li><Link to="/portal">Pealeht</Link></li>
                                {this.getDropDownData(currentUser)}
                            <li className="divider"></li>
                                <li><Link to="/logout">Logi välja</Link></li>
                            </ul>
                        </div>
                    </div>

                    {this.getLastPredictions(currentUser)}

                </div>    
            )
        }
    }

    getActivateLink = (currentUser) => {

        if (currentUser !== undefined) {
            if (Roles.userIsInRole(currentUser,'Aktiveerimata')) {
                return (
                    <li className="text-activate"><Link to="/activate">Aktiveeri</Link></li>
                )
            } else if (Roles.userIsInRole(currentUser,'Administraator')) {
                return (
                    <li className="text-activate"><Link to="/users">Kasutajad</Link></li>
                )
            }
        }
    }

    getPreviousRound = (current, rounds) => {
        if (current.round > 1) {
            //Return array element with previous index
            //Need -2 as round itself starts with 1 and array index with 0
            return rounds[current.round - 2];
        } 
    }

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

    render() {
        return (
            <aside id="menu">
                <div id="navigation">
                    
                    { this.getLoggedInUserData(this.props.currentUser) }
                
                    <br/>
                    <div className="predictions-close-ticker">
                        {this.state.ticker}
                    </div>
                    <ul className="nav" id="side-menu">
                        <li className=""><Link to="/predictions">Ennustused</Link></li>
                        <li className=""><Link to="/table">Edetabel</Link></li>
                        <li className=""><Link to="/calendar">Kalender</Link></li>
                        {this.state.fixtureLink}
                        <li className=""><Link to="/rules">Reeglid</Link></li>
                        { this.getActivateLink(this.props.currentUser) }
                    </ul>
                </div>
            </aside>
        )
    }
}
