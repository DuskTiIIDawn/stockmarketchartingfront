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
      })
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
      <div>
        {this.props.isAdmin && (
          <div class="row">
            <div class="col-md-8 ml-4">
              <Link to="/company/addEdit"><button class="btn btn-success "><i className="fa fa-plus small" ></i> Company</button></Link>
            </div>
            <form class="form-inline my-2 my-lg-0 col-md-4 ml-auto" action="#">
              <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" name="search" onChange={this.handleSearchSubmit} required />
              <button class="btn btn-outline-success my-2 my-sm-0 " type="submit" disabled>Search</button>
            </form>
          </div>
        )}



        <ul class="card container">
          {!this.state.companies.length && <li>No Records Found</li>}
          {this.state.companies.map((company, index) =>
            <li class="card " key={index}>
              <div class="row">
                <div class="col-md-3">
                  {index + 1}&nbsp;  {company.companyName}
                </div >

                <div class="col-md-5">
                  {!company.sector && this.props.isAdmin && (
                    <form onSubmit={this.handleSectorAdd} action="#" method="post" cid={company.id}>
                      <div class="form-group row">

                        <label for={company.id} class="col-form-label">Sector:</label>
                        <div class="col-sm-6">
                          <select class="custom-select mr-sm-2" id={company.id} name="sectorId" required>
                            <option value="">Select....</option>
                            {this.state.sectors.map((sector, index) =>
                              <option value={sector.id} key={index}>{sector.sectorName}</option>
                            )}
                          </select>
                        </div>
                        <div class="col-auto">
                          <button type="submit" class="btn btn-primary" ><i className="fa fa-plus small" ></i></button>
                        </div>
                      </div>
                    </form>)}
                  {company.sector && (
                    <div class="form-group row">
                      <label for={company.id} class=" col-form-label">Sector:</label>
                      <div class="col-sm-6">
                        <input type="text" class="form-control" id={company.id} name="sectorName" value={company.sector.sectorName} disabled />
                      </div>
                      {this.props.isAdmin &&
                        <button class="btn btn-danger col-auto" onClick={this.handleSectorRemove} cid={company.id}><i className="fa fa-minus small" cid={company.id}></i></button>
                      }
                    </div>
                  )}


                </div>





                <div class="row ">
                  <div class="col-md-4 col-sm-4">
                    <Link to={{ pathname: "/company/info", state: { cid: company.id } }}><button class="btn btn-secondary">INFO</button></Link>
                  </div>
                  {this.props.isAdmin && (<div class="row">
                    < div class="col-md-4 col-sm-4">
                      <Link to={{ pathname: "/company/addEdit", state: { cid: company.id } }}><button class="btn btn-dark">Edit</button></Link>
                    </div>

                    <div class=" col-md-4 ">
                      <button class="btn btn-danger" onClick={this.remove} cid={company.id}>Delete</button>
                    </div>
                  </div>)
                  }
                </div>
              </div>
            </li>
          )}
        </ul>



      </div >
    )
  }
}

