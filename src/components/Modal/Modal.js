import React from 'react'
import ReactDOM from 'react-dom'

export default class Modal extends React.Component {
  constructor (props) {
    super(props)
    this.el = document.createElement('div')
    this.modalRoot = document.getElementById('root')
  }

  componentDidMount () {
    this.modalRoot.appendChild(this.el)
  }

  componentWillUnmount () {
    this.modalRoot.removeChild(this.el)
  }

  render () {
    return ReactDOM.createPortal(
      this.props.children,
      this.el
    )
  }
}
