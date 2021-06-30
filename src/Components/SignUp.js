
import React from "react";
import axios from 'axios';
import $ from 'jquery';
import { Link } from 'react-router-dom';
import { authenticationService } from '../_services/authenticationService';
export default class SignUp extends React.Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this)
        if (authenticationService.currentUserValue) {
            this.props.history.push('/');
        }
    }


    handleSubmit(e) {
        e.preventDefault();
        const body = {
            "userName": e.target.elements.userName.value,
            "password": e.target.elements.password.value,
            "email": e.target.elements.email.value,
            "isAdmin": false,
            "isConfirmed": false,
            "mobileNumber": e.target.elements.mobileNumber.value
        }

        axios.post(`${window.base_url}/setuserapi1`, body).then(res => {
            if (res.data["OK"]) {
                $('.toast-body').html(res.data["OK"]);
                $('.toast').toast('show');
                this.props.history.push('/login');

            }
            else {
                $('.toast-body').html(res.data["ERROR"] + " Please Retry!");
                $('.toast').toast('show');
            }
        })

    }

    render() {
        return (

            <div class="row w-100">
                <div class="  card mx-auto col-9 col-md-4 shadow p-3  bg-white rounded mx-auto">
                    <div class="text-center">
                        <img src="/favicon.ico" id="icon" alt="User Icon" />
                        <h2>SignUp</h2>
                    </div>
                    <form onSubmit={this.handleSubmit}>
                        <div class="form-group">
                            <input type="text" class="form-control" id="formGroupExampleInput1" name="userName" placeholder="username" required />
                        </div>
                        <div class="form-group">
                            <input type="text" class="form-control" id="formGroupExampleInput2" name="password" placeholder="password" required />
                        </div>
                        <div class="form-group">
                            <input type="email" class="form-control" id="formGroupExampleInput3" name="email" placeholder="email" required />
                        </div>
                        <div class="form-group">
                            <input type="text" class="form-control" id="formGroupExampleInput4" name="mobileNumber" placeholder="mobileNo" required />
                        </div>
                        <div class="text-center">
                            <button type="submit" class="btn btn-dark">Sign Up</button>
                        </div>
                    </form>
                    <div >
                        <Link to="/login" class="underlineHover float-right">Sign In</Link>
                    </div>
                </div>
            </div>

        );
    }
}