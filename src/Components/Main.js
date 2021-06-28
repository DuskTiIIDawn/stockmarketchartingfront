import Title from './Title';
import CompanyList from './CompanyList';
import Navbar from './Navbar';
import Home from './Home';
import AddEditCompany from './AddEditCompany';
import Company from './Company';
import Chart from './CompareCompanies';
import SectorList from './SectorList';
import Sector from './Sector';
import StockCodeList from './StockCodeList';
import StockExchangeList from './StockExchangeList';
import StockExchange from './StockExchange';
import AddEditStockExchange from './AddEditStockExchange';
import AddEditStockCode from './AddEditStockCode';
import AddEditSector from './AddEditSector';
import IPOList from './IPOList';
import IPO from './IPO';
import Login from './Login';
import SignUp from './SignUp';
import ChangePassword from './ChangePassword';
import MissingRecords from './MissingRecords';
import SeeStockPrice from './SeeStockPrice';
import AddEditIPO from './AddEditIPO';
import ReadAndWriteExcel from './ReadAndWriteExcel';
import { React, Component } from 'react';
import { Route } from 'react-router-dom';


import { authenticationService } from '../_services/authenticationService';
import { Role } from '../_helpers/role';
import { PrivateRoute } from './PrivateRouter';
import { request } from '../_services/myAxiosInterceptors.js';







export default class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: null,
            isAdmin: false,
        };
        this.logout = this.logout.bind(this)
    }

    componentDidMount() {
        authenticationService.currentUser.subscribe(x => this.setState({
            currentUser: x,
            isAdmin: x && x.isAdmin
        }));
    }


    logout() {
        authenticationService.logout();

    }

    render() {
        return (
            <div>
                <Title />
                <Navbar isAdmin={this.state.isAdmin} currentUser={this.state.currentUser} logout={this.logout} />
                <Route exact path="/" component={Home} />
                <PrivateRoute exact path="/company" component={CompanyList} />
                <PrivateRoute exact roles={[Role.Admin]} path="/company/addEdit" component={AddEditCompany} />
                <PrivateRoute exact path="/company/info" component={Company} />
                <PrivateRoute exact roles={[Role.Admin]} path="/sector" component={SectorList} />
                <PrivateRoute exact roles={[Role.Admin]} path="/sector/info" component={Sector} />
                <PrivateRoute exact roles={[Role.Admin]} path="/sector/addEdit" component={AddEditSector} />
                <PrivateRoute exact roles={[Role.Admin]} path="/stockCode" component={StockCodeList} />
                <PrivateRoute exact roles={[Role.Admin]} path="/stockCode/addEdit" component={AddEditStockCode} />
                <PrivateRoute exact roles={[Role.Admin]} path="/stockPrice/import" component={ReadAndWriteExcel} />
                <PrivateRoute exact roles={[Role.Admin]} path="/stockExchange" component={StockExchangeList} />
                <PrivateRoute exact roles={[Role.Admin]} path="/stockExchange/info" component={StockExchange} />
                <PrivateRoute exact roles={[Role.Admin]} path="/stockExchange/addEdit" component={AddEditStockExchange} />
                <PrivateRoute exact path="/ipo" component={IPOList} />
                <PrivateRoute exact path="/ipo/info" component={IPO} />
                <PrivateRoute exact roles={[Role.Admin]} path="/ipo/addEdit" component={AddEditIPO} />
                <PrivateRoute exact roles={[Role.Admin]} path="/stockPrice/seeData" component={SeeStockPrice} />
                <PrivateRoute exact roles={[Role.Admin]} path="/stockPrice/missingRecords" component={MissingRecords} />
                <PrivateRoute exact path="/user/info" component={ChangePassword} />
                <PrivateRoute exact path="/charts" component={Chart} />
                <Route exact path="/login" component={Login} history={this.props.history} />
                <Route exact path="/signUp" component={SignUp} />
            </div>
        )
    }
}



