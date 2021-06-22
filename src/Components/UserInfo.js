
import React from "react";
export default class UserInfo extends React.Component {
    state = {
        disabled: true,
        user: { username: "yyyy", password: "9999999", email: "rarra", mobileNo: "ooooo" },
        buttonValue: 'Edit'
    }

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.enableEdit = this.enableEdit.bind(this)
    }
    handleSubmit(event) {
        event.preventDefault();

        /*
        authenticationService.login(this.username.current.value, this.myPassword.current.value)
            .then(
                user => {
                    const { from } = this.props.location.state || { from: { pathname: "/" } };
                    this.props.history.push(from);
                },
                error => {
                    Alert("error!");
                }
            );
            */
    }
    enableEdit(e) {
        e.preventDefault();
        if (this.state.disabled === true) {
            this.setState({ disabled: false, buttonValue: "Submit" });
            return;
        }
        else {

            /* make call to api*/
        }


    }

    render() {
        return (

            <div class="row">
                <div class=" card container col-md-4 shadow p-3 mb-5 bg-white rounded">

                    <h2>Hii, {this.state.user.username} </h2>
                    <form onSubmit={this.handleSubmit}>
                        <div class="form-group">
                            <label for="formGroupExampleInput1">User Name</label>
                            <input type="text" class="form-control" id="formGroupExampleInput1" name="username" placeholder="username" required disabled defaultValue={this.state.user?.username} />
                        </div>
                        <div class="form-group">
                            <label for="formGroupExampleInput2">Password</label>
                            <input type="text" class="form-control" id="formGroupExampleInput2" name="password" placeholder="password" required disabled={this.state.disabled} defaultValue={this.state.user?.password} />
                        </div>
                        <div class="form-group">
                            <label for="formGroupExampleInput3">Email</label>
                            <input type="email" class="form-control" id="formGroupExampleInput3" name="emaill" placeholder="email" required disabled={this.state.disabled} defaultValue={this.state.user?.email} />
                        </div>
                        <div class="form-group">
                            <label for="formGroupExampleInput4">Mobile No</label>
                            <input type="text" class="form-control" id="formGroupExampleInput4" name="mobileNo" placeholder="mobileNo" required disabled={this.state.disabled} defaultValue={this.state.user?.mobileNo} />
                        </div>
                        <div class="text-center">
                            <input class="btn btn-dark" type="button" onClick={this.enableEdit} value={this.state.buttonValue} />
                        </div>
                    </form>

                </div>
            </div>

        );
    }
}