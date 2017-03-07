import * as types from './ActionTypes'

const serverUrl = 'http://localhost:8000/api/'


const actionFailed = (actionType, errorMessage, object) => {
  let action = {
    type: actionType,
    status: 'error',
    isFetching: false
  }

  if (errorMessage) {
    action.errorMessage = errorMessage
  }
  if (object) {
    action = Object.assign(action, object)
  }
  return action
}

const actionStart = (actionType, object) => {
  return Object.assign({
    type: actionType,
    isFetching: true
  }, object)
}

const actionSuccess = (actionType, object) => {
  return Object.assign({
    type: actionType,
    status: 'success',
    isFetching: false
  }, object)
}

export const fetchInvoice = (invoiceId) => {
  return function(dispatch) {
    dispatch(actionStart(types.INVOICE_FETCH))

    let data = new FormData()
    fetch(serverUrl + 'invoices' + '/' + invoiceId)
    .then(function(response) {
      return response.json()
    })
    .then((json) => {
      dispatch(actionSuccess(types.INVOICE_FETCH, {payload: json}))
    })
    .catch(function(err) {
      dispatch(actionFailed(types.INVOICE_FETCH))
    })
  }
}

export const createCustomer = (customerName) => {
  return function(dispatch) {
    dispatch(actionStart(types.CUSTOMERS_CREATE))

    let data = new FormData()
    fetch(serverUrl + 'customers', {
      method: 'post', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: customerName
      })
    })
    .then(function(response) {
      return response.json()
    })
    .then((json) => {
      dispatch(actionSuccess(types.CUSTOMERS_CREATE, {payload: json}))
      dispatch(fetchCustomers())
    })
    .catch(function(err) {
      dispatch(actionFailed(types.CUSTOMERS_CREATE))
    })
  }
}

export const saveInvoice = (invoice) => {
  console.log(invoice)
  return function(dispatch) {
    dispatch(actionStart(types.INVOICE_SAVE))

    let url, method, body
    if (invoice.invoiceId) {
      url = serverUrl + 'invoices' + '/' + invoice.invoiceId
      method = 'put'
      body = Object.assign({}, {
        customer_id: parseInt(invoice.customerId),
        discount: parseInt(invoice.discount)
      })
      body = JSON.stringify(body)
    } else {
      url = serverUrl + 'invoices'
      method = 'post'
      body = {}
    }
    fetch(url, {
      headers: {
        'Content-Type': 'application/json'
      },
      method,
      body
    })
    .then(function(response) {
      return response.json()
    })
    .then((json) => {
      dispatch(actionSuccess(types.INVOICE_SAVE, {payload: json.id}))
    })
    .catch(function(err) {
      dispatch(actionFailed(types.INVOICE_SAVE))
    })
  }
}

export const fetchCustomers = () => {
  return function(dispatch) {
    dispatch(actionStart(types.CUSTOMERS_FETCH))

    fetch(serverUrl + 'customers')
    .then(function(response) {
      return response.json()
    })
    .then((json) => {
      dispatch(actionSuccess(types.CUSTOMERS_FETCH, {payload: json}))
    })
    .catch(function(err) {
      dispatch(actionFailed(types.CUSTOMERS_FETCH))
    })
  }
}

export const fetchProducts = () => {
  return function(dispatch) {
    dispatch(actionStart(types.PRODUCTS_FETCH))

    fetch(serverUrl + 'products')
    .then(function(response) {
      return response.json()
    })
    .then((json) => {
      dispatch(actionSuccess(types.PRODUCTS_FETCH, {payload: json}))
    })
    .catch(function(err) {
      dispatch(actionFailed(types.PRODUCTS_FETCH))
    })
  }
}


export const fetchInvoices = () => {
  return function(dispatch) {
    dispatch(actionStart(types.INVOICE_FETCH_LIST))

    fetch(serverUrl + 'invoices')
    .then(function(response) {
      return response.json()
    })
    .then((json) => {
      dispatch(actionSuccess(types.INVOICE_FETCH_LIST, {payload: json}))
    })
    .catch(function(err) {
      dispatch(actionFailed(types.INVOICE_FETCH_LIST))
    })
  }
}
