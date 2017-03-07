import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'

import {Router, Route, IndexRoute, browserHistory} from 'react-router'
import InvoiceList from './components/InvoiceList'
import InvoiceForm from './components/InvoiceForm'

import {Provider} from 'react-redux'
import configureStore from './store/configureStore'
const store = configureStore()

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path='/' component={App}>
        <IndexRoute component={InvoiceList} />
        <Route path='/create-invoice' component={InvoiceForm} />
        <Route path='/invoices/:invoiceId' component={InvoiceForm} />
      </Route>
    </Router>
  </Provider>
  ,
  document.getElementById('root')
);
