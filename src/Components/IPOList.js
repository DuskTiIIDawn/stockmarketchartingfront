import React, { Component } from 'react';
import axios from 'axios';
import $ from 'jquery';
import { Link } from 'react-router-dom';

export default class IPOList extends Component {
    state = {
        ipos: []
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
        axios.get(`${window.base_url}/ipoDetail`, {})
            .then(res => {
                this.setState({ ipos: res.data });
            });
    }

    remove(e) {
        axios.post(`${window.base_url}/ipoDetail/remove`, {
            "ipoDetailId": e.target.getAttribute("ipoid")
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
                {this.props.isAdmin &&
                    <div class="col-md-8 ml-2">
                        <Link to="/ipo/addEdit"><button class="btn btn-success "><i className="fa fa-plus small" ></i> Add IPO</button></Link>
                    </div>
                }
                <div class="text-center mb-5"><h3>IPO List</h3></div>
                {!this.state.ipos.length > 0 && <li>No Records Found</li>}
                {this.state.ipos.length > 0 &&
                    <div class="card container">
                        <table class="table table-sm  ">
                            <thead>
                                <tr>
                                    <th>SNo.</th>
                                    <th>By</th>
                                    <th>Price Per Share(Rs)</th>
                                    <th>Open Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.ipos.map((ipo, index) =>
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{ipo.company.companyName}</td>
                                        <td> {ipo.pricePerShare}</td>
                                        <td>{ipo.openDateTime[2]}/{ipo.openDateTime[1]}/{ipo.openDateTime[0]}
                                            --- {ipo.openDateTime[3]}:{ipo.openDateTime[4]}</td>
                                        <td class="row">
                                            <Link to={{ pathname: "/ipo/info", state: { ipoid: ipo.id } }}><button class="btn btn-secondary mx-1">INFO</button></Link>
                                            {this.props.isAdmin && <div>
                                                <Link to={{ pathname: "ipo/addEdit", state: { ipoid: ipo.id, cid: ipo.company.id } }} ><button class="btn btn-dark mx-1">Edit</button></Link>
                                                <button class="btn btn-danger mx-1" onClick={this.remove} ipoid={ipo.id}>Delete</button>
                                            </div>
                                            }
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                }
            </div >
        )
    }
}

