import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import UploadAttachmentButton from 'components/UploadAttachmentButton'
import './ImportExportSettingsTab.scss'

class ImportExportSettingsTab extends Component {
  importStart = () => {
    window.alert(this.props.t('Import started!'))
  }

  render () {
    const { group, t } = this.props
    const { name } = group

    return <div>
      <div styleName='header'>
        <div styleName='title'>{this.props.t('Import Posts by CSV')}</div>
      </div>
      <div styleName='help'>
        <b>{this.props.t('WARNING: This is a beta feature that at this time will not inform you of imprt errors, use at your own risk.')}</b>
        <br /><br />
        {this.props.t('You can select a CSV file to import posts into {{name}}. Posts will be created by you. The file must have columns with the following headers:', { name })}
        <ul>
          <li>{this.props.t('title: text')}</li>
          <li>{this.props.t('description: text')}</li>
          <li>{this.props.t('location: text')}</li>
          <li>{this.props.t('type: one of discussion, request, offer, resource, event, project')}</li>
          <li>{this.props.t('start_date (optional): e.g. 20200730-12:23:12.000+00 (other date formats may work)')}</li>
          <li>{this.props.t('end_date (optional): e.g. 20200731-12:23:12.000+00 (other date formats may work)')}</li>
          <li>{this.props.t('image_urls: 1 or more image URLs separated by spaces and/or commas')}</li>
          <li>{this.props.t('topics: up to 3 topic names separated by spaces and/or commas e.g. “food organic”')}</li>
          <li>{this.props.t('is_public: true or false')}</li>
        </ul>
      </div>
      <div styleName='button-wrapper'>
        <UploadAttachmentButton
          type='importPosts'
          id={group.id}
          attachmentType='csv'
          onSuccess={this.importStart}
        >
          <div styleName='upload-button'>{this.props.t('Upload CSV')}</div>
        </UploadAttachmentButton>
      </div>
    </div>
  }
}

ImportExportSettingsTab.propTypes = {
  group: PropTypes.object,
  deleteGroup: PropTypes.func
}

export default withTranslation()(ImportExportSettingsTab)
