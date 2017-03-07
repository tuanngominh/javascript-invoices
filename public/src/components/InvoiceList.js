import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchInvoices} from '../actions'
import { Link } from 'react-router'

export class InvoiceList extends Component {
  componentDidMount() {
    this.props.onFetchList()
  }
  render() {
    return (
      <div>
        <h1>Invoices</h1>
        <table className="table table-hover">
          <thead>
            <tr>
              <th>#</th><th>Id</th>
            </tr>
          </thead> 
          <tbody>
            {(this.props.invoices.length === 0) &&
              <tr>
                <td colSpan={2}>No invoices</td>
              </tr>  
            }
            { this.props.invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <th>{invoice.id}</th><td><Link className="btn btn-secondary" to={'invoices/' + invoice.id} title='Edit invoice'>{invoice.id}</Link></td>
                </tr>
              ))
            }
          </tbody>
        </table>        
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchList: () => {
      dispatch(fetchInvoices())
    }
  }
}

const mapStateToProps = (state) => {
  return {
    invoices: state.invoices ? state.invoices : []
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InvoiceList)