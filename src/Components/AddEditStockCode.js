import React, { Component } from 'react';
import $ from 'jquery';
import axios from 'axios';


export default class AddEditStockCode extends Component {
    state = {
        allCompanies: [],
        allStockExchanges: [],
        filteredStockExchanges: []
    }

    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getAvailStockExchanges = this.getAvailStockExchanges.bind(this);
        this.mySearchCompanyId = React.createRef();
        this.mySearchStockExchangeId = React.createRef();
    }

    componentDidMount() {

        if (this.props.location.state) {
            this.mySearchStockExchangeId.current.disabled = true
            this.mySearchCompanyId.current.disabled = true
        } else {
            this.mySearchStockExchangeId.current.disabled = true
            const requestOne = axios.get(`${window.base_url}/company/getAllName`, {});
            const requestTwo = axios.get(`${window.base_url}/stockExchange`, {});
            axios.all([requestOne, requestTwo]).then(axios.spread((...responses) => {
                this.setState({
                    allCompanies: responses[0].data,
                    allStockExchanges: responses[1].data
                })
            }))

        }


    }
    handleSubmit(e) {
        e.preventDefault();
        if (this.props.location.state && this.props.location.state?.scode == e.target.elements.stockCodeNo.value) {
            this.props.history.push("/stockCode");
            return;
        }

        let body = {}
        if (this.props.location.state) {
            body = {
                "stockCodeId": this.props.location.state.scid,
                "stockCodeNo": e.target.elements.stockCodeNo.value
            }
        }
        else {
            body = {
                "companyId": this.mySearchCompanyId.current.value,
                "stockExchangeId": this.mySearchStockExchangeId.current.value,
                "stockCodeNo": e.target.elements.stockCodeNo.value
            }

        }

        axios.post(`${window.base_url}/stockCode/addUpdate`, body
        ).then(res => {
            $('.toast-body').html(res.data);
            $('.toast').toast('show');
            this.props.history.push("/stockCode");
        });
    }

    getAvailStockExchanges(e) {
        e.preventDefault();
        this.mySearchStockExchangeId.current.disabled = false
        const companyId = this.mySearchCompanyId.current.value
        axios.post(`${window.base_url}/stockCode/getAll`, { "companyId": companyId })
            .then(res => {
                const companyStockExchangeIds = new Set()
                const filteredStockExchanges = [];
                res.data.map((sc) => companyStockExchangeIds.add(sc.stockExchange.id));
                this.state.allStockExchanges.map((se) => {
                    if (!companyStockExchangeIds.has(se.id)) filteredStockExchanges.push(se);
                })

                this.setState({ filteredStockExchanges: filteredStockExchanges })
            });
    }



    render() {
        return (
            <div class="card container">
                <form onSubmit={this.handleSubmit} action="#" >
                    {this.props.location.state && <h4 class="text-center"> Edit Stock Code</h4>}
                    {!this.props.location.state && <h4 class="text-center"> Add New Stock Code</h4>}
                    <div class="form align-items-center">
                        <label for="select1" class="col-md-2 col-form-label">Select Company :</label>
                        <div class="col-md-4 my-1">
                            <select class="custom-select mr-sm-3 form-control my-1 font-weight-bold" id="select1" ref={this.mySearchCompanyId} onChange={this.getAvailStockExchanges} required>
                                {this.props.location.state && (<option value={this.props.location.state.cid} class="font-weight-bold" selected>{this.props.location.state.cname}</option>)}
                                <option value="" class="font-weight-bold">Company List</option>
                                {!this.props.location.state && this.state.allCompanies.map((c, index) =>
                                    <option value={c.id} key={index}>{c.companyName}</option>
                                )}
                            </select>
                        </div>
                        <label for="select2" class="col-md-5 col-form-label">Available Unlinked Stock Exchanges :</label>
                        <div class="col-md-4 my-1">
                            <select class="custom-select mr-sm-3 form-control my-1 font-weight-bold" id="select2" ref={this.mySearchStockExchangeId} required>
                                {this.props.location.state && (<option value={this.props.location.state.seid} class="font-weight-bold" selected>{this.props.location.state.sename}</option>)}
                                <option value="" class="font-weight-bold">Stock Exchange List</option>
                                {!this.props.location.state && this.state.filteredStockExchanges.map((fs, index) =>
                                    <option value={fs.id} key={index}>{fs.stockExchangeName}</option>
                                )}
                            </select>
                        </div>
                        <div class="form-group col-md-2">
                            <label for="inputStockCode">Stock Code No</label>
                            <input type="number" class="form-control" id="inputStockCode" name="stockCodeNo" defaultValue={this.props.location.state?.scode} required />
                        </div>
                        <div >
                            <div >
                                <button type="submit" class="btn btn-primary">Submit</button>
                            </div>
                        </div>
                    </div>
                </form >

            </div >
        )
    }
}

