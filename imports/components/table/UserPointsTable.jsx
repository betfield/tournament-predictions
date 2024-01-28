import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Table from '../../ui/layouts/portal/table/Table';

export default class UserPointsTable extends Component {

    getTableHeaders = () => {
        let columnHeaders = [
            {
                text: 'Id',
                dataField: 'id',
                sort: false,
                headerAlign: 'center',
                hidden: true
            },
            {
                text: 'Pos',
                dataField: 'pos',
                sort: true,
                headerAlign: 'center'
            }, {
                text: 'Kasutaja',
                dataField: 'user',
                sort: true,
                headerAlign: 'center',
                formatter: this.userFormatter
            }, {
                text: 'I',
                dataField: 'round1',
                sort: true,
                headerAlign: 'center'
            }, {
                text: 'II',
                dataField: 'round2',
                sort: true,
                headerAlign: 'center'
            }, {
                text: 'III',
                dataField: 'round3',
                sort: true,
                headerAlign: 'center'
            }, {
                text: 'IV',
                dataField: 'round4',
                sort: true,
                headerAlign: 'center'
            }, {
                text: 'V',
                dataField: 'round5',
                sort: true,
                headerAlign: 'center'
            }, {
                text: 'VI',
                dataField: 'round6',
                sort: true,
                headerAlign: 'center'
            }, {
                text: 'VII',
                dataField: 'round7',
                sort: true,
                headerAlign: 'center'
            }, {
                text: 'Kokku',
                dataField: 'total',
                sort: true,
                headerAlign: 'center'
            }
        ];
        
        if ($(window).width() < 769) {
            columnHeaders[1].sort = false; 
            columnHeaders[2].sort = false;
            columnHeaders[3].hidden = true;
            columnHeaders[4].hidden = true;
            columnHeaders[5].hidden = true;
            columnHeaders[6].hidden = true;
            columnHeaders[7].hidden = true;
            columnHeaders[8].hidden = true;
            columnHeaders[9].hidden = true;
            columnHeaders[10].sort = false;
        } else if ($(window).width() < 1281) {
            columnHeaders[1].sort = false; 
            columnHeaders[2].sort = false;
            columnHeaders[2].formatter = this.userFormatterSlim;
            columnHeaders[3].sort = false;
            columnHeaders[4].sort = false;
            columnHeaders[5].sort = false;
            columnHeaders[6].sort = false;
            columnHeaders[7].sort = false;
            columnHeaders[8].sort = false;
            columnHeaders[9].sort = false;
            columnHeaders[10].sort = false;
        }

        return columnHeaders;
    }

    getUserPointsData = (points) => {
        let data = [];

        points.forEach(e => {
            data.push({
                id: e.user._id,
                pos: e.user.pos,
                user: e.user.team,
                pic: e.user.picture,
                round1: e.round1,
                round2: e.round2,
                round3: e.round3,
                round4: e.round4,
                round5: e.round5,
                round6: e.round6,
                round7: e.round7,
                total: e.total
            });  
        });

        data.sort(function (a, b) {
            return a.pos - b.pos;
        });

        return data;
    }
  
    userFormatter = (cell, row) => {
        return (
            <div className="bf-table-points-user">
                <Link to={"/predictions/" + row.id}>
                    <span>
                        <img className="img-circle m-b" src={row.pic} title={cell}/>
                        {cell}
                    </span>
                </Link>
            </div>
        )
    }

    userFormatterSlim = (cell, row) => {
        return (
            <div className="bf-table-points-user">
                <Link to={"/predictions/" + row.id}>
                    <img className="img-circle m-b" src={row.pic} title={cell}/>
                </Link>
            </div>
        )
    }

    render() {

        return (
            <Table 
                data={this.getUserPointsData(this.props.points)}
                keyField={'id'}
                getTableHeaders={this.getTableHeaders}
            />
        )
    }
}