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

                <ul class="card container">
                    {!this.state.stockExchanges.length > 0 && <li>No Records Found</li>}
                    {this.state.stockExchanges.map((se, index) =>
                        <li class="card " key={index}>
                            <div class="row">
                                <div class="col-md-3">
                                    {index + 1}&nbsp;  {se.stockExchangeName}
                                </div>
                                <div class="col-md-6">
                                </div>
                                <div class="col-md-1">
                                    <Link to={{ pathname: "/stockExchange/info", state: { stockExchangeId: se.id } }}><button class="btn btn-secondary">INFO</button></Link>
                                </div>
                                <div class=" col-md-2" >
                                    <Link to={{ pathname: "stockExchange/addEdit", state: { stockExchangeId: se.id } }}><button class="btn btn-dark">Edit</button></Link>

                                </div>

                            </div>
                        </li>
                    )}
                </ul>

            </div>
        )
    }
}

