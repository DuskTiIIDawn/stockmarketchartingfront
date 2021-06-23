import React, { Component } from 'react';
import axios from 'axios';

export default class CompanyList extends Component {
    state = {
        stockExchange: {}
    }

    componentDidMount() {
        axios.post(`${window.base_url}/stockExchange/info`, {
            "stockExchangeId": this.props.location.state.stockExchangeId
        })
            .then(res => {
                this.setState({ stockExchange: res.data });
            })

    }

    render() {
        return (

            <div class="card container">

                <div class="card-body">
                    <h4 class="card-title">{this.state.stockExchange.stockExchangeName}</h4>
                    <p class="card-text">{this.state.stockExchange.brief}</p>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item"><strong>Contact Address :</strong>  {this.state.stockExchange.contactAddress} </li>
                    <li class="list-group-item"><strong>Remarks :</strong>  {this.state.stockExchange.remarks} </li>


                </ul>


                <div class="card text-center">

                    <div class="card-body">
                        <h5 class="card-title">IPO Detail</h5>
                        {this.state.stockExchange.ipos && this.state.stockExchange.ipos.map((ipo, index) =>
                            <p class="card-text" key={index}>
                                <strong>By Company :</strong> {ipo.company.companyName}<br></br>
                                <strong>Price Per Share :</strong> {ipo.pricePerShare}<br></br>
                                <strong>Total No of Shares :</strong> {ipo.totalNumberOfShares}<br></br>

                                <strong>Open Date Time :</strong> {ipo.openDateTime[2]}/{ipo.openDateTime[1]}/{ipo.openDateTime[0]}
                                --- {ipo.openDateTime[3]}:{ipo.openDateTime[4]}
                            </p>
                        )}
                    </div>

                </div>


                {this.state.stockExchange.stockCodes?.length > 0 && (
                    <div class="card text-center">
                        <div class="card-body">
                            <h5 class="card-title">Stock Codes For different Companies in this Stock Exchange</h5>

                            <ul>
                                {this.state.stockExchange.stockCodes.map((sc, index) =>
                                    <li class="card " key={index}>
                                        <div class="row">
                                            <div class="col-md-5">
                                                {index + 1} &nbsp; ------{sc.stockCode}--------------{sc.company.companyName}
                                            </div>
                                        </div>
                                    </li>
                                )}
                            </ul>

                        </div>
                    </div>
                )}

            </div>


        )
    }
}

