import Title from './Title';
import CompanyList from './CompanyList';
import Navbar from './Navbar';
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
import MissingRecords from './MissingRecords';
import SeeStockPrice from './SeeStockPrice';
import AddEditIPO from './AddEditIPO';
import ReadAndWriteExcel from './ReadAndWriteExcel';
import { React, Component } from 'react';
import { Route } from 'react-router-dom';



export default class Main extends Component {
    render() {
        return (
            <div>
                <Title />
                <Navbar />
                <Route exact path="/company" component={CompanyList} />
                <Route exact path="/company/addEdit" component={AddEditCompany} />
                <Route exact path="/company/info" component={Company} />
                <Route exact path="/sector" component={SectorList} />
                <Route exact path="/sector/info" component={Sector} />
                <Route exact path="/sector/addEdit" component={AddEditSector} />
                <Route exact path="/stockCode" component={StockCodeList} />
                <Route exact path="/stockCode/addEdit" component={AddEditStockCode} />
                <Route exact path="/stockPrice/import" component={ReadAndWriteExcel} />
                <Route exact path="/stockExchange" component={StockExchangeList} />
                <Route exact path="/stockExchange/info" component={StockExchange} />
                <Route exact path="/stockExchange/addEdit" component={AddEditStockExchange} />
                <Route exact path="/ipo" component={IPOList} />
                <Route exact path="/ipo/info" component={IPO} />
                <Route exact path="/ipo/addEdit" component={AddEditIPO} />
                <Route exact path="/stockPrice/seeData" component={SeeStockPrice} />
                <Route exact path="/stockPrice/missingRecords" component={MissingRecords} />
                <Route exact path="/charts" component={Chart} />


            </div>
        )
    }
}


