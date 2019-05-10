import PropTypes from 'prop-types'
import React, { Component } from 'react'
import './DeleteSettingsTab.scss'
import Button from 'components/Button'
import Loading from 'components/Loading'
const { object, func } = PropTypes

export default class DeleteSettingsTab extends Component {
  static propTypes = {
    community: object,
    deleteCommunity: func
  }

  deleteCommunity = () => {
    const { community: { name }, deleteCommunity } = this.props
    if (window.confirm(`Are you sure you want to delete the community ${name}?`)) {
      deleteCommunity()
    }
  }

  render () {
    const { community } = this.props
    const { name } = community

    return <div>
      <div styleName='header'>
        <div styleName='title'>Delete {name}</div>
      </div>
      <div>
        <Button
          label='Delete Community'
          onClick={this.deleteCommunity} />
      </div>
    </div>
  }
}
