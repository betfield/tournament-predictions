import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Rules extends Component {

    render() {
        return (
            <section className="rules" id="rules">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 text-center">
                            <h2>Reeglid lühidalt</h2>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-4 col-lg-offset-2">
                            <ul>
                                <li>
                                    Mängus osalemise eelduseks on õigeks ajaks laekunud osavõtumaks, vastavalt reeglites toodud juhistele.
                                </li>
                                <li>
                                    Ennustatakse turniiri iga mängu <u>normaalaja</u> täpset skoori.
                                </li>
                                <li>
                                    Ennustus on jagatud seitsmeks (7) vooruks, vastavalt sellele kui palju mänge peab üks meeskond läbima, et tulla Euroopa meistriks.
                                </li>
                                <li>
                                    Iga voor lukustub 1h enne selle vooru esimese mängu algust, st antud vooru ennustusi pole peale seda võimalik enam muuta.
                                </li>
                            </ul>
                        </div>
                        <div className="col-lg-4">
                            <ul>
                                <li>
                                    Täpse skoori õigesti ennustamine annab kokku 5p. Mängu võitja õigesti ennustamise eest saab 2p ning õige väravatevahe lisaks 1p. Viigi õigesti ennustamine annab 3p.
                                </li>
                                <li>
                                    Veerand- ja poolfinaalide tulemused on võimendatud 2x, finaali tulemus 3x.
                                </li>
                                <li>
                                    Auhinnafond jaotatakse vastavalt üldisele paremusjärjestusele. Lisaks eriauhinnad üksikute voorude võitjatele.  
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="row">
                        <br/>
                        <div className="col-lg-8 col-lg-offset-2 text-center page-scroll">
                            <h3>Tekkis huvi?</h3>
                            <Link to="/rules" className="btn btn-lg btn-outline">Reeglitest pikemalt siin</Link>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}