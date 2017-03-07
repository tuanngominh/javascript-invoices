import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchCustomers, fetchProducts, saveInvoice, createCustomer, fetchInvoice, createInvoiceItem} from '../actions'
import CustomerForm from './CustomerForm'

class InvoiceItem extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: props.quantity ? props.quantity : 0,
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
  componentWillReceiveProps(nextProps) {
    if ('quantity' in nextProps) {
      this.setState({
        value: nextProps.quantity
      })
    }
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
      invoiceId: '',
      discount: 0,
      customerId: props.customerId ? props.customerId : '',
      invoiceItems: [],      
      total: 0,
      showAddCustomer: false
    }
  }

  componentDidMount() {
    this.props.onFetchCustomers()
    this.props.onFetchProducts()
    let invoiceId
    if (this.props.params && this.props.params.invoiceId) {
      invoiceId = this.props.params.invoiceId
    } else if (this.props.invoiceId) {
      invoiceId = this.props.invoiceId
    }
    if (invoiceId) {
      this.setState({
        invoiceId: invoiceId
      })
      this.props.onFetchInvoice(invoiceId)
    } else {
      this.handleSaveInvoice()  
    }
  }

  componentWillReceiveProps(nextProps) {
    if ('customerId' in nextProps) {
      this.setState({
        customerId: nextProps.customerId
      })
    }
    if ('discount' in nextProps) {
      this.setState({
        discount: nextProps.discount
      })
    }
    if ('invoiceItems' in nextProps) {
      //find invoice items which 
      let newInvoiceItems = []
      nextProps.invoiceItems.forEach((item) => {
        const foundProducts = this.props.products.filter((p) => {
          return (parseInt(p.id) === parseInt(item.product_id))
        })
        if (foundProducts.length === 0) {
          return
        }
        const product = foundProducts[0]
        let newInvoiceItem = {
          invoiceId: item.invoice_id,
          productId: product.id,
          productName: product.name,
          productPrice: product.price,
          id: item.id,
          quantity: item.quantity
        }
        newInvoiceItems.push(newInvoiceItem)
      })
      this.setState({invoiceItems: newInvoiceItems})
    }
  }
  
  handleSaveInvoice = (data) => {
    this.props.onSaveInvoice(Object.assign({
      invoiceId: this.state.invoiceId,
      discount: this.state.discount,
      customerId: this.state.customerId
    }, data))
  }

  handleChangeCustomer = (e) => {
    e.preventDefault()
    this.setState({
      customerId: e.target.value
    })
    this.handleSaveInvoice({
      customerId: e.target.value
    })
  }

  handleSelectProduct = (e) => {
    e.preventDefault()
    const productId = e.target.value

    let product = this.state.invoiceItems.filter((p) => {
      return (p.id === parseInt(productId))
    })
    //already added
    if (product.length > 0) {
      return
    }

    product = this.props.products.filter((p) => {
      return (p.id === parseInt(productId))
    })
    //product not exist, pretty strict check here
    if (product.length === 0) {
      return
    }

    product = product[0]
    this.props.onCreateInvoiceItem(this.state.invoiceId, product.id)

    this.setState((prevState) => {
      return {
        invoiceItems: [...prevState.invoiceItems, {
          productName: product.name,
          productPrice: product.price,
          quantity: 0
        }]
      }
    })
  }

  total = (invoiceItems, discount) => {
    if (!invoiceItems) {
      return 0
    }

    let total = invoiceItems.reduce((acc, item) => {
      if (item.quantity) {
        return acc + item.quantity * item.productPrice
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
      const invoiceItems = prevState.invoiceItems.map((invoiceItem) => {
        let item = Object.assign({}, invoiceItem)

        if (item.id === parseInt(id)) {
          item.quantity = parseInt(quantity)
        }
        return item
      })

      return {
        invoiceItems,
        total: this.total(invoiceItems, prevState.discount)
      }
    })
  }

  handleDiscountChange = (e) => {
    e.preventDefault()
    const discount = e.target.value
    this.setState({
      discount,
      total: this.total(this.state.invoiceItems, discount)
    })
    this.handleSaveInvoice({discount})
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
              <select className="form-control" value={this.state.customerId} onChange={this.handleChangeCustomer}>
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
                        key={invoiceItem.id}
                        id={invoiceItem.id}
                        invoiceId={invoiceItem.invoiceId}
                        productId={invoiceItem.productId}
                        quantity={invoiceItem.quantity}
                        name={invoiceItem.productName}
                        price={invoiceItem.productPrice}
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
    },
    onFetchInvoice: (invoiceId) => {
      dispatch(fetchInvoice(invoiceId))
    },
    onCreateInvoiceItem: (invoiceId, productId) => {
      dispatch(createInvoiceItem(invoiceId, productId))
    }
  }
}

const mapStateToProps = (state) => {
  return {
    customers: state.customers ? state.customers : [],
    products: state.products ? state.products : [],
    invoiceId: state.invoiceId ? state.invoiceId : null,
    customerId: state.customerId ? state.customerId : '',
    discount: state.discount ? state.discount : '',
    invoiceItems: state.invoiceItems ? state.invoiceItems : []
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InvoiceForm)