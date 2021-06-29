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
        text: "Stock Prices Over different date time"
    },
    series: "Type"
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
            width: "100%",
            height: "100%",
            dataSource
        }
    }
    constructor() {
        super();
        this.mySearchCompanyId = React.createRef();
        this.mySearchStockCodeNo = React.createRef();
        this.myStartDate = React.createRef();
        this.myEndDate = React.createRef();
        this.enableStockExchange = this.enableStockExchange.bind(this);
        this.enableEndDate = this.enableEndDate.bind(this);
        this.getChartData = this.getChartData.bind(this);
        this.toggleToColumnChart = this.toggleToColumnChart.bind(this);
        this.toggleToAreaChart = this.toggleToAreaChart.bind(this);
        this.toggleToLineChart = this.toggleToLineChart.bind(this);
    }
    componentDidMount() {
        this.myEndDate.current.disabled = true
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

    getChartData(e) {
        e.preventDefault();
        if (!this.state.companyStockExchanges) return
        if (this.state.plottedStockCodes.indexOf(this.mySearchStockCodeNo.current.value) != -1) {
            $('.toast-body').html("Company-StockExchange Pair Already Plotted");
            $('.toast').toast('show');
            return
        }


        axios.post(`${window.base_url}/stockPrice/getByStockCode`,
            {
                "stockCodeNo": this.mySearchStockCodeNo.current.value,
                "startDateTime": this.myStartDate.current.value.replace(/T/, " "),
                "endDateTime": this.myEndDate.current.value.replace(/T/, " "),
            })
            .then(res => {
                if (!res.data.stockCodeError) {
                    const companyName = this.mySearchCompanyId.current.childNodes[this.mySearchCompanyId.current.selectedIndex].getAttribute("cname")
                    const stockCodeNo = this.mySearchStockCodeNo.current.value
                    const stockExchangeName = this.state.companyStockExchanges.get(parseInt(stockCodeNo))?.stockExchangeName
                    let data = [];
                    res.data.result?.map((sp, index) => {
                        console.log(sp.dateTime)
                        let dateTime = `${sp.dateTime?.[0]}-${sp.dateTime?.[1]}-${sp.dateTime?.[2]} ${sp.dateTime?.[3]}:${sp.dateTime?.[4]}`;
                        data[index] = [dateTime, companyName + "- " + stockExchangeName, sp.currentPrice];
                    });
                    if (data.length === 0) {
                        $('.toast-body').html("No records Available!");
                        $('.toast').toast('show');
                    }
                    else {
                        if (this.state.timeseriesDs.dataSource.data) {
                            data = [...this.state.timeseriesDs.dataSource.data?._data, ...data]
                        }
                        const fusionTable = new FusionCharts.DataStore().createDataTable(
                            data,
                            schema
                        );
                        const timeseriesDs = Object.assign({}, this.state.timeseriesDs);
                        timeseriesDs.dataSource.data = fusionTable;
                        timeseriesDs.dataSource.yaxis = {
                            plot: {
                                value: "Stock Price Value",
                                type: "line"
                            },
                            format: {
                                prefix: "Rs"
                            },
                            title: "Stock Price"
                        }
                        this.setState({
                            timeseriesDs: timeseriesDs,
                            plottedStockCodes: [...this.state.plottedStockCodes, stockCodeNo]

                        });
                        $('.toast-body').html("Records Plotted Succeefully!");
                        $('.toast').toast('show');
                    }
                }

            });
    }


    toggleToColumnChart() {
        const timeseriesDs = this.state.timeseriesDs;
        timeseriesDs.dataSource.yaxis.plot = { type: "column", value: "Stock Price Value" }
        this.setState({ timeseriesDs: timeseriesDs });
    }
    toggleToAreaChart() {
        const timeseriesDs = this.state.timeseriesDs;
        timeseriesDs.dataSource.yaxis.plot = { type: "area", value: "Stock Price Value" }
        this.setState({ timeseriesDs: timeseriesDs });
    }
    toggleToLineChart() {
        const timeseriesDs = this.state.timeseriesDs;
        timeseriesDs.dataSource.yaxis.plot = { type: "line", value: "Stock Price Value" }
        this.setState({ timeseriesDs: timeseriesDs });
    }

    render() {
        return (
            <div class="overflow-hidden">
                <div class="row " style={{ minHeight: '83vh' }}>
                    <div class=" col col-md-3 col-sm-12 bg-light text-dark" >
                        <div class="container-fluid">
                            <div class="row justify-content-center align-items-center mt-2">
                                <h2>Stock Price Charts</h2>
                            </div>
                            <hr />
                            <div class="row justify-content-center align-items-center">
                                <div class="col col-sm-11 col-md-11 col-lg-11 col-xl-11 ">
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
                                        <div class="form-group row">
                                            <label for="datetimepicker1" class="col-sm-2 col-form-label">From</label>
                                            <div class="col-sm-10">
                                                <input type="datetime-local" class="form-control datetime" id="datetimepicker1" name="startDate" onChange={this.enableEndDate} ref={this.myStartDate} required />
                                            </div>
                                        </div>
                                        <div class="form-group row">
                                            <label for="datetimepicker2" class="col-sm-2 col-form-label">To</label>
                                            <div class="col-sm-10">
                                                <input type="datetime-local" class="form-control datetime" id="datetimepicker2" name="endDate" ref={this.myEndDate} required />
                                            </div>
                                        </div>
                                        <div class="form-group row mb-5">
                                            {this.state.timeseriesDs.dataSource.data && <div class="col"><button class="col-6 btn btn-primary btn-sm float-right" type="submit">ADD MORE</button></div>}
                                            {!this.state.timeseriesDs.dataSource.data && <div class="col"><button class="col-6 btn btn-primary btn-sm float-right" type="submit">PLOT</button></div>}
                                        </div>
                                    </form>
                                    <div class="text-center">
                                        <button onClick={this.toggleToColumnChart} class="btn btn-dark mx-1 my-1" disabled={!this.state.timeseriesDs.dataSource.data}>Column Chart</button>
                                        <button onClick={this.toggleToAreaChart} class="btn btn-dark mx-1 my-1" disabled={!this.state.timeseriesDs.dataSource.data}>Area Chart</button>
                                        <button onClick={this.toggleToLineChart} class="btn btn-dark my-1" disabled={!this.state.timeseriesDs.dataSource.data}>Line Chart</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class=" col col-md-8 col-sm-11" style={{ minHeight: '73vh' }}>
                        < ReactFC {...this.state.timeseriesDs} />
                    </div>
                </div>
            </div>);
    }
}

