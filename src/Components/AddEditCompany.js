import React, { Component } from 'react';
import $ from 'jquery';
import axios from 'axios';


export default class AddEditCompany extends Component {
    state = {
        company: {}
    }

    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        if (this.props.location.state) {
            axios.post(`${window.base_url}/company/getBasicInfo`, { "companyId": this.props.location.state.cid }).then(res => {
                this.setState({ company: res.data })
            });
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        let url = "#"
        let body = {}
        if (this.props.location.state) {
            url = `${window.base_url}/company/editBasic`
            body = {
                "id": this.props.location.state.cid,
                "companyName": e.target.elements.companyName.value,
                "turnover": e.target.elements.turnover.value,
                "ceo": e.target.elements.ceo.value,
                "boardOfDirectors": e.target.elements.boardOfDirectors.value,
                "companyBrief": e.target.elements.companyBrief.value
            }
        }
        else {
            url = `${window.base_url}/company/add`
            body = {
                "companyName": e.target.elements.companyName.value,
                "turnover": e.target.elements.turnover.value,
                "ceo": e.target.elements.ceo.value,
                "boardOfDirectors": e.target.elements.boardOfDirectors.value,
                "companyBrief": e.target.elements.companyBrief.value
            }
        }

        axios.post(url, body).then(res => {
            $('.toast-body').html(res.data);
            $('.toast').toast('show');
            this.props.history.push("/company");
        });
    }





    render() {
        return (
            <div class="card container">
                <form onSubmit={this.handleSubmit} action="#" >
                    {this.props.location.state && <h4 class="text-center"> Edit Company</h4>}
                    {!this.props.location.state && <h4 class="text-center"> Add Company</h4>}

                    <div class="form-group row">
                        <label for="input1" class="col-sm-2 col-form-label ">Company Name</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" id="input1" placeholder="Company Name" name="companyName" defaultValue={this.state.company?.companyName} required />
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="input2" class="col-sm-2 col-form-label">Turn Over</label>
                        <div class="col-sm-10">
                            <input type="number" step="any" class="form-control" id="input2" placeholder="Turn Over in million $" name="turnover" defaultValue={this.state.company?.turnover} required />
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="input3" class="col-sm-2 col-form-label">CEO</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" id="input3" placeholder="CEO" name="ceo" defaultValue={this.state.company?.ceo} required />
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="input4" class="col-sm-2 col-form-label">Board Of Directors</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" id="input4" placeholder="Board Of Directors" name="boardOfDirectors" defaultValue={this.state.company?.boardOfDirectors} required />
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="input5" class="col-sm-2 col-form-label">Company Brief</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" id="input5" placeholder="Company Brief" name="companyBrief" defaultValue={this.state.company?.companyBrief} required />
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

