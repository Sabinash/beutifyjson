import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '', responseValue: '',result: '',
      isDownload: '',
      serviceURL: "https://us-central1-beautifyjson.cloudfunctions.net/app/"
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.minifyData = this.minifyData.bind(this);
    this.jsonDownload = this.jsonDownload.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const URL = this.state.serviceURL + "process";
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: this.state.value })
    };
    fetch(URL, requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.type) {
          fetch(data.response, { method: 'GET'})
            .then(response => response.json())
            .then(data => {
              this.setState({ isDownload: true, result: JSON.stringify(data, null, 4) })
            });
        } else {
          this.setState({ responseValue: data, result:data.response,isDownload: data.isDownload})
        }
      });
  }

  minifyData(e) {
    e.preventDefault();
    var myJSON = JSON.stringify(JSON.parse(this.state.result));
    this.setState({result: myJSON })
  }

  jsonDownload(e) {
    e.preventDefault();
    const URL = this.state.serviceURL + "getDownloadFile";
    const requestOptions = {
      method: 'GET',
    };
    fetch(URL, requestOptions)
      .then(response => {
        response.blob().then(blob => {
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement('a');
          a.href = url;
          a.download = 'output.json';
          a.click();
        });
      });

  }

  render() {
    return (
      <div className="container">
        <h1 className="text-center">
          Beautify JSON
          </h1>
        <p className="text-left">
          *. It is a validator and reformatter for JSON, a lightweight data-interchange format.
          Copy and paste, directly type, or input a URL in the editor above and let it tidy and validate your
          messy JSON code.
          </p>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="json">JSON Data/URL</label>
            <textarea rows="10" cols="30" className="form-control" type="file" name="json" id=""
              placeholder='{}' value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
              required></textarea>
          </div>
          <div className="form-group">
            <button className="btn btn-primary btn-lg btn-block" name="action" id="myBtn" type="submit">
              Process
                  </button>
          </div>
        </form>
        <div>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            {this.state.isDownload ?
              <a className="navbar-brand text-success" href="" onClick={this.minifyData} >Minify</a>
              :
              <a className="nav-link disabled" >Minify</a>
            }
            {this.state.isDownload ?
              <a className="navbar-brand text-danger" href="" onClick={this.jsonDownload} >Download</a>
              :
              <a className="nav-link disabled" >Download</a>
            }
          </nav>
          <form>
            <div className="form-group">
              <label htmlFor="json">Formatted JSON Data</label>
              <textarea rows="10" cols="30" className="form-control" type="file" name="json" id=""
                value={this.state.result} placeholder='{}' readOnly required></textarea>
            </div>
          </form>
        </div>
        <p className="text-center text-muted">© Copyright SekharTech 2020 Beautify JSON</p>
      </div>
    );
  }
}



