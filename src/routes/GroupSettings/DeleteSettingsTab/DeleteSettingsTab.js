import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import Button from 'components/Button'
import classes from './DeleteSettingsTab.module.scss'

class DeleteSettingsTab extends Component {
  deleteGroup = () => {
    const { group: { name }, deleteGroup } = this.props
    if (window.confirm(this.props.t('Are you sure you want to delete the group {{name}}?', { name }))) {
      deleteGroup()
    }
  }

  render () {
    const { group } = this.props
    const { name } = group

    return (
      <div className={classes.container}>
        <div className={classes.title}>{this.props.t('Delete {{groupName}}}, { groupName: name }')}</div>
        <div className={classes.help}>
          {this.props.t('If you delete this group, it will no longer be visible to you or any of the members. All posts will also be deleted.')}
        </div>
        <Button
          label={this.props.t('Delete Group')}
          onClick={this.deleteGroup}
          className={classes.deleteButton}
        />
      </div>
    )
  }
}

DeleteSettingsTab.propTypes = {
  group: PropTypes.object,
  deleteGroup: PropTypes.func
}
export default withTranslation()(DeleteSettingsTab)
