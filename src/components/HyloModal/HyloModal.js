import React, { PropTypes, Component } from 'react'
import Modal from 'react-modal'
import styles from './HyloModal.scss'

export default class HyloModal extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
    this.state = { modalIsOpen: true }
  }

  openModal = () => {
    this.setState({modalIsOpen: true})
  }

  afterOpenModal = () => {
    // references are now sync'd and can be accessed.
    // this.subtitle.style.color = '#f00'
  }

  closeModal = () => {
    this.setState({modalIsOpen: false})
    window.history.back()
  }

  render () {
    const { children } = this.props
    return <Modal
      className={styles['hyloModal']}
      overlayClassName={styles['hyloModal-overlay']}
      isOpen={this.state.modalIsOpen}
      onAfterOpen={this.afterOpenModal}
      onRequestClose={this.closeModal}
      contentLabel='Example Modal'
      children={children}
    />
  }
}
