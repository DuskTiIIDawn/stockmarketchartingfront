import React, { Component } from 'react';
import ReactFC from 'react-fusioncharts';
import FusionCharts from 'fusioncharts';
import TimeSeries from 'fusioncharts/fusioncharts.timeseries';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';


import $ from 'jquery';
import axios from 'axios';


// STEP 3- Construct the dataset comprising combination series

ReactFC.fcRoot(FusionCharts, TimeSeries, FusionTheme);


const dataSource = {

    caption: {
        text: "Stock Price Analysis"
    },
    subcaption: {
        text: "Stock Prices Over different time"
    },
    series: "Type",
    yaxis: [
        {
            plot: {
                connectnulldata: true,
                style: {
                    "plot.null": {
                        "stroke-dasharray": "none",
                        stroke: "#FF0000"
                    }
                }
            },
            format: {
                prefix: "Rs"
            },
            title: "Stock Price"
        }
    ]

};


const schema = [{
    "name": "Time",
    "type": "date",
}, {
    "name": "Type",
    "type": "string"
}, {
    "name": "Stock Price Value",
    "type": "number"
}];



export default class Chart extends Component {
    state = {
        uniqueCompanies: [],
        companyStockExchanges: null,
        plottedStockCodes: [],
        timeseriesDs: {
            type: "timeseries",
            renderAt: "container",
            width: "800",
            height: "500",
            dataSource
        }
    }
    constructor() {
        super();
        this.mySearchCompanyId = React.createRef();
        this.mySearchStockCodeNo = React.createRef();
        this.enableStockExchange = this.enableStockExchange.bind(this);
        this.getChartData = this.getChartData.bind(this);
    }
    componentDidMount() {
        axios.post(`${window.base_url}/stockCode/getAll`, {})
            .then(res => {
                const uniqueCompanies = [];
                const uniqueCompaniesId = new Set();
                res.data.map((sc) => {
                    if (!uniqueCompaniesId.has(sc.company.id)) {
                        uniqueCompanies.push(sc.company)
                        uniqueCompaniesId.add(sc.company.id)
                    }
                });
                this.setState({ uniqueCompanies: uniqueCompanies })
            });
    }

    enableStockExchange(e) {
        axios.post(`${window.base_url}/stockCode/getAll`, { "companyId": e.target.value })
            .then(res => {
                const companyStockExchanges = new Map();
                res.data.map((sc) => {
                    companyStockExchanges.set(sc.stockCode, sc.stockExchange)
                });
                this.setState({ companyStockExchanges: companyStockExchanges })
            });

    }

    getChartData(e) {
        e.preventDefault();
        if (!this.state.companyStockExchanges) return
        if (this.state.plottedStockCodes.indexOf(this.mySearchStockCodeNo.current.value) != -1) {
            $('.toast-body').html("Company-StockExchange Pair Already Plotted");
            $('.toast').toast('show');
            return
        }

        axios.post(`${window.base_url}/stockPrice/getByStockCode`, { "stockCodeNo": this.mySearchStockCodeNo.current.value })
            .then(res => {
                if (!res.data.stockCodeError) {
                    $('.toast-body').html("Values Are Being Plotted.......");
                    $('.toast').toast('show');
                    const companyName = this.mySearchCompanyId.current.childNodes[this.mySearchCompanyId.current.selectedIndex].getAttribute("cname")
                    const stockCodeNo = this.mySearchStockCodeNo.current.value
                    const stockExchangeName = this.state.companyStockExchanges.get(parseInt(stockCodeNo))?.stockExchangeName
                    let data = []
                    res.data.result?.map((sp, index) => {
                        data[index] = [sp.dateTime?.replace(/T/, " "), companyName + "- " + stockExchangeName, sp.currentPrice];
                    });

                    if (this.state.timeseriesDs.dataSource.data)
                        data = [...data, ...this.state.timeseriesDs.dataSource.data?._data]


                    const fusionTable = new FusionCharts.DataStore().createDataTable(
                        data,
                        schema
                    );
                    const timeseriesDs = Object.assign({}, this.state.timeseriesDs);
                    timeseriesDs.dataSource.data = fusionTable;
                    this.setState({
                        timeseriesDs: timeseriesDs,
                        plottedStockCodes: [...this.state.plottedStockCodes, stockCodeNo]

                    });

                }

            });
    }

    render() {
        return (
            <div>
                <div class="container-fluid h-100 bg-light text-dark">
                    <div class="row justify-content-center align-items-center">
                        <h1>Stock Price Charts</h1>
                    </div>
                    <hr />
                    <div class="row justify-content-center align-items-center h-100">
                        <div class="col col-sm-6 col-md-6 col-lg-4 col-xl-3">
                            <form action="#" onSubmit={this.getChartData}>
                                <div class="form-group">
                                    <select class="custom-select mr-sm-3 form-control my-1 font-weight-bold" ref={this.mySearchCompanyId} onChange={this.enableStockExchange} required>
                                        <option value="" class="font-weight-bold">All Companies</option>
                                        {this.state.uniqueCompanies.map((uc, index) =>
                                            <option value={uc.id} key={index} cname={uc.companyName}>{uc.companyName}</option>
                                        )}
                                    </select>
                                </div>
                                <div class="form-group">
                                    <select class="custom-select mr-sm-3 form-control my-1 font-weight-bold" ref={this.mySearchStockCodeNo} required>
                                        <option value="" class="font-weight-bold">Listed In Stock Exchange</option>
                                        {this.state.companyStockExchanges && [...this.state.companyStockExchanges.keys()].map((k, index) =>
                                            <option value={k} key={index}>{this.state.companyStockExchanges.get(k).stockExchangeName}</option>
                                        )}
                                    </select>
                                </div>
                                <div class="form-group">
                                    <div class="container">
                                        <div class="row">
                                            {this.state.timeseriesDs.dataSource.data && <div class="col"><button class="col-6 btn btn-primary btn-sm float-right" type="submit">ADD MORE</button></div>}
                                            {!this.state.timeseriesDs.dataSource.data && <div class="col"><button class="col-6 btn btn-primary btn-sm float-right" type="submit">PLOT</button></div>}

                                        </div>
                                    </div>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
                <div class="text-center">
                    < ReactFC {...this.state.timeseriesDs} />
                </div>
            </div>);
    }
}

