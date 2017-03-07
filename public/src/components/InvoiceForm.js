import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchCustomers, fetchProducts, saveInvoice, createCustomer} from '../actions'
import CustomerForm from './CustomerForm'

class InvoiceItem extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: '',
    }
  }
  handleChange = (e) => {
    e.preventDefault()
    const value = e.target.value
    this.setState({
      value
    })
    this.props.onChange(this.props.id, value)
  }
  render() {
    return (
      <tr>
        <th>{this.props.name}</th>
        <td>
          <input className="form-control" placeholder="Product quantity" value={this.state.value} onChange={this.handleChange}/>
        </td>
        <td>{this.props.price}</td>
      </tr>
    )
  }
}
class InvoiceForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      customer: '',
      invoiceItems: [],
      discount: 0,
      total: 0,
      showAddCustomer: false
    }
  }

  componentDidMount() {
    this.props.onFetchCustomers()
    this.props.onFetchProducts()
    this.handleSaveInvoice()
  }

  handleSaveInvoice = () => {
    this.props.onSaveInvoice({
      invoiceId: this.props.invoiceId,
      discount: this.state.discount,
      customer: this.state.customer
    })
  }

  handleChangeCustomer = (e) => {
    e.preventDefault()
    this.setState({
      customer: e.target.value
    })
    this.handleSaveInvoice()
  }

  handleSelectProduct = (e) => {
    e.preventDefault()
    const productId = e.target.value
    let product = this.props.products.filter((p) => {
      return (p.id === parseInt(productId))
    })
    product = product[0]
    this.setState((prevState) => {
      return {
        invoiceItems: [...prevState.invoiceItems, {
          product: Object.assign({}, product)
        }]
      }
    })
  }

  total = (products, discount) => {
    if (!products) {
      return 0
    }

    let total = products.reduce((acc, item) => {
      if (item.product.quantity) {
        return acc + item.product.quantity * item.product.price
      }
      return acc
    }, 0)
    total = total - discount
    if (total < 0) {
      total = 0
    }
    return total
  }

  handleChangeInvoiceItemQuantity = (id, quantity) => {
    this.setState((prevState) => {
      const products = prevState.invoiceItems.map((invoiceItem) => {
        let item = Object.assign({}, invoiceItem)

        if (item.product.id === parseInt(id)) {
          item.product.quantity = parseInt(quantity)
        }
        return item
      })

      return {
        products,
        total: this.total(products, prevState.discount)
      }
    })
  }

  handleDiscountChange = (e) => {
    e.preventDefault()
    const discount = e.target.value
    this.setState({
      discount,
      total: this.total(this.state.products, discount)
    })
    this.handleSaveInvoice()
  }

  toggleAddCustomer = () => {
    this.setState({
      showAddCustomer: !this.state.showAddCustomer
    })
  }

  handleCreateCustomer = (customerName) => {
    this.props.onCreateCustomer(customerName)
    this.setState({
      showAddCustomer: false
    })
  }

  render() {
    return (
      <div>
        <h1>Create Invoice</h1>
        <form className="form-horizontal">
          <div className="form-group">
            <label className="col-sm-2 control-label">Customer</label>
            <div className="col-sm-8">
              <select className="form-control" value={this.state.customer} onChange={this.handleChangeCustomer}>
                {this.props.customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>{customer.name}</option>
                ))}
              </select>              
            </div>
            <div className="col-sm-2"><a className="btn btn-secondary" onClick={this.toggleAddCustomer} >Add</a></div>
          </div>
          {this.state.showAddCustomer && <div className="form-group"><div className="col-sm-8 col-sm-offset-2">
              <CustomerForm onSave={this.handleCreateCustomer} onCancel={() => this.setState({showAddCustomer: false})}/>
            </div></div>
          }
          <div className="form-group">
            <label className="col-sm-2 control-label">Select product</label>
            <div className="col-sm-10">
              <select className="form-control" onChange={this.handleSelectProduct}>
                {this.props.products.map((product) => (
                  <option key={product.id} value={product.id}>{product.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="col-sm-2 control-label">Invoice items</label>
            <div className="col-sm-10">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Product</th><th>Quantity</th>
                  </tr>
                </thead> 
                <tbody>
                  {(this.state.invoiceItems.length === 0) &&
                    <tr>
                      <td colSpan={3}>No invoice item, please select a product</td>
                    </tr>  
                  }
                  { this.state.invoiceItems.map((invoiceItem) => (
                      <InvoiceItem 
                        key={invoiceItem.product.id}
                        id={invoiceItem.product.id}
                        name={invoiceItem.product.name}
                        price={invoiceItem.product.price}
                        onChange={this.handleChangeInvoiceItemQuantity}
                      />
                    ))
                  }
                </tbody>
              </table>                
            </div>
          </div>
          <div className="form-group">
            <label className="col-sm-2 control-label">Discount</label>
            <div className="col-sm-10">
              <input className="form-control" placeholder="Discount amount" value={this.state.discount} onChange={this.handleDiscountChange}/>
            </div>
          </div>
          <div className="form-group">
            <label className="col-sm-2 control-label">Total</label>
            <div className="col-sm-10">
              <p className="form-control-static">{this.state.total}</p>
            </div>
          </div>       
        </form>        
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchCustomers: () => {
      dispatch(fetchCustomers())
    },
    onFetchProducts: () => {
      dispatch(fetchProducts())
    },
    onSaveInvoice: (invoice) => {
      dispatch(saveInvoice(invoice))
    },
    onCreateCustomer: (customerName) => {
      dispatch(createCustomer(customerName))
    }
  }
}

const mapStateToProps = (state) => {
  return {
    customers: state.customers ? state.customers : [],
    products: state.products ? state.products : [],
    invoiceId: state.invoiceId ? state.invoiceId : null,
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InvoiceForm)