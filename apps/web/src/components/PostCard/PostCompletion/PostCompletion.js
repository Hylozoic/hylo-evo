import React from 'react'
import { useTranslation } from 'react-i18next'
import classes from './PostCompletion.module.scss'
import DropdownButton from 'components/DropdownButton'

export default function PostCompletion ({ type, startTime, endTime, isFulfilled, fulfillPost, unfulfillPost }) {
  const { t } = useTranslation()

  const promptOptions = {
    request: t('Is this request still needed?'),
    offer: t('Is this offer still available?'),
    resource: t('Is this resource still available?'),
    project: t('Is this project still active?'),
    proposal: t('Is this proposal complete?')
  }

  const messages = {
    request: [
      { label: t('This is still needed'), value: false },
      { label: t('No longer needed'), value: true }
    ],
    offer: [
      { label: t('Available'), value: false },
      { label: t('Unavailable'), value: true }
    ],
    resource: [
      { label: t('Available'), value: false },
      { label: t('Unavailable'), value: true }
    ],
    project: [
      { label: t('Active'), value: false },
      { label: t('Completed'), value: true }
    ],
    proposal: [
      { label: t('No'), value: false },
      { label: t('Yes, I am ready to summarize'), value: true }
    ]
  }
  const label = messages[type].find(choice => choice.value === !!isFulfilled).label

  const prompt = promptOptions[type]
  const choices = messages[type]

  return <div className={classes.postCompletion}>
    <div>{prompt}</div>
    <DropdownButton label={label}
      choices={choices}
      onChoose={response => {
        response === false ? unfulfillPost() : fulfillPost()
      }} />
  </div>
}
