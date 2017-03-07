import React, { Component } from 'react';
import InvoiceList from './components/InvoiceList'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="container"> 
        <div className="row">
          <div className="col-xs-12">
            <InvoiceList />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
