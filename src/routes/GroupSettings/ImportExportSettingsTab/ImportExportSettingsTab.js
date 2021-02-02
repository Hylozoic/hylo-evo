import PropTypes from 'prop-types'
import React, { Component } from 'react'
import UploadAttachmentButton from 'components/UploadAttachmentButton'
import './ImportExportSettingsTab.scss'

export default class ImportExportSettingsTab extends Component {
  importStart = () => {
    window.alert('Import started!')
  }

  render () {
    const { group } = this.props
    const { name } = group

    return <div>
      <div styleName='header'>
        <div styleName='title'>Import Posts by CSV</div>
      </div>
      <div styleName='help'>
        <b>WARNING: This is a beta feature that at this time will not inform you of imprt errors, use at your own risk.</b>
        <br /><br />
        You can select a CSV file to import posts into {name}. Posts will be created by you. The file must have columns with the following headers:
        <ul>
          <li>title: text</li>
          <li>description: text</li>
          <li>location: text</li>
          <li>type: one of discussion, request, offer, resource, event, project</li>
          <li>start_date (optional): e.g. 20200730-12:23:12.000+00 (other date formats may work)</li>
          <li>end_date (optional): e.g. 20200731-12:23:12.000+00 (other date formats may work)</li>
          <li>image_urls: 1 or more image URLs separated by spaces and/or commas</li>
          <li>topics: up to 3 topic names separated by spaces and/or commas e.g. “food organic”</li>
          <li>is_public: true or false</li>
        </ul>
      </div>
      <div styleName='button-wrapper'>
        <UploadAttachmentButton
          type='importPosts'
          id={group.id}
          attachmentType='csv'
          onSuccess={this.importStart}
        >
          <div styleName='upload-button'>Upload CSV</div>
        </UploadAttachmentButton>
      </div>
    </div>
  }
}

ImportExportSettingsTab.propTypes = {
  group: PropTypes.object,
  deleteGroup: PropTypes.func
}
