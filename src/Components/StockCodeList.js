import React, { Component } from 'react';
import $ from 'jquery';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default class StockCodeList extends Component {
    state = {
        stockCodes: [],
        uniqueCompanies: [],
        uniqueStockExchanges: []
    }

    constructor() {
        super();
        this.mySearchCompanyId = React.createRef();
        this.mySearchStockExchangeId = React.createRef();
        this.refresh = this.refresh.bind(this);
        this.remove = this.remove.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    componentDidMount() {
        this.refresh();

    }

    refresh() {
        axios.post(`${window.base_url}/stockCode/getAll`, {})
            .then(res => {
                const uniqueCompanies = [];
                const uniqueStockExchanges = [];
                const uniqueCompaniesId = new Set();
                const uniqueStockExchangeIds = new Set();
                res.data.map((sc) => {
                    if (!uniqueCompaniesId.has(sc.company.id)) {
                        uniqueCompanies.push(sc.company)
                        uniqueCompaniesId.add(sc.company.id)
                    }
                    if (!uniqueStockExchangeIds.has(sc.stockExchange.id)) {
                        uniqueStockExchanges.push(sc.stockExchange)
                        uniqueStockExchangeIds.add(sc.stockExchange.id)
                    }
                });

                this.setState({ uniqueCompanies: uniqueCompanies, uniqueStockExchanges: uniqueStockExchanges, stockCodes: res.data })
            });
    }


    handleSubmit(e) {

        let body = {}
        const companyId = this.mySearchCompanyId.current.value
        const stockExchangeId = this.mySearchStockExchangeId.current.value
        if (companyId === "**" && stockExchangeId === "**") {
            this.refresh();
            return;
        }
        else if (companyId === "**") {
            body = { "stockExchangeId": stockExchangeId }

        }
        else if (stockExchangeId === "**") {
            body = {
                "companyId": companyId
            }

        }
        else {
            body = {
                "companyId": companyId,
                "stockExchangeId": stockExchangeId
            }

        }

        axios.post(`${window.base_url}/stockCode/getAll`, body)
            .then(res => {
                this.setState({ stockCodes: res.data })
            });
    }


    remove(e) {
        axios.post(`${window.base_url}/stockCode/remove`, {
            "stockCodeId": e.target.parentNode.getAttribute("scid")
        })
            .then(res => {
                this.refresh();
                $('.toast-body').html(res.data);
                $('.toast').toast('show');

            });
    }






    render() {
        return (
            <div>
                <div class="row">
                    <div class="col-md-5">
                        <Link to={{ pathname: "/stockCode/addEdit" }}><button class="btn btn-success "><i className="fa fa-plus small" ></i> Stock Code</button></Link>
                    </div>

                    <form onChange={this.handleSubmit} action="#" method="post" >
                        <div class="form-row align-items-center">
                            <div class="col-sm-2 my-1">
                                <h5>Select :</h5>
                            </div>
                            <div class="col-sm-4 my-1">
                                <select class="custom-select mr-sm-3 form-control my-1 font-weight-bold" ref={this.mySearchCompanyId} required>
                                    <option value="**" class="font-weight-bold">All Companies</option>
                                    {this.state.uniqueCompanies.map((uc, index) =>
                                        <option value={uc.id} key={index}>{uc.companyName}</option>
                                    )}
                                </select>
                            </div>
                            <div class="col-sm-4 my-1">
                                <select class="custom-select mr-sm-3 form-control my-1 font-weight-bold" ref={this.mySearchStockExchangeId} required>
                                    <option value="**" class="font-weight-bold">All Stock Exchange</option>
                                    {this.state.uniqueStockExchanges.map((us, index) =>
                                        <option value={us.id} key={index}>{us.stockExchangeName}</option>
                                    )}
                                </select>
                            </div>
                        </div>
                    </form>
                </div>

                <ul class="card container">
                    {!this.state.stockCodes.length && <li>No Records Found</li>}
                    {this.state.stockCodes.map((sc, index) =>
                        <li class="card " key={index}>
                            <div class="row">
                                <div class="col-md-3">
                                    {index + 1}------&nbsp;  {sc.stockCode}
                                </div>
                                <div class="col-md-6">
                                    {sc.company.companyName}&nbsp;
                                    <strong>Listed in: </strong>{sc.stockExchange.stockExchangeName}
                                </div>

                                <div class=" col-md-3 text-right" scid={sc.id}>
                                    <Link to={{
                                        pathname: "/stockCode/addEdit", state: {
                                            cid: sc.company.id, cname: sc.company.companyName,
                                            seid: sc.stockExchange.id, sename: sc.stockExchange.stockExchangeName, scode: sc.stockCode, scid: sc.id
                                        }
                                    }}><button class="btn btn-dark">Edit</button></Link>
                                    <button class="btn btn-danger" onClick={this.remove}>Delete</button>
                                </div>

                            </div>
                        </li>
                    )}
                </ul>

            </div>
        )
    }
}

