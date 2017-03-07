import React, { Component } from 'react';
import { Link } from 'react-router'

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="container"> 
        <div className="row">
          <div className="col-xs-12">
            <Link className="btn btn-secondary" to='/'>Invoices</Link>
            <Link className="btn btn-secondary" to='/create-invoice'>Create invoice</Link>
            <hr/>
          </div>
        </div>      
        <div className="row">
          <div className="col-xs-12">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
