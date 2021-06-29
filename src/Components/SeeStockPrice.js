import React, { Component } from 'react';
import axios from 'axios';
import $ from 'jquery';

export default class SeeStockPrice extends Component {
    state = {
        allStockPrices: {},
        stockCodeInfo: null,
        lockedStartDate: null,
        lockedEndDate: null

    }
    constructor() {
        super();
        this.getStockPricesBetweenDates = this.getStockPricesBetweenDates.bind(this);
        this.enableEndDate = this.enableEndDate.bind(this);
        this.enableStartDate = this.enableStartDate.bind(this);
        this.remove = this.remove.bind(this);
        this.myEndDate = React.createRef();
        this.myStartDate = React.createRef();

    }
    componentDidMount() {
        this.myStartDate.current.disabled = true
        this.myEndDate.current.disabled = true

    }
    enableStartDate(e) {
        e.preventDefault();
        axios.post(`${window.base_url}/stockPrice/getByStockCode`, {
            "stockCodeNo": e.target.value,
        }).then(res => {
            this.setState({ allStockPrices: res.data });
            if (res.data.result) {
                $('.toast-body').html(`${res.data.result.length} Records Fetched`);
                $('.toast').toast('show');
            }

            if (!res.data.stockCodeError) {
                this.myStartDate.current.disabled = false
                axios.post(`${window.base_url}/stockCode/getInfo`, {
                    "stockCodeNo": e.target.value,
                }).then(res2 => {
                    this.setState({ stockCodeInfo: res2.data });
                })

            } else {
                this.setState({ stockCodeInfo: null });
                this.myStartDate.current.disabled = true
                this.myStartDate.current.value = null
            }
        })
    }

    enableEndDate(e) {
        if (e.target.value) {
            this.myEndDate.current.disabled = false
            this.myEndDate.current.min = e.target.value
        }
        else {
            this.myEndDate.current.disabled = true
            this.myEndDate.current.value = null
        }
    }
    getStockPricesBetweenDates(e) {
        e.preventDefault();
        let startDate = e.target.elements.startDate.value.replace(/T/, " ")
        let endDate = e.target.elements.endDate.value.replace(/T/, " ")
        axios.post(`${window.base_url}/stockPrice/getByStockCode`, {
            "stockCodeNo": e.target.elements.stockCodeNo.value,
            "startDateTime": startDate,
            "endDateTime": endDate
        })
            .then(res => {
                this.setState({ allStockPrices: res.data, lockedStartDate: startDate, lockedEndDate: endDate });
                $('.toast-body').html("Record List updated");
                $('.toast').toast('show');

            })
    }

    remove(e) {
        let body;
        if (this.state.lockedStartDate && this.state.lockedEndDate) {
            body = {
                "stockCodeNo": this.state.stockCodeInfo?.stockCode,
                "startDateTime": this.state.lockedStartDate,
                "endDateTime": this.state.lockedEndDate,
            }
        }
        else {
            body = {
                "stockCodeNo": this.state.stockCodeInfo?.stockCode,
            }
        }
        axios.post(`${window.base_url}/stockPrice/removeByStockCode`, body)
            .then(res => {
                this.setState({ allStockPrices: res.data });
                $('.toast-body').html(`${res.data} Records deleted`);
                $('.toast').toast('show');
            })
    }



    render() {
        return (

            <div>
                <form onSubmit={this.getStockPricesBetweenDates} action="#"  >
                    <div class="form-inline justify-content-center row">
                        <div class="form-group col-md-4  row ">
                            <label for="stockCodeInput" class="col-4 col-form-label">Stock Code No :</label>
                            <div class="col-8">
                                <input type="number" class="form-control" id="stockCodeInput" name="stockCodeNo" onChange={this.enableStartDate} required />
                            </div>
                        </div>
                        <div class="form-group col-md-4   row">
                            <label for="datetimepicker1" class="col-2 col-form-label">From date</label>
                            <div class="col-6">
                                <input type="datetime-local" class="form-control datetime" id="datetimepicker1" name="startDate" onChange={this.enableEndDate} ref={this.myStartDate} required />
                            </div>
                        </div>
                        <div class="form-group col-md-4   row">
                            <label for="datetimepicker2" class="col-2 col-form-label">To date</label>
                            <div class="col-6">
                                <input type="datetime-local" class="form-control datetime" id="datetimepicker2" name="endDate" ref={this.myEndDate} required />
                            </div>
                        </div>
                    </div>
                    <div class="text-center  mt-2"> <button type="submit" class="btn btn-dark">Sort Stock Price Records</button></div>

                </form>


                {this.state.stockCodeInfo &&

                    <div class="container card">
                        <div class="text-center">
                            <strong>{this.state.stockCodeInfo?.stockCode}</strong><br></br>
                            BY:   {this.state.stockCodeInfo?.company.companyName}<br></br>
                            IN:   {this.state.stockCodeInfo?.stockExchange.stockExchangeName}

                        </div>
                    </div>
                }

                <div class="text-center">
                    {this.state.allStockPrices.stockCodeError}
                    {this.state.allStockPrices.result?.length == 0 && <li>No Records to Show</li>}
                </div>


                {this.state.allStockPrices.result?.length > 0 &&
                    <div class="container">
                        <div className="table-responsive">
                            <div class="text-right">
                                <button class="btn btn-danger" onClick={this.remove}>Delete Current List</button>
                            </div>
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Current Price</th>
                                        <th> Date (DD-MM-YYYY)</th>
                                        <th>Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.allStockPrices.result?.map((r, i) => (

                                        <tr key={i}>
                                            <td>{Math.round(r.currentPrice * 100) / 100}</td>
                                            <td>{r.dateTime?.[2]}/{r.dateTime?.[1]}/{r.dateTime?.[0]}</td>
                                            <td>{r.dateTime?.[3]}:{r.dateTime?.[4]}</td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                }
            </div>



        )
    }
}

