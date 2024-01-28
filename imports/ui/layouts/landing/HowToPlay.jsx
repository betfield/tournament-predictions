import React, { Component } from 'react';

export default class HowToPlay extends Component {

    render() {
        return (
            <section className="how-to-play" id="how-to-play">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 text-center">
                            <h2>Kuidas osaleda?</h2>
                            <br/>
                        </div>
                    </div>
                    
                    <div className="row mt centered">
                        <div className="col-lg-4">
                            <img src="images/landing/g+.png" width="180" alt="" />
                            <br/>
                            <h4>1 - Registreeri end</h4>
                            <p>Seda saab lihtsalt teha, kui omad kehtivat <strong>Google</strong> kontot.</p>
                        </div>

                        <div className="col-lg-4">
                            <img src="images/landing/pad.png" width="180" alt=""/>
                            <br/>
                            <h4>2 - Täida ennustused</h4>
                            <p>Kui kohe ei oska kõikide mängude tulemusi kirja panna või kahtled oma valikutes, siis muretseda pole vaja - saad hiljem neid kergesti muuta.</p>

                        </div>

                        <div className="col-lg-4">
                            <img src="images/landing/check.png" width="180" alt=""/>
                            <br/>
                            <h4>3 - Kinnita oma osalus</h4>
                            <p>Selleks tuleb üle kanda osavõtu tasu <strong>€25</strong> reeglites näidatud tingimustel. Ja nii lihtne see ongi!</p>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}