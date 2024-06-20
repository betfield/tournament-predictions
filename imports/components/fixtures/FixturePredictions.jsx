import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Table from '../../ui/layouts/portal/table/Table';
import TeamsDropDown from './TeamsDropDown';
import Splash from '../loading/Splash';

export default class FixturesPredictions extends Component {

    formatPredictionsData = (data) => {
        let predictionsData = [];
        let queryResult = false;

        const users = this.props.users;
        const queryHome = this.props.h;
        const queryAway = this.props.a;
        
        if (queryHome !== null || queryAway !== null) {
            queryResult = true;    
            console.log("Query home goals: " + queryHome);
            console.log("Query away goals: " + queryAway);
        }       

        data.forEach((e) => {
            // Only include predictions that match the registered user list
            if (users.some(elem => elem._id === e.userId)) {
                
                if (!queryResult || (queryHome === e.fixture.result.home_goals && queryAway === e.fixture.result.away_goals)) {
                
                    let prediction = {
                        result: {
                            homeGoals: e.fixture.result.home_goals,
                            awayGoals: e.fixture.result.away_goals,
                            userPoints: e.fixture.userPoints
                        },
                        user: {
                            id: e.userId,
                            name: e.user.team,
                            image: e.user.picture
                        }
                    }
        
                    predictionsData.push(prediction);  
                }
            }
        })

        return predictionsData;
    }

    getFixtureDetails = (f) => {
        if (!f.locked) {
            Bert.alert( 'Ennustusvoor veel avatud. Kasutajate ennustused pole kättesaadavad', 'danger' );
        }

        let homeTeamCode = String(f.home_team.code).toLowerCase();
        let awayTeamCode = String(f.away_team.code).toLowerCase();

        let fixture = {
            time: f.date + " " + f.time,
            homeFlag: Meteor.settings.public.FOLDER_FLAGS + homeTeamCode + ".png",
            awayFlag: Meteor.settings.public.FOLDER_FLAGS + awayTeamCode + ".png",
            homeTeam: f.home_team.name,
            awayTeam: f.away_team.name,
            group: f.group,
            round: f.roundRoman
        }

        if (f.result.home_goals || f.result.away_goals) {
            fixture.result = f.result.home_goals + ":" + f.result.away_goals;
        } else {
            fixture.result = "-";
        }
        
        return (
            <table className="bf-table table table-striped table-hover table-bordered table-condensed">
                <thead>
                    <tr>
                        <th>Mäng</th>
                        <th>Tulemus</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <span className="bf-table-vs">
                                <img src={fixture.homeFlag}/>
                                <span> vs </span>
                                <img src={fixture.awayFlag}/>
                            </span>
                        </td>
                        <td>
                            <span className="bf-table-score">
                            <span>{fixture.result}</span>
                        </span></td>
                    </tr>
                    <tr>
                        <th>Aeg</th>
                        <th>Voor</th>
                    </tr>
                    <tr>
                        <td>{fixture.time}</td>
                        <td>{fixture.round}</td>
                    </tr>
                </tbody>
            </table>
        );
    }

    getFixtureDetailsAdmin = (f) => {
        const teams = this.getAllteams(this.props.allFixtures);

        let homeTeamCode = String(f.home_team.code).toLowerCase();
        let awayTeamCode = String(f.away_team.code).toLowerCase();

        let fixture = {
            time: f.date + " " + f.time,
            homeFlag: Meteor.settings.public.FOLDER_FLAGS + homeTeamCode + ".png",
            awayFlag: Meteor.settings.public.FOLDER_FLAGS + awayTeamCode + ".png",
            homeTeam: f.home_team.name,
            awayTeam: f.away_team.name,
            group: f.group,
            round: f.roundRoman
        }

        if (f.result.home_goals || f.result.away_goals) {
            fixture.result = f.result.home_goals + ":" + f.result.away_goals;
        } else {
            fixture.result = "-";
        }
        
        return (
            <table className="bf-table table table-striped table-hover table-bordered table-condensed">
                <thead>
                    <tr>
                        <th>Mäng</th>
                        <th>Tulemus</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <span className="bf-table-vs">
                                <img src={fixture.homeFlag}/>
                                <span> vs </span>
                                <img src={fixture.awayFlag}/>
                            </span>
                        </td>
                        <td>
                            <span className="bf-table-score">
                            <span>{fixture.result}</span>
                        </span></td>
                    </tr>
                    <tr>
                        <th>Aeg</th>
                        <th>Voor</th>
                    </tr>
                    <tr>
                        <td>{fixture.time}</td>
                        <td>{fixture.round}</td>
                    </tr>
                    <tr>
                        <th>Kodu</th>
                        <th>Võõrsil</th>
                    </tr>
                    <tr>
                        <td>
                            <TeamsDropDown isHome={true} teams={teams} fixtureId={f._id}/>
                        </td>
                        <td>
                            <TeamsDropDown isHome={false} teams={teams} fixtureId={f._id}/>
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }

    getAllteams = (fixtures) => {
        let distinctArray = [];

        for (let i = 0; i < fixtures.length; i++) {
            if (distinctArray.length === 0) {
                distinctArray.push(fixtures[0].home_team);
            } else if (!distinctArray.some(el => el.name_eng === fixtures[i].home_team.name_eng)) {
                distinctArray.push(fixtures[i].home_team);
            }
        }

        // TODO: Currently implemented as hack since for some reason the last element is added by mistake ("2A") so removing it by force
        distinctArray.splice(distinctArray.length-1,1);

        return distinctArray;
    }

    imageFormatter = (cell, row) => {
        return (
            <div className="bf-table-points-user-fixt">
                <span>
                    <img className="img-circle m-b" src={cell.image} title={cell.name}/>
                </span>
            </div>
        );
    }

    resultFormatter = (cell, row) => {
        let result = cell.homeGoals + ":" + cell.awayGoals;
            
        return (
            <span className="bf-table-score">
                <Link to={"/fixtures/" + this.props.fixture._id + "?h=" + cell.homeGoals + "&a=" + cell.awayGoals}>
                    <span >{result}</span>
                </Link>
            </span>
        );
    }

    pointsFormatter = (cell, row) => {
        let points = "";
    
        if (this.props.fixture.status === "FT") {
            points = cell + "p";
        } else {
            points = "-";
        }
            
        return (
            <span className="bf-table-score">
                <span>{points}</span>
            </span>
        );
    }

    getTableHeaders = () => {
        let columnHeaders = [
            {
                text: '',
                dataField: 'user',
                headerAlign: 'center',
                formatter: this.imageFormatter
            }, 
            {
                text: 'Kasutaja',
                dataField: 'user.name',
                sort: true,
                headerAlign: 'center',
            }, 
            {
                text: 'Ennustus',
                dataField: 'result',
                sort: false,
                headerAlign: 'center',
                formatter: this.resultFormatter
            },
            {
                text: 'Punktid',
                dataField: 'result.userPoints',
                sort: true,
                headerAlign: 'center',
                formatter: this.pointsFormatter
            }
        ];;
        
        if ($(window).width() < 501) {
            columnHeaders[1].hidden = true; 
        } 

        return columnHeaders;
    }

    render() {
        
        if (this.props.fixturesReady) {
            //If administrator then allow changing fixture teams
            if (Roles.userIsInRole(Meteor.user(),'Administraator')) {
                return (
                    <div>
                        { this.getFixtureDetailsAdmin(this.props.fixture) }
                    </div>
                )
            //else, use the prediction instead to set the user's result
            } else if (this.props.predictionsReady && this.props.usersReady) {
                return (
                    <div>
                        { this.getFixtureDetails(this.props.fixture) }
                        <br/>
                        <Table 
                            data={this.formatPredictionsData(this.props.predictions)}
                            keyField={'user.id'}
                            getTableHeaders={this.getTableHeaders}
                        />
                    </div>
                )
            } else {
                return <Splash/>
            }
		} else {
			return <Splash/>
		}
        
    }

}