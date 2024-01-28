import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import Table from '../../ui/layouts/portal/table/Table';

import NumericInput from 'react-numeric-input';

export default class PredictionList extends Component {

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

    getPredictionsData = (group, user) => {
        let filteredPredictions = [];

        if (this.props.fixturesReady && this.props.predictionsReady) {
            
            let i = 0;

            const fixtures = this.props.fixtures;
            const predictions = this.props.predictions;

            filteredPredictions = fixtures.filter(fixture => fixture.roundRoman === group && fixture.home_team.code && fixture.away_team.code);

            //If not Adminstrator then attach user's prediction to the Fixture
            if (!Roles.userIsInRole(Meteor.user(),'Administraator')) {
                filteredPredictions.forEach(function(f) {
                
                    const obj = predictions.find(prediction => prediction.fixture._id === f._id);
                    if (obj && obj.fixture) {
                        filteredPredictions[i].prediction = { 
                            result: obj.fixture.result,
                            userPoints: obj.fixture.userPoints
                        };
                    } else {
                        Meteor.call("clientLog", "Prediction object does not exist for fixture" + f._id, Meteor.userId() )
                        Bert.alert( "Ennustuse tulemusi ei leitud. Palun pöördu administraatori poole!", "danger" );
                        filteredPredictions[i].prediction = { 
                            result: {
                                home_goals: "N/A",
                                away_goals: "N/A"
                            },
                            userPoints: 0
                        };
                    }
    
                    i++;
                });                
            }
        }
        
        // Order by date
        filteredPredictions.sort(function(a,b){
            return new Date(a.ts) - new Date(b.ts);
        });

        return filteredPredictions;
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
            }

            //If administrator, use fixture object's result to set the actual match result
            if (Roles.userIsInRole(Meteor.user(),'Administraator')) {
                prediction.locked = false;
                prediction.result = {
                    id: e._id,
                    homeGoals: e.result.home_goals,
                    awayGoals: e.result.away_goals
                }
            //else, use the prediction instead to set the user's result
            } else {
                prediction.result = {
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

    handleSubmit = (event) => {
        // Prevent default browser form submit
        event.preventDefault();
    
        // Get value from form element
        let scores = [].slice.call(event.target.getElementsByClassName("bf-table-score"));
        let userId = Meteor.userId();

        scores.forEach((score, i) => {
            let result = score.getElementsByTagName("input");

            if (result.length > 2) {
                
                let fixture = result[0].value;
                let homeScore = result[1].value;
                let awayScore = result[2].value;

                Meteor.call("clientLog", "Submitting predictions for user: " + userId + ", fixture: " + fixture + ", prediction: " + homeScore + ":" + awayScore, Meteor.userId());

                //TODO: Make function update all predictions at once
                Meteor.call( "updateUserPredictions", fixture, homeScore, awayScore, function( error, response ) {
                    if ( error ) {
                        const msg = "Ennustuste uuendamine ebaõnnestus!";
                        Bert.alert( msg, "danger" );
                        Meteor.call("clientError", msg, Meteor.userId(), error )
                    } else {
                        Meteor.call("clientLog", "Submitting predictions for user: " + userId + " succeeded", Meteor.userId());
                    }
                });
            }
        });

        Bert.alert( "Ennustused uuendatud!", "success" );
    }

    vsFormatter = (cell, row) => {
        return (
            <span className="bf-table-vs">
                <Link to={"/fixtures/" + cell.id}>
                    <img src={cell.homeFlag}/>
                    <span> vs </span>
                    <img src={cell.awayFlag}/>
                </Link>
            </span>
        );
    }

    resultFormatter = (cell, row) => {
        if (!row.locked) {
            return (
                <span className="bf-table-score">
                    <input id="fixture-id" type="hidden" value={cell.id}/>
                    <NumericInput id={"home-score-"+cell.id} min={0} max={99} mobile={true} value={cell.homeGoals} className="input-no-spinner" size={2} onChange={this.scoreChange}/>
                    <span> : </span>
                    <NumericInput id={"away-score-"+cell.id} min={0} max={99} mobile={true} value={cell.awayGoals} className="input-no-spinner" size={2} onChange={this.scoreChange}/>
                </span>
            );
        } else {
            return (
                <span className="bf-table-score">
                    {cell.homeGoals} : {cell.awayGoals} {"(" + (row.status==="FT" ? cell.userPoints + "p" : "-") + ")"}
                </span>
            );
        }
    }

    /*
    onChange - Called with valueAsNumber, valueAsString and the input element. 
    The valueAsNumber represents the internal numeric value while valueAsString 
    is the same as the input value and might be completely different from the 
    numeric one if custom formatting is used.
    */
    scoreChange = (valueAsNumber, valueAsString, input) => {
        // If 0 value is entered, need to explicitly set value to "0" as otherwise it will be not shown
        if (valueAsNumber === 0) {
            input.setValue("0");
        } else {
            input.setValue(valueAsNumber);
        }
    }

    resultFormatterSmall = (cell, row) => {
        let vs = {};

        if (row.vs) {
            vs = row.vs
        }
        
        if (!row.locked) {
            return (
                <div className="bf-table-score container">
                    <div className="row">
                        <input id="fixture-id" type="hidden" value={cell.id}/>
                        <div className="bf-table-small col-xs-6">
                            <Link to={"/fixtures/" + cell.id}>
                                <img src={vs.homeFlag}/>
                            </Link>
                            <br/>
                            <span>{row.homeTeam}</span>
                            <br/>
                            <NumericInput id={"home-score-"+cell.id} min={0} max={99} mobile={true} value={cell.homeGoals} className="input-no-spinner" size={2} onChange={this.scoreChange}/>
                        </div>
                        <div className="bf-table-small col-xs-6">
                            <Link to={"/fixtures/" + cell.id}>
                                <img src={vs.awayFlag}/>
                            </Link>
                            <br/>
                            <span>{row.awayTeam}</span>
                            <br/>
                            <NumericInput id={"away-score-"+cell.id} min={0} max={99} mobile={true} value={cell.awayGoals} className="input-no-spinner" size={2} onChange={this.scoreChange}/>
                        </div>
                    </div>     
                </div>
            );
        } else {
            return (
                <div className="bf-table-score">
                    <Link to={"/fixtures/" + cell.id}>
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
                    </Link>     
                </div>
            );
        }
    }

    render() {
        return (
            <div className='bf-table'>
                <form id="predictions-form" onSubmit={this.handleSubmit}>
                    <Table 
                        data={this.formatPredictionData(this.getPredictionsData(this.props.groupSelected, this.props.currentUser))}
                        keyField={'result.id'}
                        getTableHeaders={this.getTableHeaders}
                    />
                    <div className='bf-right'>    
                        <button id="pred-submit" type="submit" className="btn btn-success bf-table-submit">Salvesta</button>
                    </div>
                </form>
            </div>
        )
    }

}