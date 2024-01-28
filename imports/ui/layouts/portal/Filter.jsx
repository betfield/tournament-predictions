import React, { Component } from 'react';

export default class Filter extends Component {

    groupSelect = (e) => {
        let id = e.target.id;

        this.props.selectGroup(id);
        $("[id='" + id + "']").addClass("fc-state-active").siblings().removeClass("fc-state-active");
    }

    render() {

        return (
            <div className="group-select fc-button-group">
                <button id="I" type="button" className="fc-button fc-state-default fc-corner-left fc-state-active" onClick={this.groupSelect}>I</button>
                <button id="II" type="button" className="fc-button fc-state-default" onClick={this.groupSelect}>II</button>
                <button id="III" type="button" className="fc-button fc-state-default" onClick={this.groupSelect}>III</button>
                <button id="IV" type="button" className="fc-button fc-state-default" onClick={this.groupSelect}>IV</button>
                <button id="V" type="button" className="fc-button fc-state-default" onClick={this.groupSelect}>V</button>
                <button id="VI" type="button" className="fc-button fc-state-default" onClick={this.groupSelect}>VI</button>
                <button id="VII" type="button" className="fc-button fc-state-default fc-corner-right" onClick={this.groupSelect}>VII</button>
            </div>
        )
    }
}
