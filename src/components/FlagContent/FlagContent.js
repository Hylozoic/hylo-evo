import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { isEmpty } from 'lodash'
import { createModerationAction } from 'store/actions/moderationActions'
import getGroupForDetail from 'store/selectors/getGroupForDetails'
import getPlatformAgreements from 'store/selectors/getPlatformAgreements'
import './FlagContent.scss'
import Button from 'components/Button'
import Icon from 'components/Icon'
import MultiSelect from 'components/MultiSelect/MultiSelect'
import TextareaAutosize from 'react-textarea-autosize'
import presentGroup from 'store/presenters/presentGroup'
import { groupUrl } from 'util/navigation'
import CheckBox from 'components/CheckBox'
import { agreementsURL } from 'store/constants'

const FlagContent = ({ onClose, linkData, type = 'content' }) => {
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

  // const options = [
  //   { label: t('Inappropriate Content'), id: 'inappropriate' },
  //   { label: t('Spam'), id: 'spam' },
  //   { label: t('Offensive'), id: 'offensive' },
  //   { label: t('Abusive'), id: 'abusive' },
  //   { label: t('Illegal'), id: 'illegal' },
  //   { label: t('Other'), id: 'other' }
  // ]

  return (
    <div styleName='popup'>
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
          {group && (
            <>
              <h3>{t('Not permitted in {{groupName}}', { groupName: group?.name })}</h3>
              <a href={groupAgreementsUrl} target='_blank' rel='noopener noreferrer' styleName='agreements-link'>{t('Link to group agreements')}</a>
              <MultiSelect items={agreements} selected={agreementsSelected} handleSelect={handleAgreementsSelect} hideAfter={3} />
            </>
          )}
          <h3>{t('Violations of platform agreements')}</h3>
          <a href={agreementsURL} target='_blank' rel='noopener noreferrer' styleName='agreements-link'>{t('Link to platform agreements')}</a>
          <h5>{t('Not permitted in Public Spaces')}</h5>
          <MultiSelect items={platformAgreements.filter((ag) => ag.type !== 'anywhere')} selected={platformAgreementsSelected} handleSelect={handlePlatformAgreementsSelect} hideAfter={2} />
          <h5>{t('Not permitted anywhere on the platform')}</h5>
          <MultiSelect items={platformAgreements.filter((ag) => ag.type === 'anywhere')} selected={platformAgreementsSelected} handleSelect={handlePlatformAgreementsSelect} hideAfter={2} />
          <div styleName='submission'>
            <CheckBox
              checked={anonymous}
              label={t('Anonymous (moderators will see your name)')}
              onChange={value => setAnonymous(value)}
              labelClass='anon-label'
            />
            <Button styleName='submit-btn' onClick={submit} disabled={!isValid()}>
              {t('Submit')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FlagContent
