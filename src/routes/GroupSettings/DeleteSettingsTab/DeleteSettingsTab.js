import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Button from 'components/Button'
import './DeleteSettingsTab.scss'

export default class DeleteSettingsTab extends Component {
  deleteGroup = () => {
    const { group: { name }, deleteGroup } = this.props
    if (window.confirm(`Are you sure you want to delete the group ${name}?`)) {
      deleteGroup()
    }
  }

  render () {
    const { group } = this.props
    const { name } = group

    return <div>
      <div styleName='header'>
        <div styleName='title'>Delete {name}</div>
      </div>
      <div styleName='help'>
        If you delete this group, it will no longer be visible to you or any of the members. All posts will also be deleted.
      </div>
      <div styleName='button-wrapper'>
        <Button
          label='Delete Group'
          onClick={this.deleteGroup}
          styleName='delete-button' />
      </div>
    </div>
  }
}

DeleteSettingsTab.propTypes = {
  group: PropTypes.object,
  deleteGroup: PropTypes.func
}
