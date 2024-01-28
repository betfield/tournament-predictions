import React, { Component } from 'react';

export default class Navigation extends Component {

    getNavbarBrand() {
        if(Meteor.settings.public.env === "Preview") {
            return <a className="navbar-brand" href="#page-top">EURO 2024 ENNUSTUSMÄNG</a>
        } else {
            return <a className="navbar-brand" href="#page-top">Registreerunuid: {this.props.userCount}</a>
        }
    }

    render() {
        return (        
            <nav className="navbar navbar-default navbar-fixed-top">
                <div className="container">
                    <div className="navbar-header page-scroll">
                        <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        {this.getNavbarBrand()}
                    </div>

                    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                        <ul className="nav navbar-nav navbar-right">
                            <li className="page-scroll hidden">
                                <a href="#page-top"></a>
                            </li>
                            <li className="page-scroll">
                                <a href="#how-to-play">Kuidas osaleda?</a>
                            </li>
                            <li className="page-scroll">
                                <a href="#rules">Reeglid</a>
                            </li>
                            <li className="page-scroll">
                                <a href="#contact">Kontakt</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        )
    }
}
