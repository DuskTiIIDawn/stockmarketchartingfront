import { BehaviorSubject } from 'rxjs';
import axios from 'axios';
import $ from 'jquery';


const currentUserSubject = new BehaviorSubject(JSON.parse(sessionStorage.getItem('currentUser')));

export const authenticationService = {
    login,
    logout,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue() { return currentUserSubject.value }
};

function login(userName, password) {
    axios.post(`${window.base_url}/authenticate`, { "userName": userName, "password": password })
        .then(res => {
            // store user details and jwt token in session storage to keep user logged in between page refreshes
            if (res.data["TOKEN"]) {
                const isAdmin = res.data["IS_ADMIN"] ? true : false;
                const currentUser = { userName: userName, isAdmin: isAdmin, token: res.data["TOKEN"] }
                sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
                currentUserSubject.next(currentUser);
                window.location.reload();
                $('.toast-body').html("Logged In SuccessFully");
                $('.toast').toast('show');
                this.props.history.push('/');
            }
            else {
                $('.toast-body').html(res.data["ERROR"]);
                $('.toast').toast('show');
            }
        })
}

function logout() {
    // remove user from session storage to log user out
    sessionStorage.removeItem('currentUser');
    currentUserSubject.next(null);
}

