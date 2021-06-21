
import React from "react";
import XLSX from "xlsx";
import $ from 'jquery';
import axios from 'axios';

export default class ReadAndWriteExcel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      res: [],
      data: [],
      cols: [],
      scInfo: null


    };
    this.handleFile = this.handleFile.bind(this);
    this.exportFile = this.exportFile.bind(this);
    this.goForIt = this.goForIt.bind(this);
  }
  handleFile(file) {

    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
    reader.onload = e => {

      const bstr = e.target.result;
      const wb = XLSX.read(bstr, { type: rABS ? "binary" : "array" });

      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];


      const data = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false });
      const dataSended = []

      /*verifying excel */
      const mapdata = {};
      let cnt = 0;
      data.map((row) => {
        if (!isNaN(row[0]?.trim()) && (row[0]?.trim() % 1 == 0) && !isNaN(row[2]?.trim())) {
          cnt += 1;
          mapdata[cnt] = { "stockCodeNo": row[0]?.trim(), "currentPrice": row[2]?.trim(), "dateAndTime": row[3]?.trim() + " " + row[4]?.trim() }
          dataSended.push(row)
        }

      });


      this.setState({ data: dataSended, cols: make_cols(ws["!ref"]) });

      /*Sending Verified data.....note datetime eill be checked at server  */
      if (cnt == 0) { alert("UNSUPPORTED FORMAT"); }
      else {
        axios.post(`${window.base_url}/stockPrice/upload`, mapdata)
          .then(res => {
            this.setState({ res: res.data })
            this.goForIt(mapdata["1"].stockCodeNo);
            $('.toast-body').html(res.data["count"] + " records Uploaded");
            $('.toast').toast('show');
          });
      }


    };

    if (rABS) reader.readAsBinaryString(file)
    else reader.readAsArrayBuffer(file);

  }

  goForIt(stockCodeNo) {
    axios.post(`${window.base_url}/stockCode/getInfo`, { "stockCodeNo": stockCodeNo })
      .then(res => {
        this.setState({ scInfo: res.data })
      });

  }

  exportFile() {

    const ws = XLSX.utils.aoa_to_sheet(this.state.data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SheetJS");

    XLSX.writeFile(wb, "sheetjs.xlsx");
  }
  render() {
    return (
      <div >
        <div className="col-md-12 container  d-flex justify-content-center card">
          <h3 class="text-center">Import Data</h3>

          <div className="col-md-4">
            <DataInput handleFile={this.handleFile} />
          </div>


          <div className="col-md-4 text-center">
            <button
              disabled={!this.state.data.length}
              className="btn btn-success"
              onClick={this.exportFile}
            >
              Export
            </button>

          </div>
        </div>

        <div className="col-md-12 container  d-flex justify-content-center card">
          {this.state.scInfo && (
            <div class="card text-center">
              <div class="card-body container " >
                <h5 class="card-title">{this.state.res["count"]} Record Uploaded Succesfully</h5>
                <p class="card-text">Company Name : {this.state.scInfo.company?.companyName}</p>
                <p class="card-text">Stock Exchange  Name : {this.state.scInfo.stockExchange?.stockExchangeName}</p>
                <p class="card-text">Stock  Code :{this.state.scInfo.stockCode}</p>
              </div>
            </div>
          )}

          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  {this.state.cols.length > 0 && this.state.cols.map(c => (
                    <th key={c.key}>{c.name}</th>
                  ))}
                  {this.state.cols.length > 0 && <th>Response From Server</th>}
                </tr>
              </thead>
              <tbody>
                {this.state.data.map((r, i) => (
                  <tr key={i}  >
                    {this.state.cols.map(c => (
                      <td key={c.key}>{r[c.key]}</td>
                    ))}
                    <td>{this.state.res[i + 1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </div >

    );
  }
}



class DataInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    const files = e.target.files;
    if (files && files[0]) this.props.handleFile(files[0]);
  }
  render() {
    return (
      <form className="form-inline ">
        <div className="form-group">
          <label htmlFor="file"><strong>Excel Sheet: &nbsp;</strong></label>
          <input
            type="file"
            className="form-control file"
            id="file"
            accept={SheetJSFT}
            onChange={this.handleChange}
          />
        </div>
      </form>
    );
  }
}




const SheetJSFT = [
  "xlsx",
  "xlsb",
  "xlsm",
  "xls",
  "xml",
  "csv",
  "txt",
  "ods",
  "fods",
  "uos",
  "sylk",
  "dif",
  "dbf",
  "prn",
  "qpw",
  "123",
  "wb*",
  "wq*",
  "html",
  "htm"
]
  .map(function (x) {
    return "." + x;
  })
  .join(",");

const make_cols = refstr => {
  let o = [],
    C = XLSX.utils.decode_range(refstr).e.c + 1;
  for (var i = 0; i < C; ++i) o[i] = { name: XLSX.utils.encode_col(i), key: i };
  return o;
};
