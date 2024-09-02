import { isEmpty } from 'lodash'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import TextareaAutosize from 'react-textarea-autosize'
import Button from 'components/Button'
import CheckBox from 'components/CheckBox'
import Icon from 'components/Icon'
import MultiSelect from 'components/MultiSelect'
import { createModerationAction } from 'store/actions/moderationActions'
import { agreementsURL } from 'store/constants'
import presentGroup from 'store/presenters/presentGroup'
import getGroupForDetail from 'store/selectors/getGroupForDetails'
import getPlatformAgreements from 'store/selectors/getPlatformAgreements'
import { groupUrl } from 'util/navigation'
import './FlagGroupContent.scss'
import Tooltip from 'components/Tooltip'

const FlagGroupContent = ({ onClose, linkData, type = 'content' }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { id, slug } = linkData || {}

  const platformAgreements = useSelector(getPlatformAgreements)
  const currentGroup = useSelector(state => getGroupForDetail(state, { slug }))
  const group = presentGroup(currentGroup)

  const agreements = group?.agreements || []
  const groupAgreementsUrl = group ? groupUrl(group.slug) + `/group/${group.slug}` : ''

  const [anonymous, setAnonymous] = useState(false)
  const [explanation, setExplanation] = useState('')
  const [subtitle, setSubtitle] = useState(t('What was wrong?'))
  const [agreementsSelected, setAgreementsSelected] = useState([])
  const [platformAgreementsSelected, setPlatformAgreementsSelected] = useState([])

  const isValid = () => {
    if (isEmpty(agreementsSelected) && isEmpty(platformAgreementsSelected)) return false
    if (explanation.length < 5) return false
    return true
  }

  const closeModal = () => {
    if (onClose) {
      onClose()
    }
  }

  const handleAgreementsSelect = (selected) => {
    if (agreementsSelected.includes(selected)) {
      setAgreementsSelected(agreementsSelected.filter(ag => ag !== selected))
    } else {
      setAgreementsSelected([...agreementsSelected, selected])
    }
  }

  const handlePlatformAgreementsSelect = (selected) => {
    if (platformAgreementsSelected.includes(selected)) {
      setPlatformAgreementsSelected(platformAgreementsSelected.filter(ag => ag !== selected))
    } else {
      setPlatformAgreementsSelected([...platformAgreementsSelected, selected])
    }
  }

  const submit = () => {
    dispatch(createModerationAction({ text: explanation, postId: id, groupId: group.id, agreements: agreementsSelected, platformAgreements: platformAgreementsSelected, anonymous }))
    closeModal()
    return true
  }

  return (
    <div styleName='popup' onClick={(e) => e.stopPropagation()}>
      <div styleName='popup-inner'>
        <h1>{t('Explanation for Flagging')}</h1>
        <span onClick={closeModal} styleName='close-btn'>
          <Icon name='Ex' styleName='icon' />
        </span>

        <div styleName='content'>
          <div styleName='explainer'>
            {t('flaggingExplainer')}
          </div>
          <div styleName='explainer reason-required'>
            {t('flagsNeedACategory')}
          </div>
          <TextareaAutosize
            styleName='explanation-textbox'
            minRows={6}
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            placeholder={subtitle}
          />
          {group && agreements.length > 0 && (
            <>
              <h3>{t('Not permitted in {{groupName}}', { groupName: group?.name })}</h3>
              <a href={groupAgreementsUrl} target='_blank' rel='noopener noreferrer' styleName='agreements-link'>{t('Link to group agreements')}</a>
              <MultiSelect items={agreements} selected={agreementsSelected} handleSelect={handleAgreementsSelect} />
            </>
          )}
          <h3>{t('Violations of platform agreements')}</h3>
          <a href={agreementsURL} target='_blank' rel='noopener noreferrer' styleName='agreements-link'>{t('Link to platform agreements')}</a>
          <h5>{t('Not permitted in Public Spaces')}</h5>
          <MultiSelect items={platformAgreements.filter((ag) => ag.type !== 'anywhere')} selected={platformAgreementsSelected} handleSelect={handlePlatformAgreementsSelect} />
          <h5>{t('Not permitted anywhere on the platform')}</h5>
          <MultiSelect items={platformAgreements.filter((ag) => ag.type === 'anywhere')} selected={platformAgreementsSelected} handleSelect={handlePlatformAgreementsSelect} />
          <div styleName='submission'>
            <CheckBox
              checked={anonymous}
              label={t('Anonymous (moderators will see your name)')}
              onChange={value => setAnonymous(value)}
              labelClass='anon-label'
            />
            <Button styleName='submit-btn' onClick={submit} disabled={!isValid()} dataTip={t('Select an agreement and add an explanation for why you are flagging this post')} dataFor='flagging-submit-tt'>
              {t('Submit')}
            </Button>
            <Tooltip
              id='flagging-submit-tt'
              delay={250}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default FlagGroupContent
