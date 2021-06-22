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

                <ul class="card container">
                    {!this.state.ipos.length > 0 && <li>No Records Found</li>}
                    {this.state.ipos.map((ipo, index) =>
                        <li class="card " key={index}>
                            <div class="row">
                                <div class="col-md-3">
                                    {index + 1}&nbsp; <strong>BY:</strong> {ipo.company.companyName}
                                </div>
                                <div class="col-md-2">
                                    &nbsp;  {ipo.pricePerShare}<strong>/Share</strong>
                                </div>
                                <div class="col-md-4">
                                    <strong>Open Date:</strong> {ipo.openDateTime[2]}/{ipo.openDateTime[1]}/{ipo.openDateTime[0]}
                                    --- {ipo.openDateTime[3]}:{ipo.openDateTime[4]}
                                </div>
                                <div class="col-md-1">
                                    <Link to={{ pathname: "/ipo/info", state: { ipoid: ipo.id } }}><button class="btn btn-secondary">INFO</button></Link>
                                </div>

                                {this.props.isAdmin &&
                                    <div class=" col-md-2" >
                                        <Link to={{ pathname: "ipo/addEdit", state: { ipoid: ipo.id } }}><button class="btn btn-dark">Edit</button></Link>
                                        <button class="btn btn-danger" onClick={this.remove} ipoid={ipo.id}>Delete</button>
                                    </div>
                                }

                            </div>
                        </li>
                    )}
                </ul>

            </div >
        )
    }
}

