import PropTypes from 'prop-types';
import React, { Component } from 'react';
import './ReplaceComponent.scss'
const { string } = PropTypes

export default class ReplaceComponent extends Component {
  static propTypes = {
    example: string
  }

  render () {
    const { example } = this.props
    return <div styleName='exampleName'>{example}</div>
  }
}
