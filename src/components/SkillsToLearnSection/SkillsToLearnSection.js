import React from 'react'
import { useTranslation } from 'react-i18next'
import SkillsSection from '../SkillsSection/SkillsSection'

const SkillsToLearnSection = (props) => {
  const { t } = useTranslation()
  return <SkillsSection {...props} label={t('Add a skill you want to learn')} placeholder={t('What skills do you want to learn?')} />
}

export default SkillsToLearnSection
