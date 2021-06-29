import React, { Component } from 'react';
import $ from 'jquery';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default class CompanyList extends Component {
  state = {
    companies: [],
    sectors: [],
  }


  constructor() {
    super();
    this.refreshCompany = this.refreshCompany.bind(this);
    this.remove = this.remove.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    this.handleSectorAdd = this.handleSectorAdd.bind(this);
    this.handleSectorRemove = this.handleSectorRemove.bind(this);
  }


  componentDidMount() {
    if (this.props.isAdmin) {
      axios.get(`${window.base_url}/sector`, {}).then((res) => {
        this.setState({ sectors: res.data })
      });
    }
    this.refreshCompany();
  }

  refreshCompany() {
    axios.post(`${window.base_url}/company`, {}).then((res) => {
      this.setState({ companies: res.data });
    })
  }

  handleSectorAdd(e) {
    e.preventDefault();
    axios.post(`${window.base_url}/company/addOrRemoveSector`, {
      "companyId": e.target.getAttribute("cid"),
      "sectorId": e.target.elements.sectorId.value
    })
      .then(res => {
        this.refreshCompany();
        $('.toast-body').html(res.data);
        $('.toast').toast('show');
      });

  }

  handleSectorRemove(e) {
    axios.post(`${window.base_url}/company/addOrRemoveSector`, {
      "companyId": e.target.getAttribute("cid")
    })
      .then(res => {
        this.refreshCompany();
        $('.toast-body').html(res.data);
        $('.toast').toast('show');

      });

  }


  handleSearchSubmit(e) {
    e.preventDefault();
    axios.post(`${window.base_url}/company`, { "search": e.target.value })
      .then(res => {
        this.setState({ companies: res.data });
      });

  }



  remove(e) {
    axios.post(`${window.base_url}/company/remove`, {
      "companyId": e.target.getAttribute("cid")
    })
      .then(res => {
        this.refreshCompany();
        $('.toast-body').html(res.data);
        $('.toast').toast('show');
      });
  }




  render() {
    return (
      <div class="w-100">
        <div class="row w-100">
          <div class="col-md-8 ml-4 col-3">
            <Link to="/company/addEdit"><button class="btn btn-success "><i className="fa fa-plus small" ></i> Company</button></Link>
          </div>
          <form class="form-inline my-2 my-lg-0 col-md-4 ml-auto col-7" action="#">
            <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" name="search" onChange={this.handleSearchSubmit} required />
            <button class="btn btn-outline-success my-2 my-sm-0 " type="submit" disabled>Search</button>
          </form>
        </div>


        <div class="text-center mb-5 "><h3>Manage Companies</h3></div>
        {!this.state.companies.length > 0 && <li>No Records Found</li>}
        {this.state.companies.length > 0 &&
          <div class="card container">
            <table class="table table-sm ">
              <thead>
                <tr>
                  <th>SNo.</th>
                  <th>Company Name</th>
                  <th>Sector</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {this.state.companies.map((company, index) =>
                  <tr key={index}>
                    <td class="col-1 col-md-1">{index + 1}</td>
                    <td class="col-3 col-md-4">{company.companyName}</td>
                    <td class="col-7 col-md-4">{!company.sector && this.props.isAdmin && (
                      <form onSubmit={this.handleSectorAdd} action="#" method="post" cid={company.id}>
                        <div class="row">
                          <div class="col-7">
                            <select class="custom-select mr-sm-2" id={company.id} name="sectorId" required>
                              <option value="">Select....</option>
                              {this.state.sectors.map((sector, index) =>
                                <option value={sector.id} key={index}>{sector.sectorName}</option>
                              )}
                            </select>
                          </div>
                          <button type="submit" class="btn btn-primary" ><i className="fa fa-plus small" ></i></button>
                        </div>
                      </form>)}

                      {company.sector && (
                        <div class="row">
                          <div class="col-7">
                            <input type="text" class="form-control" id={company.id} name="sectorName" value={company.sector.sectorName} disabled />
                          </div>
                          {this.props.isAdmin &&
                            <button class="btn btn-danger col-auto" onClick={this.handleSectorRemove} cid={company.id}><i className="fa fa-minus small" cid={company.id}></i></button>
                          }
                        </div>
                      )}

                    </td>

                    <td class="col-1 col-md-3">
                      <div class="row">
                        <Link to={{ pathname: "/company/info", state: { cid: company.id } }} class="col-11 col-md-4"><button class="btn btn-secondary mx-2">Info</button></Link>
                        {this.props.isAdmin && (<div class="mx-1 col-11 col-md-7">
                          <Link to={{ pathname: "/company/addEdit", state: { cid: company.id } }} ><button class="btn btn-dark mx-1">Edit</button></Link>
                          <button class="btn btn-danger mx-1" onClick={this.remove} cid={company.id}>Delete</button>
                        </div>)
                        }
                      </div>
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

