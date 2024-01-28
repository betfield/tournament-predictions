import React, { Component } from 'react';

import BootstrapTable from 'react-bootstrap-table-next';

export default class FixturesPredictions extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columnHeaders: this.props.getTableHeaders()
        }
    }

    componentDidMount() {
        window.addEventListener("resize", this.resizeTable);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.resizeTable);
    }

    resizeTable = () => {
        this.setState({
            columnHeaders: this.props.getTableHeaders()
        });
    }

    render() {
        return (
            <div>
                <div className='bf-table-header'></div>
                <div className='bf-table'>
                    <BootstrapTable 
                        keyField= {this.props.keyField } 
                        data={ this.props.data } 
                        columns={ this.state.columnHeaders }
                        rowEvents={this.props.rowEvents}
                        bordered={ true }
                        striped
                        hover
                        condensed
                    />
                </div>
            </div>
        )
    }
}