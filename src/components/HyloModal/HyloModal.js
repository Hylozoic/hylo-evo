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

  componentDidUpdate (prevProps) {
    const { refocusOnElement } = this.props
    if (this.props.refocusOnElement !== prevProps.refocusOnElement) {
      console.log(refocusOnElement)
      refocusOnElement && refocusOnElement.focus()
    }
  }

  openModal = () => {
    this.setState({modalIsOpen: true})
  }

  afterOpenModal = () => {
    const { refocusOnElement } = this.props
    if (refocusOnElement) {
      refocusOnElement && refocusOnElement.focus()
    }
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
      onAfterOpen={this.afterOpenModal}
      onRequestClose={this.closeModal}
      contentLabel='Example Modal'
      {...this.props}
    />
  }
}
