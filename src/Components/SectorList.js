import React, { Component } from 'react';
import $ from 'jquery';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default class SectorList extends Component {
    state = {
        sectors: []
    }

    constructor() {
        super();
        this.refresh = this.refresh.bind(this);
        this.remove = this.remove.bind(this);
    }


    componentDidMount() {
        this.refresh();
    }

    refresh() {
        axios.get(`${window.base_url}/sector`, {})
            .then(res => {
                const sectors = res.data;
                this.setState({ sectors });
            });
    }

    remove(e) {
        axios.post(`${window.base_url}/sector/remove`, {
            "sectorId": e.target.parentNode.getAttribute("sid")
        })
            .then(res => {
                $('.toast-body').html(res.data);
                $('.toast').toast('show');
                this.refresh();
            });
    }




    render() {
        return (
            <div>
                <div class="col-md-8">
                    <Link to={{ pathname: "/sector/addEdit" }}><button class="btn btn-success "><i className="fa fa-plus small" ></i> Sector</button></Link>
                </div>

                <ul class="card container">
                    {!this.state.sectors.length > 0 && <li>No Records Found</li>}
                    {this.state.sectors.map((sector, index) =>
                        <li class="card " key={index}>
                            <div class="row">
                                <div class="col-md-3">
                                    {index + 1}&nbsp;  {sector.sectorName}
                                </div>
                                <div class="col-md-6">
                                    ({sector.brief})
                                </div>
                                <div class="col-md-1">
                                    <Link to={{ pathname: "/sector/info", state: { sid: sector.id, sname: sector.sectorName, sbrief: sector.brief } }}><button class="btn btn-secondary">INFO</button></Link>
                                </div>
                                <div class=" col-md-2" sid={sector.id}>
                                    <Link to={{ pathname: "/sector/addEdit", state: { sid: sector.id, sname: sector.sectorName, sbrief: sector.brief } }}><button class="btn btn-dark">Edit</button></Link>
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

