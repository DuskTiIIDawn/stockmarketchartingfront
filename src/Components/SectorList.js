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
            "sectorId": e.target.getAttribute("sid")
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
                <div class="col-md-8 ml-2">
                    <Link to={{ pathname: "/sector/addEdit" }}><button class="btn btn-success "><i className="fa fa-plus small" ></i> Sector</button></Link>
                </div>

                <div class="text-center mb-5"><h3>Manage Sectors</h3></div>
                {!this.state.sectors.length > 0 && <li>No Records Found</li>}
                {this.state.sectors.length > 0 &&
                    <div class="card container">
                        <table class="table  table-sm">
                            <thead>
                                <tr>
                                    <th>SNo.</th>
                                    <th>Sector Name</th>
                                    <th>Brief</th>
                                    <th>Actions</th>

                                </tr>
                            </thead>
                            <tbody>
                                {this.state.sectors.map((sector, index) =>
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td> {sector.sectorName}</td>
                                        <td>{sector.brief}</td>
                                        <td> <Link to={{ pathname: "/sector/info", state: { sid: sector.id, sname: sector.sectorName, sbrief: sector.brief } }}><button class="btn btn-secondary ">INFO</button></Link>
                                            <Link to={{ pathname: "/sector/addEdit", state: { sid: sector.id, sname: sector.sectorName, sbrief: sector.brief } }}><button class="btn btn-dark mx-1">Edit</button></Link>
                                            <button class="btn btn-danger mx-1" onClick={this.remove} sid={sector.id}>Delete</button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                }

            </div>
        )
    }
}

