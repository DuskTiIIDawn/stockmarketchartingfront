import React, { Component } from 'react';
import $ from 'jquery';
import axios from 'axios';


export default class AddEditStockExchange extends Component {
    state = {
        stockExchange: {}
    }

    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        if (this.props.location.state) {
            axios.post(`${window.base_url}/stockExchange/getBasicInfo`, { "stockExchangeId": this.props.location.state.stockExchangeId }).then(res => {
                this.setState({ stockExchange: res.data })
            });
        }
    }

    handleSubmit(e) {
        let url = "#"
        let body = {}
        if (this.props.location.state) {
            url = `${window.base_url}/stockExchange/editBasic`
            body = {
                "id": this.props.location.state.stockExchangeId,
                "stockExchangeName": e.target.elements.stockExchangeName.value,
                "brief": e.target.elements.brief.value,
                "contactAddress": e.target.elements.contactAddress.value,
                "remarks": e.target.elements.remarks.value
            }
        }
        else {
            url = `${window.base_url}/stockExchange/add`
            body = {
                "stockExchangeName": e.target.elements.stockExchangeName.value,
                "brief": e.target.elements.brief.value,
                "contactAddress": e.target.elements.contactAddress.value,
                "remarks": e.target.elements.remarks.value
            }
        }
        e.preventDefault();
        axios.post(url, body).then(res => {
            $('.toast-body').html(res.data);
            $('.toast').toast('show');
            this.props.history.push("/stockExchange");
        });
    }





    render() {
        return (
            <div class="card container">
                <form onSubmit={this.handleSubmit} action="#">
                    {this.props.location.state && <h4 class="text-center"> Edit Stock Exchange</h4>}
                    {!this.props.location.state && <h4 class="text-center"> Add Stock Exchange</h4>}

                    <div class="form-group row">
                        <label for="input1" class="col-sm-2 col-form-label ">Stock Exchange Name</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" id="input1" placeholder="Stock Exchage Name" name="stockExchangeName" defaultValue={this.state.stockExchange?.stockExchangeName} required />
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="input2" class="col-sm-2 col-form-label">Brief</label>
                        <div class="col-sm-10">
                            <input type="text" step="any" class="form-control" id="input2" placeholder="brief" name="brief" defaultValue={this.state.stockExchange?.brief} required />
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="input3" class="col-sm-2 col-form-label">Contact Address</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" id="input3" placeholder="Contact Address" name="contactAddress" defaultValue={this.state.stockExchange?.contactAddress} required />
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="input4" class="col-sm-2 col-form-label">Remarks</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" id="input4" placeholder="Remark" name="remarks" defaultValue={this.state.stockExchange?.remarks} required />
                        </div>
                    </div>
                    <div class="form-group row">
                        <div class="col-sm-10">
                            <button type="submit" class="btn btn-primary" >Submit</button>
                        </div>
                    </div>
                </form>

            </div>
        )
    }
}

