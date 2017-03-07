import React, {Component} from 'react'
import {connect} from 'react-redux'
import {saveCustomer} from '../actions'

class CustomerForm extends Component {
  state = {
    value: ''
  }
  handleChange = (e) => {
    this.setState({
      value: e.target.value
    })
  }
  handleSave = (e) => {
    e.stopPropagation()
    e.preventDefault()
    if (this.state.value) {
      this.props.onSave(this.state.value)
    }
  }
  render() {
    return (
      <div className="form-group">
        <div className="col-sm-12">
          <div className="row">
            <div className="col-sm-6">
              <input className="form-control" placeholder="Customer name" value={this.state.value} onChange={this.handleChange}/>
            </div>
            <div className="col-sm-6">
              <button type="submit" className="btn btn-default" onClick={this.handleSave}>Create</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default CustomerForm