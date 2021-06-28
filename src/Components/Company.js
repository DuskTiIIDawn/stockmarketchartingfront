import React, { Component } from 'react';
import axios from 'axios';


export default class Company extends Component {
    state = {
        company: {}
    }

    componentDidMount() {
        axios.post(`${window.base_url}/company/getDetails`, {
            "companyId": this.props.location.state.cid
        })
            .then(res => {
                const company = res.data;
                this.setState({ company });
            })
    }

    render() {
        return (

            <div class="card container">

                <div class="card-body">
                    <h4 class="card-title">{this.state.company.companyName}</h4>
                    <p class="card-text">{this.state.company.companyBrief}</p>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item"><strong>CEO :</strong>  {this.state.company.ceo} </li>
                    <li class="list-group-item"><strong>Turnover :</strong>  {this.state.company.turnover} Million $</li>
                    <li class="list-group-item"><strong>Board Of Directors :</strong>  {this.state.company.boardOfDirectors}</li>
                    {this.state.company.sector && (<li class="list-group-item"><strong>Sector Name :</strong> {this.state.company.sector.sectorName}</li>)}
                </ul>

                {this.state.company.ipo && (
                    <div class="card text-center">

                        <div class="card-body">
                            <h5 class="card-title">IPO Detail</h5>
                            <p class="card-text">
                                <strong>Price Per Share :</strong> {this.state.company.ipo.pricePerShare}<br></br>
                                <strong>Total No of Share :</strong> {this.state.company.ipo.totalNumberOfShares}<br></br>
                                <strong>Open Date Time :</strong> {this.state.company.ipo.openDateTime[2]}/{this.state.company.ipo.openDateTime[1]}/{this.state.company.ipo.openDateTime[0]}
                                --- {this.state.company.ipo.openDateTime[3]}:{this.state.company.ipo.openDateTime[4]}
                            </p>

                            {this.state.company.ipo.stockExchanges?.length > 0 && <h6>Listed in following Stock Exchange:</h6>}
                            {!this.state.company.ipo.stockExchanges?.length > 0 && <h6>(NOT listed in any stock Exchange)</h6>}
                            <ul>
                                {this.state.company.ipo.stockExchanges.map((se, index) =>
                                    <li class="card text-left" key={index}>
                                        {index + 1} &nbsp; {se.stockExchangeName}
                                    </li>
                                )}
                            </ul>

                        </div>

                    </div>
                )}

                {this.state.company.stockCodes?.length > 0 && (
                    <div class="card text-center">
                        <div class="card-body">
                            <h5 class="card-title">Stock Codes In different Stock Exchanges</h5>
                            <ul>
                                {this.state.company.stockCodes.map((sc, index) =>
                                    <li class="card text-left" key={index}>
                                        {index + 1} &nbsp; {sc.stockCode} ------------------{sc.stockExchange.stockExchangeName}
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

