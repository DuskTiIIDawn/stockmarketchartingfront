import React, { Component } from 'react';
import $ from 'jquery';
import axios from 'axios';



export default class AddEditIPO extends Component {
    state = {
        companyWithoutIpo: [],
        linkedStockCodes: [],
        ipo: {},
    }
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getAvailStockExchanges = this.getAvailStockExchanges.bind(this);
        this.mySearchCompanyId = React.createRef();
        this.mySearchStockExchangeId = React.createRef();
    }


    componentDidMount() {

        /*edit  IPO */
        if (this.props.location.state) {
            const r3 = axios.post(`${window.base_url}/stockCode/getAll`, { "companyId": this.props.location.state.cid });
            const r1 = axios.post(`${window.base_url}/ipoDetail/info`, { "ipoDetailId": this.props.location.state.ipoid });
            axios.all([r1, r3])
                .then(axios.spread((res1, res3) => {
                    /* datetime in right format  0000-00-00T00:00*/
                    res1.data.openDateTime[1] = ('0' + res1.data.openDateTime[1]).slice(-2)
                    res1.data.openDateTime[2] = ('0' + res1.data.openDateTime[2]).slice(-2)
                    res1.data.openDateTime[3] = ('0' + res1.data.openDateTime[3]).slice(-2)
                    res1.data.openDateTime[4] = ('0' + res1.data.openDateTime[4]).slice(-2)
                    res1.data.openDateTime = `${res1.data.openDateTime[0]}-${res1.data.openDateTime[1]}-${res1.data.openDateTime[2]}T${res1.data.openDateTime[3]}:${res1.data.openDateTime[4]}`
                    const selectedStockExchageIds = Array.from(res1.data.stockExchanges, stockExchange => stockExchange.id)
                    this.setState({ ipo: res1.data, linkedStockCodes: res3.data });
                    $("#select2").val(selectedStockExchageIds);
                    $("#select2").selectpicker('refresh');
                }))

        }

        else {
            this.mySearchStockExchangeId.current.disabled = true;
            axios.get(`${window.base_url}/company/withoutIpoAndWithStockCodes`, {}).then(res => {
                this.setState({ companyWithoutIpo: res.data });
                $('#select1').selectpicker('render');
            });
        }
    }

    getAvailStockExchanges(e) {
        e.preventDefault();
        this.mySearchStockExchangeId.current.disabled = false;
        const companyId = this.mySearchCompanyId.current.value;
        axios.post(`${window.base_url}/stockCode/getAll`, { "companyId": companyId })
            .then(res => {
                this.setState({ linkedStockCodes: res.data })
                $("#select2").selectpicker('refresh');
            });

    }

    handleSubmit(e) {
        e.preventDefault()
        let url = `${window.base_url}/ipoDetail/addUpdate`
        let body = {}
        let openDateTime = e.target.elements.openDateTime.value.replace(/T/, " ")
        let stockExchangeIds = Array.from(e.target.elements.stockExchangeIds.selectedOptions, option => parseInt(option.value))
        if (this.props.location.state) {
            body = {
                "ipoDetailId": this.props.location.state.ipoid,
                "pricePerShare": e.target.elements.pricePerShare.value,
                "totalNumberOfShares": e.target.elements.totalNumberOfShares.value,
                "openDateTime": openDateTime,
                "stockExchangeIds": stockExchangeIds
            }

        }
        else {

            body = {
                "pricePerShare": e.target.elements.pricePerShare.value,
                "totalNumberOfShares": e.target.elements.totalNumberOfShares.value,
                "openDateTime": openDateTime,
                "companyId": e.target.elements.companyId.value,
                "stockExchangeIds": stockExchangeIds
            }


        }

        axios.post(url, body)
            .then(res => {
                console.log(body)
                $('.toast-body').html(res.data);
                $('.toast').toast('show');
                this.props.history.push("/ipo");
            });

    }



    render() {
        return (
            <div class="card container">
                <form onSubmit={this.handleSubmit} action="#" >
                    {this.props.location.state && <div class="text-center"><h4 > Edit IPO </h4><p>(<strong>By:</strong>{this.state.ipo.company?.companyName})</p></div>}
                    {!this.props.location.state && <h4 class="text-center"> Add IPO</h4>}

                    <div class="form-group row">
                        <label for="input1" class="col-md-2 col-5 col-form-label">Price Per Share</label>
                        <div class="col-md-10 col-7">
                            <input type="number" step="any" class="form-control" id="input1" placeholder="Price Per share " name="pricePerShare" defaultValue={this.state.ipo.pricePerShare} required />
                        </div>
                    </div>

                    <div class="form-group row">
                        <label for="input3" class="col-5 col-md-2 col-form-label">Total No of shares</label>
                        <div class="col-7 col-md-10">
                            <input type="number" class="form-control" id="input3" placeholder="Total no of shares" name="totalNumberOfShares" defaultValue={this.state.ipo.totalNumberOfShares} required />
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="datetimepicker1" class="col-5 col-md-2 col-form-label">Open date</label>
                        <div class="col-7 col-md-10">
                            <input type="datetime-local" class="form-control datetime" id="datetimepicker1" placeholder="Open Date time" name="openDateTime" defaultValue={this.state.ipo.openDateTime} required />
                        </div>
                    </div>

                    <div class="form align-items-center">
                        {!this.props.location.state &&
                            <div class="col-12">
                                <label for="select1" class="col-12 col-form-label">Select Company (...Companies without IPO And With Stock Codes...):</label>
                                <div class="row">
                                    <div class="col-md-4 col-10 my-1">
                                        <select class=" custom-select mr-sm-3 form-control my-1 " id="select1" name="companyId" ref={this.mySearchCompanyId} onChange={this.getAvailStockExchanges} required>
                                            <option value="" class="font-weight-bold">Company List</option>
                                            {this.state.companyWithoutIpo.map((c, index) =>
                                                <option value={c.id} key={index}>{c.companyName}</option>
                                            )}
                                        </select>

                                    </div>
                                </div>
                            </div>
                        }
                        <label for="select2" class="col-5 col-form-label">Linked Stock Exchanges :</label>
                        <div class="col-md-4 col-10  my-1">
                            <select multiple class="selectpicker mr-sm-3 form-control my-1 font-weight-bold" id="select2" name="stockExchangeIds" ref={this.mySearchStockExchangeId} >
                                {this.state.linkedStockCodes.map((sc, index) =>
                                    <option key={index} value={sc.stockExchange.id} >{sc.stockExchange.stockExchangeName}</option>
                                )}
                            </select>
                        </div>

                        <div >
                            <div >
                                <button type="submit" class="btn btn-primary">Submit</button>
                            </div>
                        </div>
                    </div>
                </form>

            </div>
        )
    }
}

