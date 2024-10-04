import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import UploadAttachmentButton from 'components/UploadAttachmentButton'
import classes from './ImportExportSettingsTab.module.scss'

class ImportExportSettingsTab extends Component {
  importStart = () => {
    window.alert(this.props.t('Import started!'))
  }

  render () {
    const { group, t } = this.props
    const { name } = group

    return <div>
      <div className={classes.header}>
        <div className={classes.title}>{t('Import Posts by CSV')}</div>
      </div>
      <div className={classes.help}>
        <b>{t('WARNING: This is a beta feature that at this time will not inform you of import errors, use at your own risk.')}</b>
        <br /><br />
        {t('You can select a CSV file to import posts into {{name}}. Posts will be created by you. The file must have columns with the following headers:', { name })}
        <ul>
          <li>{t('title: text')}</li>
          <li>{t('description: text')}</li>
          <li>{t('location: text')}</li>
          <li>{t('type: one of discussion, request, offer, resource, event, project')}</li>
          <li>{t('start_date (optional): e.g. 20200730-12:23:12.000+00 (other date formats may work)')}</li>
          <li>{t('end_date (optional): e.g. 20200731-12:23:12.000+00 (other date formats may work)')}</li>
          <li>{t('image_urls: 1 or more image URLs separated by spaces and/or commas')}</li>
          <li>{t('topics: up to 3 topic names separated by spaces and/or commas e.g. “food organic”')}</li>
          <li>{t('is_public: true or false')}</li>
        </ul>
      </div>
      <div className={classes.buttonWrapper}>
        <UploadAttachmentButton
          type='importPosts'
          id={group.id}
          attachmentType='csv'
          onSuccess={this.importStart}
        >
          <div className={classes.uploadButton}>{t('Upload CSV')}</div>
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
