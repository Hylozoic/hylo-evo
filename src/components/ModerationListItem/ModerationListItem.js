import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'

import { agreementsURL, RESP_MANAGE_CONTENT } from 'store/constants'
import getPlatformAgreements from 'store/selectors/getPlatformAgreements'
import getMe from 'store/selectors/getMe'
import hasResponsibilityForGroup from 'store/selectors/hasResponsibilityForGroup'
import useRouterParams from 'hooks/useRouterParams'
import Avatar from 'components/Avatar/Avatar'
import MultiSelect from 'components/MultiSelect/MultiSelect'
import { groupUrl } from 'util/navigation'
import Button from 'components/Button/Button'
import PostListRow from 'components/PostListRow'

import classes from './ModerationListItem.module.scss'

const ModerationListItem = ({
  moderationAction,
  handleClearModerationAction,
  handleConfirmModerationAction,
  navigateToPost,
  group
}) => {
  const { t } = useTranslation()
  const currentUser = useSelector(getMe)
  const routeParams = useRouterParams()
  const location = useLocation()
  const querystringParams = new URLSearchParams(location.search)
  const canModerate = useSelector((state) => hasResponsibilityForGroup(state, { groupId: group.id, responsibility: [RESP_MANAGE_CONTENT] }))

  const {
    agreements,
    anonymous,
    post,
    reporter,
    status,
    text
  } = moderationAction

  const platformAgreementsIds = moderationAction.platformAgreements.map(agreement => agreement.id)
  const allPlatformAgreements = useSelector(getPlatformAgreements)
  const platformAgreements = allPlatformAgreements.filter(agreement => platformAgreementsIds.includes(agreement.id))
  const reporterUrl = `/user/${reporter.id}` // TODO COMOD, fix this
  const groupAgreementsUrl = group ? groupUrl(group.slug) + `/group/${group.slug}` : ''
  const currentUserIsReporter = reporter.id === currentUser.id

  t('status-active')
  t('status-cleared')

  return (
    <div className='moderation-action-card'>
      <div className='card-header'>
        <span className='userName' style={{ marginRight: '8px' }}>{t('Reported by')}:</span>
        {anonymous && !canModerate
          ? (<span>{t('Anonymous')}</span>)
          : (
            <div className='reporter-info'>
              <Avatar avatarUrl={reporter.avatarUrl} url={reporterUrl} className='avatar' />
              <Link to={reporterUrl} className='userName'>{reporter.name}</Link>
            </div>)}
      </div>

      <div className='card-body'>
        <span className={status}>{t('status-' + status)}</span>
        <h3>{t('Complaint')}:</h3>
        <p>{text}</p>
        <h3>{t('Reported content')}:</h3>
        <PostListRow
          post={post}
          currentGroupId={group && group.id}
          currentUser={currentUser}
          routeParams={routeParams}
          querystringParams={querystringParams}
        />
        <div className='agreements'>
          {agreements.length > 0 && (
            <>
              <h3>{t('Group Agreements broken')}:</h3>
              <MultiSelect items={agreements} />
              <a href={groupAgreementsUrl} target='_blank' rel='noopener noreferrer' className='agreements-link'>{t('Link to group agreements')}</a>
            </>)}
          {platformAgreements.length > 0 && (
            <>
              <p>----</p>
              <h3>{t('Platform Agreements broken')}:</h3>
              <MultiSelect items={platformAgreements} />
              <a href={agreementsURL} target='_blank' rel='noopener noreferrer' className='agreements-link'>{t('Link to platform agreements')}</a>
            </>)}
        </div>
      </div>

      <div className='card-footer'>
        {(canModerate || currentUserIsReporter) && status !== 'cleared' && (
          <Button
            onClick={handleClearModerationAction}
            label={t('Clear')}
            color='purple'
            // dataTip={t('Clear this flag from the content')}
            // dataFor='submit-tt'
          />
        )}
      </div>
    </div>
  )
}

export default ModerationListItem
