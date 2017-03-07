import * as types from '../ActionTypes'

const invoices = (state = {}, action) => {
  switch (action.type) {
    case types.INVOICES_FETCH_LIST:
      if (action.isFetching && action.isFetching === true) {
        return {
          invoices: [],
          isFetching: true
        }
      }

      if (action.status && action.status === 'success') {
        return { 
          invoices: action.payload,
          isFetching: false
        }
      }

      return state

    default :
      return state
  }
}

export default invoices