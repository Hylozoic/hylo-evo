import cx from 'classnames'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import Icon from 'components/Icon'
import AtAGlanceWidget from 'components/Widget/AtAGlanceWidget'
import AnnouncementWidget from 'components/Widget/AnnouncementWidget'
import EventsWidget from 'components/Widget/EventsWidget'
import GroupsWidget from 'components/Widget/GroupsWidget'
import GroupTopicsWidget from 'components/Widget/GroupTopicsWidget'
import MembersWidget from 'components/Widget/MembersWidget'
import OffersAndRequestsWidget from 'components/Widget/OffersAndRequestsWidget'
import ProjectsWidget from 'components/Widget/ProjectsWidget'
import RecentPostsWidget from 'components/Widget/RecentPostsWidget'
import WelcomeWidget from 'components/Widget/WelcomeWidget'
import VisibilityToggle from 'components/VisibilityToggle'
import useGetWidgetItems from 'hooks/useGetWidgetItems'
import FarmDetailsWidget from './FarmDetailsWidget'
import FarmOpenToPublic from './FarmOpenToPublic'
import FarmMapWidget from './FarmMapWidget'
import StewardsWidget from './StewardsWidget'
import OpportunitiesToCollaborateWidget from './OpportunitiesToCollaborateWidget'
import PrivacyWidget from './PrivacyWidget'
import RichTextWidget from './RichTextWidget'
import JoinWidget from './JoinWidget'
import TopicsWidget from './TopicsWidget'
import { useSelector, useDispatch } from 'react-redux'
import useEnsureCurrentGroup from 'hooks/useEnsureCurrentGroup'
import getMe from 'store/selectors/getMe'
import { updateWidget } from './Widget.store'

import classes from './Widget.module.scss'

export default function Widget (props) {
  const { t } = useTranslation()
  const WIDGETS = {
    text_block: {
      title: '',
      adminTitle: t('Welcome Message'),
      component: WelcomeWidget
    },
    announcements: {
      title: t('Announcements'),
      component: AnnouncementWidget
    },
    active_members: {
      title: t('Recently Active Members'),
      component: MembersWidget
    },
    requests_offers: {
      title: t('Open Requests & Offers'),
      component: OffersAndRequestsWidget
    },
    posts: {
      title: t('Recent Posts'),
      component: RecentPostsWidget
    },
    community_topics: {
      title: t('Community Topics'),
      component: GroupTopicsWidget
    },
    events: {
      title: t('Upcoming Events'),
      component: EventsWidget
    },
    project_activity: {
      title: t('Recently Active Projects'),
      component: ProjectsWidget
    },
    group_affiliations: {
      title: t('Subgroups'),
      component: GroupsWidget
    },
    relevant_project_activity: {
      title: t('Recently Active Projects'),
      component: ProjectsWidget
    },
    relevant_groups: {
      title: t('Nearby Relevant Groups'), // TODO: ensure there is a way to customize/overwrite this
      component: GroupsWidget
    },
    relevant_events: {
      title: t('Nearby Relevant Events'), // TODO: ensure there is a way to customize/overwrite this
      component: EventsWidget
    },
    relevant_requests_offers: {
      title: t('Nearby Relevant Offers and Requests'), // TODO: ensure there is a way to customize/overwrite this
      component: OffersAndRequestsWidget
    },
    farm_at_a_glance: {
      title: t('At A Glance'),
      component: AtAGlanceWidget
    },
    farm_details: {
      title: t('Farm Details'),
      component: FarmDetailsWidget
    },
    farm_open_to_public: {
      title: t('Location & Hours'),
      component: FarmOpenToPublic
    },
    farm_map: {
      title: t('Farm Surrounds & Posts'),
      component: FarmMapWidget
    },
    stewards: {
      title: t('Stewards'), // TODO: ensure there is a way to customize/overwrite this
      component: StewardsWidget
    },
    opportunities_to_collaborate: {
      title: t('Opportunities to Collaborate'),
      component: OpportunitiesToCollaborateWidget
    },
    privacy_settings: {
      title: t('Privacy'),
      component: PrivacyWidget
    },
    mission: {
      title: null,
      component: RichTextWidget
    },
    join: {
      title: null,
      component: JoinWidget
    },
    topics: {
      title: null,
      component: TopicsWidget
    }
  }
  const HiddenWidget = ({ name }) => {
    const { t } = useTranslation()
    return (
      <div className={classes.hiddenDescription}>
        <h4><Icon name='Hidden' className={classes.hiddenIcon} /> {t('Hidden')}</h4>
        <p>{t('The {{title}} section is not visible to members of this group. Click the three dots', { title: WIDGETS[name].adminTitle || WIDGETS[name].title })} (<Icon name='More' className={classes.moreIcon} />) {t('above this box to change the visibility settings. Only administrators can see this message')}.</p>
      </div>
    )
  }

  const dispatch = useDispatch()
  const { childGroups, id, canEdit, isVisible, name, posts, isMember, settings = {} } = props
  const routeParams = useParams()
  const { group } = useEnsureCurrentGroup()
  const currentUser = useSelector(getMe)
  const handleUpdateWidget = (id, changes) => dispatch(updateWidget(id, changes))

  if (!WIDGETS[name]) return null

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isEditingSettings, setIsEditingSettings] = useState(false)
  const [newSettings, updateSettings] = useState({
    title: settings.title || '',
    text: settings.text || ''
  })

  // Changing this to a hook so that we can use other hooks to manage the diverse data requirements of all of the new widgets
  const widgetItems = useGetWidgetItems({ childGroups, currentUser, name, group, posts })

  return (
    <div className={cx(classes.widget, { [classes.editingSettings]: isEditingSettings })}>
      {/* TODO: ADMIN RESP? Add something for RESP here */}
      {canEdit || (isVisible && widgetItems)
        ? (
          <div className={classes.header}>
            <h3>{(canEdit && WIDGETS[name].adminTitle) || WIDGETS[name].title}</h3>
            {canEdit && <div className={classes.more}>
              <Icon name='More' className={cx(classes.moreIcon, { [classes.selected]: isMenuOpen })} onClick={() => { setIsMenuOpen(!isMenuOpen); setIsEditingSettings(false) }} />
              <div className={cx(classes.editMenu, { [classes.visible]: isMenuOpen })}>
                {!isEditingSettings && <div className={classes.editSection}>
                  <span className={classes.triangle}>&nbsp;</span>
                  {name === 'text_block' && <div className={classes.editSettings}><span onClick={() => setIsEditingSettings(!isEditingSettings)}><Icon name='Edit' /> {t('Edit welcome message')}</span></div>}
                  <div className={classes.visibilitySettings}>
                    <VisibilityToggle
                      id={id}
                      checked={isVisible}
                      onChange={() => handleUpdateWidget(id, { isVisible: !isVisible })}
                      className={classes.widgetVisibility}
                      backgroundColor={isVisible ? 'gray' : 'black'} /> <span className={classes.visibilityLabel}>{t('Visibility')}:</span> {isVisible ? t('Visible') : t('Hidden')}
                  </div>
                </div>}
              </div>
            </div>}
          </div>
        )
        : ''}
      {canEdit && isEditingSettings &&
        <EditForm
          id={id}
          setIsEditingSettings={setIsEditingSettings}
          setIsMenuOpen={setIsMenuOpen}
          newSettings={newSettings}
          updateSettings={updateSettings}
          save={handleUpdateWidget}
        />}
      <div className={cx(classes.content, { [classes.hidden]: !isVisible })}>
        {isVisible ? (widgetItems ? React.createElement(WIDGETS[name].component, { items: widgetItems, group, routeParams, settings, isMember: !!isMember }) : null)
          : canEdit ? <HiddenWidget name={name} /> : null
        }
      </div>
    </div>
  )
}

const EditForm = ({ id, setIsEditingSettings, setIsMenuOpen, newSettings, updateSettings, save }) => {
  const { t } = useTranslation()
  return (
    <div className={classes.editForm}>
      <div>
        <input
          type='text'
          autoFocus
          onChange={e => updateSettings({ ...newSettings, title: e.target.value.substring(0, 50) })}
          placeholder={t('Enter a title')}
          value={newSettings.title}
        />
        <div className={classes.chars}>{(newSettings.title && newSettings.title.length) || 0}/{50}</div>
      </div>

      <div>
        <textarea
          type='text'
          onChange={e => updateSettings({ ...newSettings, text: e.target.value.substring(0, 500) })}
          placeholder={t('Enter your message here')}
          value={newSettings.text}
        />
        <div className={classes.chars}>{(newSettings.text && newSettings.text.length) || 0}/{500}</div>
      </div>

      <div className={classes.buttons}>
        <span
          className={classes.cancel}
          onClick={() => {
            setIsEditingSettings(false)
            setIsMenuOpen(true)
          }}
        >
          {t('Cancel')}
        </span>
        <span className={classes.save} onClick={() => { save(id, { settings: newSettings }); setIsEditingSettings(false); setIsMenuOpen(false) }}>{t('Save')}</span>
      </div>

    </div>
  )
}
