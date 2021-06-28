
import React from "react";
import { authenticationService } from '../_services/authenticationService';
import axios from 'axios';
import $ from 'jquery';
export default class ChangePassword extends React.Component {
    state = {
        disabled: true,
        user: null,

    }
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.enableEdit = this.enableEdit.bind(this)
    }

    componentDidMount() {
        const currentUser = authenticationService.currentUserValue;
        axios.post(`${window.base_url}/findByUserNameapi1`, { userName: currentUser.userName }).then((res) => {
            this.setState({ user: res.data });
        });

    }


    handleSubmit(e) {
        e.preventDefault(e);
        const body = {
            "userName": e.target.elements.userName.value,
            "oldPassword": e.target.elements.oldPassword.value,
            "newPassword": e.target.elements.newPassword.value
        }
        axios.post(`${window.base_url}/changePasswordapi1`, body).then((res) => {
            if (res.data['ERROR']) {
                $('.toast-body').html(res.data["ERROR"]);
                $('.toast').toast('show');
            }
            else {
                $('.toast-body').html(res.data["OK"]);
                $('.toast').toast('show');
                this.props.history.push('/');
            }

        })

    }
    enableEdit(e) {
        e.preventDefault();
        if (this.state.disabled === true) {
            this.setState({ disabled: false });
            return;
        }
    }

    render() {
        return (

            <div class="row w-100">
                <div class=" card container col-md-4 shadow p-3 mb-5 bg-white rounded">

                    <h2>Hii, {this.state.user?.userName} {this.state.user?.isAdmin === true && "(ADMIN)"} </h2>

                    <form onSubmit={this.handleSubmit}>
                        <div class="form-group">
                            <label for="formGroupExampleInput1">User Name</label>
                            <input type="text" class="form-control" id="formGroupExampleInput1" name="userName" required disabled defaultValue={this.state.user?.userName} />
                        </div>
                        <div class="form-group">
                            <label for="formGroupExampleInput2">Email</label>
                            <input type="email" class="form-control" id="formGroupExampleInput3" name="emai2" required disabled defaultValue={this.state.user?.email} />
                        </div>
                        <div class="form-group">
                            <label for="formGroupExampleInput3">Mobile No</label>
                            <input type="text" class="form-control" id="formGroupExampleInput3" name="mobileNumber" required disabled defaultValue={this.state.user?.mobileNumber} />
                        </div>
                        <div class="form-group">
                            <label for="formGroupExampleInput4">Old Password</label>
                            <input type="text" class="form-control" id="formGroupExampleInput4" name="oldPassword" required disabled={this.state.disabled} />
                        </div>
                        <div class="form-group">
                            <label for="formGroupExampleInput5">New Password</label>
                            <input type="text" class="form-control" id="formGroupExampleInput5" name="newPassword" required disabled={this.state.disabled} />
                        </div>

                        <input class="btn btn-primary ml-auto" type="button" onClick={this.enableEdit} value="Edit" />&nbsp;
                        <button class="btn btn-dark mr-auto" disabled={this.state.disabled}>Submit</button>

                    </form>

                </div>
            </div>

        );
    }
}