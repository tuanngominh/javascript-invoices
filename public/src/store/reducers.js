import * as types from '../ActionTypes'

const invoices = (state = {}, action) => {
  switch (action.type) {
    case types.INVOICE_FETCH_LIST:
      if (action.isFetching && action.isFetching === true) {
        return {
          ...state,
          invoices: [],
          isFetching: true
        }
      }

      if (action.status && action.status === 'success') {
        return { 
          ...state,
          invoices: action.payload,
          isFetching: false
        }
      }

      return state

    case types.CUSTOMERS_FETCH:
      if (action.isFetching && action.isFetching === true) {
        return {
          ...state,
          customers: [],
          isFetching: true
        }
      }

      if (action.status && action.status === 'success') {
        return { 
          ...state,
          customers: action.payload,
          isFetching: false
        }
      }

      return state


    case types.PRODUCTS_FETCH:
      if (action.isFetching && action.isFetching === true) {
        return {
          ...state,
          products: [],
          isFetching: true
        }
      }

      if (action.status && action.status === 'success') {
        return { 
          ...state,
          products: action.payload,
          isFetching: false
        }
      }

      return state      

    case types.INVOICE_SAVE:
      if (action.isFetching && action.isFetching === true) {
        return {
          ...state,
          isFetching: true
        }
      }

      if (action.status && action.status === 'success') {
        return { 
          ...state,
          invoiceId: action.payload,
          isFetching: false
        }
      }

      return state 

    case types.INVOICE_FETCH:
      if (action.isFetching && action.isFetching === true) {
        return {
          ...state,
          isFetching: true
        }
      }

      if (action.status && action.status === 'success') {
        return { 
          ...state,
          invoiceId: action.payload.id,
          customerId: action.payload.customer_id,
          discount: action.payload.discount,
          isFetching: false
        }
      }

      return state       

    default :
      return state
  }
}

export default invoices