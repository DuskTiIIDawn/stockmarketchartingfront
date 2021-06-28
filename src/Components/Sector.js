import React, { Component } from 'react';

import axios from 'axios';

export default class Sector extends Component {
    state = {
        sectorCompanies: []
    }

    constructor() {
        super();
        this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    }

    componentDidMount() {
        axios.post(`${window.base_url}/sector/getCompanies`, {
            "sectorId": this.props.location.state.sid
        })
            .then(res => {
                this.setState({ sectorCompanies: res.data });
            })


    }

    handleSearchSubmit(e) {
        e.preventDefault();
        axios.post(`${window.base_url}/sector/getCompanies`, { "search": e.target.value, "sectorId": this.props.location.state.sid })
            .then(res => {
                this.setState({ sectorCompanies: res.data });
            });

    }

    render() {
        return (
            <div>
                <div class="card" style={{ width: "18 rem" }}>
                    {this.state.sectorCompanies && (
                        <div class="card text-center">
                            <div class="card-body">
                                <h5 class="card-title">{this.props.location.state.sname}</h5>
                                <p class="card-text">
                                    {this.props.location.state.sbrief}
                                </p>
                                <div class="row">
                                    <form class="form-inline my-2 my-lg-0 col-md-4 text-right" action="#">
                                        <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" name="search" required onChange={this.handleSearchSubmit} />
                                        <button class="btn btn-outline-success my-2 my-sm-0" type="submit" disabled>Search</button>
                                    </form>
                                </div>
                                {this.state.sectorCompanies.length > 0 && <h6>Companies in this Sector:</h6>}
                                <ul>
                                    {this.state.sectorCompanies.map((scom, index) =>
                                        <li class="card text-left" key={index}>
                                            {index + 1} &nbsp; {scom.companyName}
                                        </li>
                                    )}
                                </ul>

                            </div>

                        </div>
                    )}


                </div>

            </div>
        )
    }
}

