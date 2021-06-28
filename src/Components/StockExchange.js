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

                {this.state.stockExchange.ipos &&
                    <div class="card container mt-2">
                        <h5 class="text-center">IPO list</h5>
                        <table class="table  table-sm">
                            <thead>
                                <tr>
                                    <th>SNo.</th>
                                    <th>By Company </th>
                                    <th>Price Per Share :</th>
                                    <th>Total No of Shares :</th>
                                    <th>Open Date Time :</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.stockExchange.ipos.map((ipo, index) =>
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{ipo.company.companyName}</td>
                                        <td>{ipo.pricePerShare}</td>
                                        <td>{ipo.totalNumberOfShares}</td>
                                        <td>{ipo.openDateTime[2]}/{ipo.openDateTime[1]}/{ipo.openDateTime[0]}
                                            ---{ipo.openDateTime[3]}:{ipo.openDateTime[4]}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                }


                {this.state.stockExchange.stockCodes?.length > 0 && (
                    <div class="card text-center mt-2">
                        <div class="card-body">
                            <h5 class="card-title">Stock Codes for different Companies in this Stock Exchange</h5>
                            <ul>
                                {this.state.stockExchange.stockCodes.map((sc, index) =>
                                    <li class="card text-left " key={index}>
                                        {index + 1} &nbsp; ------{sc.stockCode}-------------{sc.company.companyName}
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

