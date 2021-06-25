import React, { Component } from 'react';
import axios from 'axios';

export default class MissingRecords extends Component {
    state = {
        missingRecords: {}
    }
    constructor() {
        super();
        this.getMissingRecords = this.getMissingRecords.bind(this);
        this.enableEndDate = this.enableEndDate.bind(this);
        this.enableStartDate = this.enableStartDate.bind(this);
        this.myEndDate = React.createRef();
        this.myStartDate = React.createRef();

    }
    componentDidMount() {
        this.myStartDate.current.disabled = true
        this.myEndDate.current.disabled = true

    }
    enableStartDate(e) {
        if (e.target.value) {
            this.myStartDate.current.disabled = false
        }
        else {
            this.myStartDate.current.disabled = true
            this.myStartDate.current.value = null
        }
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
    getMissingRecords(e) {
        e.preventDefault();
        axios.post(`${window.base_url}/stockPrice/missingRecords`, {
            "stockCodeNo": e.target.elements.stockCodeNo.value,
            "startDate": e.target.elements.startDate.value,
            "endDate": e.target.elements.endDate.value,
        })
            .then(res => {
                this.setState({ missingRecords: res.data });


            })
    }



    render() {
        return (

            <div>

                <form onSubmit={this.getMissingRecords} action="#"  >
                    <div class="form-inline justify-content-center ">
                        <div class="form-group col-sm-4 row ">
                            <label for="stockCodeInput" class="col-sm-3 col-form-label">Stock Code No :</label>
                            <div class="col-sm-9">
                                <input type="number" class="form-control" id="stockCodeInput" name="stockCodeNo" onChange={this.enableStartDate} required />
                            </div>
                        </div>
                        <div class="form-group col-sm-4 row">
                            <label for="datetimepicker1" class="col-sm-2 col-form-label">From date</label>
                            <div class="col-sm-10">
                                <input type="date" class="form-control datetime" id="datetimepicker1" name="startDate" onChange={this.enableEndDate} ref={this.myStartDate} required />
                            </div>
                        </div>
                        <div class="form-group col-sm-4 row">
                            <label for="datetimepicker2" class="col-sm-2 col-form-label">To date</label>
                            <div class="col-sm-10">
                                <input type="date" class="form-control datetime" id="datetimepicker2" name="endDate" ref={this.myEndDate} required />
                            </div>
                        </div>
                    </div>
                    <div class="text-center "> <button type="submit" class="btn btn-dark">Get Missing Records</button></div>

                </form>


                <ul class="card container">

                    {this.state.missingRecords.stockCodeError}
                    {this.state.missingRecords.dateError}

                    {!this.state.missingRecords.result && <li>No Missing Date Record Between These Two Dates</li>}
                    {this.state.missingRecords.result?.map((r, index) =>
                        <li class="card " key={index}>
                            <div class="row">
                                <div class="col-md-3">
                                    {index + 1}&nbsp;  {r?.[2]}/{r?.[1]}/{r?.[0]}
                                </div>
                                <div class="col-md-6">
                                </div>
                            </div>
                        </li>
                    )}
                </ul>

            </div>


        )
    }
}

