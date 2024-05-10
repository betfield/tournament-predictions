import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import Table from '../../ui/layouts/portal/table/Table';
import Splash from '../loading/Splash';

export default class UserRoundPredictions extends Component {

    getTableHeaders = () => {
        let columnHeaders = [
            {
                text: 'Aeg',
                dataField: 'time',
                sort: false,
                headerAlign: 'center'
            }, 
            {
                text: 'Kodu',
                dataField: 'homeTeam',
                headerAlign: 'center',
            }, 
            {
                text: '',
                dataField: 'vs',
                headerAlign: 'center',
                formatter: this.vsFormatter
            }, 
            {
                text: 'Võõrsil',
                dataField: 'awayTeam',
                headerAlign: 'center'
            }, 
            {
                text: 'Grupp',
                dataField: 'group',
                sort: false,
                headerAlign: 'center'
            }, 
            {
                text: 'Voor',
                dataField: 'round',
                sort: false,
                headerAlign: 'center'
            }, 
            {
                text: 'Tulemus',
                dataField: 'result',
                sort: false,
                headerAlign: 'center',
                formatter: this.resultFormatter
            }
        ];;
        
        if ($(window).width() < 501) {
            columnHeaders[0].hidden = true; 
            columnHeaders[1].hidden = true; 
            columnHeaders[2].hidden = true; 
            columnHeaders[3].hidden = true; 
            columnHeaders[4].hidden = true; 
            columnHeaders[5].hidden = true; 
            columnHeaders[6].formatter = this.resultFormatterSmall; 
        } else if ($(window).width() < 640) {
            columnHeaders[0].hidden = true; 
            columnHeaders[1].hidden = true; 
            columnHeaders[3].hidden = true; 
            columnHeaders[4].hidden = true; 
            columnHeaders[5].hidden = true; 
        } else if ($(window).width() < 1024) {
            columnHeaders[1].hidden = true; 
            columnHeaders[3].hidden = true; 
            columnHeaders[4].hidden = true; 
            columnHeaders[5].hidden = true; 
        } else if ($(window).width() < 1281) {
            columnHeaders[1].hidden = true; 
            columnHeaders[3].hidden = true; 
        } 

        return columnHeaders;
    }

    getPredictionsData = (fixtures, predictions, userId) => {
        let i = 0;

        let fixturesWithData = [];

        //If not Adminstrator then attach user's prediction to the Fixture
        if (!Roles.userIsInRole(Meteor.user(),'Administraator')) {
            fixtures.forEach(function(f) {
                const obj = predictions.find(prediction => prediction.fixture._id === f._id);
                
                if (obj && obj.fixture) {
                    f.prediction = { 
                        result: obj.fixture.result,
                        userPoints: obj.fixture.userPoints
                    };

                    fixturesWithData.push(f);
                } else {
                    Meteor.call("clientLog", "Prediction object does not exist for fixture " + f._id + "; user: " + userId, Meteor.userId() )
                    Bert.alert( "Ennustuse tulemusi ei leitud. Palun pöördu administraatori poole!", "danger" );
                }
                
                i++;
            });                
        }
        
        // Order by date
        fixturesWithData.sort(function(a,b){
            return new Date(a.ts) - new Date(b.ts);
        });

        return fixturesWithData;
    }

    formatPredictionData = (data) => {
        let predictionsData = [];

        data.forEach((e) => {
            let prediction = {
                time: e.date + " " + e.time,
                vs: {
                    id: e._id,
                    homeFlag: e.home_team.imgSrc,
                    awayFlag: e.away_team.imgSrc
                },
                homeTeam: e.home_team.name,
                awayTeam: e.away_team.name,
                group: e.group,
                round: e.roundRoman,
                locked: e.locked,
                status: e.status,
                result: {
                    id: e._id,
                    homeGoals: e.prediction.result.home_goals,
                    awayGoals: e.prediction.result.away_goals,
                    userPoints: e.prediction.userPoints
                }
            }

            predictionsData.push(prediction);
        })

        return predictionsData;
    }

    vsFormatter = (cell, row) => {
        return (
            <span className="bf-table-vs">
                <img src={cell.homeFlag}/>
                <span> vs </span>
                <img src={cell.awayFlag}/>
            </span>
        );
    }

    resultFormatter = (cell, row) => {
        if (row.locked) {
            return (
                <span className="bf-table-score">
                    {cell.homeGoals} : {cell.awayGoals} {"(" + (row.status==="FT" ? cell.userPoints + "p" : "-") + ")"}
                </span>
            );
        }
    }

    resultFormatterSmall = (cell, row) => {
        let vs = {};

        if (row.vs) {
            vs = row.vs
        }
        
        if (row.locked) {
            return (
                <div className="bf-table-score">
                    <input id="fixture-id" type="hidden" value={cell.id}/>
                    <div className="bf-table-small-result">
                        <div className="bf-table-small col-xs-4">
                            <img src={vs.homeFlag}/>
                            <br/>
                            <span>{row.homeTeam}</span>
                        </div>
                        <div className="bf-table-small-result col-xs-4">
                            <span className="bf-table-score">
                                {cell.homeGoals} : {cell.awayGoals} {"(" + (row.status==="FT" ? cell.userPoints + "p" : "-") + ")"}
                            </span>
                        </div>
                        <div className="bf-table-small col-xs-4">
                            <img src={vs.awayFlag}/>
                            <br/>
                            <span>{row.awayTeam}</span>
                        </div>
                    </div>
                </div>
            );
        }
    }

    getUserDetails = (user) => {

        return (
            <table className="bf-table table table-striped table-hover table-bordered table-condensed">
                <thead>
                    <tr>
                        <th>Kasutaja</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <span className="bf-table-vs">
                                <img className="img-circle m-b" src={user.picture}/>
                                <span>{user.team}</span>
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }

    render() {
        
        if (this.props.fixturesReady && this.props.predictionsReady && this.props.userReady) {
            return (
                <div>
                    { this.getUserDetails(this.props.user.userProfile)}
                    <br/>
                    <Table 
                        data={this.formatPredictionData(this.getPredictionsData(this.props.roundFixtures, this.props.predictions, this.props.user._id))}
                        keyField={'result.id'}
                        getTableHeaders={this.getTableHeaders}
                    />
                </div>
            )
		} else {
			return <Splash/>
		}
        
    }

}
