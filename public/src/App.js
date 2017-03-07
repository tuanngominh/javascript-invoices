import React, { Component } from 'react';
import { Link } from 'react-router'

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="container"> 
        <div className="row">
          <div className="col-xs-12">
            <Link to='/'>Invoices</Link>
            <Link to='/create-invoice'>Create invoice</Link>
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
