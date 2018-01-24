import React from 'react'
import './ErrorBoundary.scss'
import rollbar from 'client/rollbar'

export default class ErrorBoundary extends React.Component {
  constructor (props) {
    super(props)
    this.state = {hasError: false}
  }

  componentDidCatch (error, info) {
    // Display fallback UI
    this.setState({hasError: true})

    // Log to rollbar
    rollbar.error(error, info)
  }

  render () {
    const message = this.props.message || 'Oops! Something went wrong.  Try reloading the page.'
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <div styleName='container'>
        <div styleName='speech-bubble'>
          <div styleName='arrow' />
          <span>{message}</span>
        </div>
        <div styleName='axolotl' />
      </div>
    }
    return this.props.children
  }
}
