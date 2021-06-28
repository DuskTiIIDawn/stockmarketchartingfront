import React, { Component } from 'react';
import axios from 'axios';

export default class IPO extends Component {
    state = {
        ipo: null
    }

    componentDidMount() {
        axios.post(`${window.base_url}/ipoDetail/info`, {
            "ipoDetailId": this.props.location.state.ipoid
        })
            .then(res => {
                this.setState({ ipo: res.data });

            })
    }

    render() {
        return (

            <div class="card container">
                <div class="card-body">
                    <h4 class="card-title"><strong>By :</strong> &nbsp;{this.state.ipo?.company.companyName}</h4>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item"><strong>Price Per Share :</strong>  {this.state.ipo?.pricePerShare} </li>
                    <li class="list-group-item"><strong>Total No Of Shares :</strong>  {this.state.ipo?.totalNumberOfShares} </li>
                    <li class="list-group-item"><strong>Open Date Time :</strong> {this.state.ipo?.openDateTime[2]}/{this.state.ipo?.openDateTime[1]}/{this.state.ipo?.openDateTime[0]}
                        --- {this.state.ipo?.openDateTime[3]}:{this.state.ipo?.openDateTime[4]}</li>
                </ul>

                {this.state.ipo?.stockExchanges.length > 0 && (
                    <div class="card text-center">

                        <div class="card-body">
                            <h6>Listed in following Stock Exchange:</h6>
                            <ul>
                                {this.state.ipo?.stockExchanges.map((se, index) =>
                                    <li class="card text-left " key={index}>
                                        {index + 1} &nbsp; {se.stockExchangeName}
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

