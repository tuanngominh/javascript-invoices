import * as types from './ActionTypes'

const serverUrl = 'http://localhost:8000/api/'

export const actionFailed = (actionType, errorMessage, object) => {
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

export const actionStart = (actionType, object) => {
  return Object.assign({
    type: actionType,
    isFetching: true
  }, object)
}

export const actionSuccess = (actionType, object) => {
  return Object.assign({
    type: actionType,
    status: 'success',
    isFetching: false
  }, object)
}

export const fetchInvoices = (uid) => {
  return function(dispatch) {
    dispatch(actionStart(types.INVOICES_FETCH_LIST))

    fetch(serverUrl + 'invoices')
    .then(function(response) {
      return response.json()
    })
    .then((json) => {
      dispatch(actionSuccess(types.INVOICES_FETCH_LIST, {payload: json}))
    })
    .catch(function(err) {
      dispatch(actionFailed(types.INVOICES_FETCH_LIST))
    })
  }
}