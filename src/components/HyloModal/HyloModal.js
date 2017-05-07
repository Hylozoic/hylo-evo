import React, { PropTypes, Component } from 'react'
import Modal from 'react-modal'
import styles from './HyloModal.scss'

export default class HyloModal extends Component {
  static propTypes = {
    children: PropTypes.any.isRequired
  }

  constructor (props) {
    super(props)
    this.state = { modalIsOpen: true }
  }

  openModal = () => {
    this.setState({modalIsOpen: true})
  }

  closeModal = () => {
    this.setState({modalIsOpen: false})
    window.history.back()
  }

  render () {
    return <Modal
      className={styles['hyloModal']}
      overlayClassName={styles['hyloModal-overlay']}
      isOpen={this.state.modalIsOpen}
      onRequestClose={this.closeModal}
      contentLabel='Example Modal'
      {...this.props}
    />
  }
}
