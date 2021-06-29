import React, { Component } from 'react';
import $ from 'jquery';
import axios from 'axios';


export default class AddEditSector extends Component {

    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleSubmit(e) {
        e.preventDefault();
        let url = "#";
        let body = {}
        if (this.props.location.state) {
            url = `${window.base_url}/sector/editBasic`
            body = {
                "id": this.props.location.state.sid,
                "sectorName": e.target.elements.sectorName.value,
                "brief": e.target.elements.brief.value
            }

        }
        else {
            url = `${window.base_url}/sector/add`
            body = {
                "sectorName": e.target.elements.sectorName.value,
                "brief": e.target.elements.brief.value
            }

        }

        axios.post(url, body)
            .then(res => {
                $('.toast-body').html(res.data);
                $('.toast').toast('show');
                this.props.history.push("/sector");
            });

    }



    render() {
        return (
            <div class="card container">
                <form onSubmit={this.handleSubmit} action="#" >
                    {this.props.location.state && <h4 class="text-center"> Edit Sector</h4>}
                    {!this.props.location.state && <h4 class="text-center"> Add Sector</h4>}

                    <div class="form-group row">
                        <label for="input1" class="col-md-2 col-sm-4 col-form-label">Sector Name</label>
                        <div class="col-md-10 col-sm-8">
                            <input type="text" class="form-control" id="input1" placeholder="Sector Name" name="sectorName" defaultValue={this.props.location.state?.sname} required />
                        </div>
                    </div>

                    <div class="form-group row">
                        <label for="input3" class="col-md-2 col-sm-4 col-form-label">Brief about Sector</label>
                        <div class="col-md-10 col-sm-8">
                            <input type="text" class="form-control" id="input3" placeholder="Sector Brief" name="brief" defaultValue={this.props.location.state?.sbrief} required />
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

