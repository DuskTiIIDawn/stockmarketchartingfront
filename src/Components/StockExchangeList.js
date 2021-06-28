import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default class StockExchangeList extends Component {
    state = {
        stockExchanges: []
    }

    constructor() {
        super();
        this.refresh = this.refresh.bind(this);

    }


    componentDidMount() {
        this.refresh();

    }

    refresh() {
        axios.get(`${window.base_url}/stockExchange`, {})
            .then(res => {
                this.setState({ stockExchanges: res.data });

            });
    }






    render() {
        return (
            <div>
                <div class="col-md-8">
                    <Link to={{ pathname: "/stockExchange/addEdit" }}><button class="btn btn-success "><i className="fa fa-plus small" ></i> Stock Exchange</button></Link>
                </div>
                <div class="text-center mb-5"><h3>Manage Stock Exchange</h3></div>
                {!this.state.stockExchanges.length > 0 && <li>No Records Found</li>}
                {this.state.stockExchanges.length > 0 &&
                    <div class="card container">
                        <table class="table  table-sm">
                            <thead>
                                <tr>
                                    <th>SNo.</th>
                                    <th>Name</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.stockExchanges.map((se, index) =>
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{se.stockExchangeName}</td>
                                        <td><Link to={{ pathname: "/stockExchange/info", state: { stockExchangeId: se.id } }}><button class="btn btn-secondary">INFO</button></Link>
                                            <Link to={{ pathname: "stockExchange/addEdit", state: { stockExchangeId: se.id } }}><button class="btn btn-dark mx-1">Edit</button></Link></td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                }

            </div>
        )
    }
}

