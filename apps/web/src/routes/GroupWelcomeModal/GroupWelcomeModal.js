import cx from 'classnames'
import { isEmpty, trim } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { CSSTransition } from 'react-transition-group'
import { TextHelpers } from 'hylo-shared'
import { bgImageStyle } from 'util/index'
import getMe from 'store/selectors/getMe'
import getGroupForCurrentRoute from 'store/selectors/getGroupForCurrentRoute'
import getMyGroupMembership from 'store/selectors/getMyGroupMembership'
import presentGroup from 'store/presenters/presentGroup'
import { DEFAULT_AVATAR, DEFAULT_BANNER } from 'store/models/Group'
import { addSkill as addSkillAction, removeSkill as removeSkillAction } from 'components/SkillsSection/SkillsSection.store'
import { fetchGroupWelcomeData } from './GroupWelcomeModal.store'
import { updateMembershipSettings } from 'routes/UserSettings/UserSettings.store'
import Button from 'components/Button'
import ClickCatcher from 'components/ClickCatcher'
import HyloHTML from 'components/HyloHTML'
import RoundImage from 'components/RoundImage'
import { SuggestedSkills } from 'routes/GroupDetail/GroupDetail'
import classes from './GroupWelcomeModal.module.scss'

export default function GroupWelcomeModal (props) {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const currentUser = useSelector(getMe)
  const location = useLocation()
  const currentGroup = useSelector(state => getGroupForCurrentRoute(state, location))
  const group = presentGroup(currentGroup)
  const currentMembership = useSelector(state => getMyGroupMembership(state, location))
  const membershipAgreements = currentMembership?.agreements.toModelArray()
  const { agreementsAcceptedAt, joinQuestionsAnsweredAt } = currentMembership?.settings || {}
  const [page, setPage] = useState(1)

  const numAgreements = group?.agreements?.length || 0
  const [currentAgreements, setCurrentAgreements] = useState(Array(numAgreements).fill(false))

  const numCheckedAgreements = currentAgreements.reduce((count, agreement) => count + (agreement ? 1 : 0), 0)
  const checkedAllAgreements = numCheckedAgreements === numAgreements

  const agreementsChanged = numAgreements > 0 &&
    (!agreementsAcceptedAt || agreementsAcceptedAt < currentGroup.settings.agreementsLastUpdatedAt)

  const [questionAnswers, setQuestionAnswers] = useState(group?.joinQuestions.map(q => { return { questionId: q.questionId, text: q.text, answer: '' } }))
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(!group?.settings?.askJoinQuestions || !!joinQuestionsAnsweredAt)

  const hasFirstPage = numAgreements > 0
  const hasSecondPage = (group?.settings?.askJoinQuestions && questionAnswers?.length > 0 && !joinQuestionsAnsweredAt) ||
    (group?.settings?.showSuggestedSkills && group?.suggestedSkills?.length > 0)

  const showWelcomeModal = currentMembership?.settings?.showJoinForm || agreementsChanged || !joinQuestionsAnsweredAt

  useEffect(() => {
    if (group?.id && currentMembership) dispatch(fetchGroupWelcomeData(group.id, currentUser.id))
  }, [currentMembership?.id])

  useEffect(() => {
    if (numAgreements > 0) {
      setCurrentAgreements(group.agreements.map(ga => membershipAgreements?.find(ma => ma.id === ga.id)?.accepted))
    }
  }, [group?.agreements?.length, membershipAgreements?.length])

  useEffect(() => {
    if (group?.joinQuestions?.length > 0) {
      setQuestionAnswers(group?.joinQuestions.map(q => { return { questionId: q.questionId, text: q.text, answer: '' } }))

      // not loading answers right now, so we know if answered before by whether joinQuestionsAnsweredAt is set
      setAllQuestionsAnswered(!group?.settings?.askJoinQuestions || !!joinQuestionsAnsweredAt)

      // If dont have agreements to show come straight to the join questions page
      if (!hasFirstPage) {
        setPage(2)
      }
    }
  }, [group?.joinQuestions?.length])

  if (!showWelcomeModal || !group || !currentMembership) return null

  const handleCheckAgreement = e => {
    const accepted = e.target.checked
    const agreementIndex = e.target.value
    const newAgreements = [...currentAgreements]
    newAgreements[agreementIndex] = accepted
    setCurrentAgreements(newAgreements)
  }

  const handleCheckAllAgreements = e => {
    const accepted = !checkedAllAgreements
    const newAgreements = Array(numAgreements).fill(accepted)
    setCurrentAgreements(newAgreements)
  }

  const handleAccept = async () => {
    if (page === 1 && hasSecondPage) {
      setPage(2)
      return
    }

    await dispatch(updateMembershipSettings(
      group.id,
      { joinQuestionsAnsweredAt: new Date(), showJoinForm: false },
      true,
      questionAnswers ? questionAnswers.map(q => ({ questionId: q.questionId, answer: q.answer })) : []
    ))
    return null
  }

  const handleAnswerQuestion = (index) => (event) => {
    const answerValue = event.target.value
    setQuestionAnswers(prevAnswers => {
      const newAnswers = [...prevAnswers]
      newAnswers[index].answer = answerValue
      setAllQuestionsAnswered(newAnswers.every(a => trim(a.answer).length > 0))
      return newAnswers
    })
  }

  const addSkill = name => dispatch(addSkillAction(name))
  const removeSkill = skillId => dispatch(removeSkillAction(skillId))

  return (
    <CSSTransition
      classNames='welcome-modal'
      appear
      in
      timeout={{ appear: 400, enter: 400, exit: 300 }}
    >
      <div className={classes.welcomeModalWrapper} key='welcome-modal'>
        <div className={cx(classes.welcomeModal, classes[`viewingPage${page}`])}>
          <div style={bgImageStyle(group.bannerUrl || DEFAULT_BANNER)} className={classes.banner}>
            <div className={classes.bannerContent}>
              <RoundImage url={group.avatarUrl || DEFAULT_AVATAR} size='50px' square />
              <h2>{t('Welcome to {{group.name}}!', { group })}</h2>
              {hasFirstPage && hasSecondPage ? <span className={classes.pageNumber}>({page}/2)</span> : ''}
            </div>
            <div className={classes.fade} />
          </div>
          <div className={cx(classes.welcomeContent, classes.page1)}>
            {!isEmpty(group.purpose) &&
              <div>
                <h2>{t('Our Purpose')}</h2>
                <p>{group.purpose}</p>
              </div>}
            {group.agreements?.length > 0 && (
              <div className={cx(classes.agreements, classes.welcomeSection)}>
                <h2>{t('Our Agreements')}</h2>
                {currentMembership?.settings.agreementsAcceptedAt && agreementsChanged
                  ? <p className={classes.agreementsChanged}>{t('The agreements have changed since you last accepted them. Please review and accept them again.')}</p>
                  : null}
                <ol>
                  {group.agreements.map((agreement, i) => {
                    return (
                      <li className={cx(classes.agreement, { [classes.borderBottom]: group.agreements.length > 1 && i !== (group.agreements.length - 1) })} key={i}>
                        <h3>{agreement.title}</h3>
                        <div className={classes.agreementDescription}>
                          <ClickCatcher>
                            <HyloHTML element='p' html={TextHelpers.markdown(agreement.description)} />
                          </ClickCatcher>
                        </div>
                        <input
                          className={classes.iAgree}
                          type='checkbox'
                          id={'agreement' + agreement.id}
                          data-testid={'cbAgreement' + i}
                          value={i}
                          onChange={handleCheckAgreement}
                          checked={currentAgreements[i] || false}
                        />
                        <label htmlFor={'agreement' + agreement.id} className={cx(classes.iAgree, { [classes.accepted]: currentAgreements[i] })}>
                          {t('I agree to the above')}
                        </label>
                      </li>
                    )
                  })}
                </ol>
                {numAgreements > 3 &&
                  <div>
                    <input
                      type='checkbox'
                      id='checkAllAgreements'
                      onChange={handleCheckAllAgreements}
                      checked={checkedAllAgreements}
                    />
                    <label htmlFor='checkAllAgreements' className={cx({ [classes.accepted]: checkedAllAgreements })}>
                      {t('I agree to all of the above')}
                    </label>
                  </div>}
              </div>
            )}
          </div>
          <div className={cx(classes.welcomeContent, classes.page2)}>
            {!isEmpty(group.purpose) &&
              <div>
                <h2>{t('Our Purpose')}</h2>
                <p>{group.purpose}</p>
              </div>}

            {group?.settings?.showSuggestedSkills && group.suggestedSkills?.length > 0 &&
              <SuggestedSkills addSkill={addSkill} currentUser={currentUser} group={group} removeSkill={removeSkill} />}

            {!joinQuestionsAnsweredAt && group.settings?.askJoinQuestions && questionAnswers?.length > 0 && <div className={classes.questionsHeader}>{t('Please answer the following questions to enter')}</div>}
            {!joinQuestionsAnsweredAt && group.settings?.askJoinQuestions && questionAnswers && questionAnswers.map((q, index) => (
              <div className={classes.joinQuestion} key={index}>
                <h3>{q.text}</h3>
                <textarea name={`question_${q.questionId}`} onChange={handleAnswerQuestion(index)} value={q.answer} placeholder={t('Type your answer here...')} />
              </div>)
            )}
          </div>
          <div className={classes.callToAction}>
            {page === 2 && hasFirstPage && (
              <Button
                color='purple'
                className={classes.previousButton}
                label={t('Previous')}
                onClick={() => setPage(1)}
              />
            )}
            <Button
              dataTestId='jump-in'
              disabled={(page === 1 && !checkedAllAgreements) || (page === 2 && !allQuestionsAnswered)}
              label={page === 1 && hasSecondPage ? t('Next') : t('Jump in!')}
              onClick={handleAccept}
            />
          </div>
        </div>
      </div>
    </CSSTransition>
  )
}
