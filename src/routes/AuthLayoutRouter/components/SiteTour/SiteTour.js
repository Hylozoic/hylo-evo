import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Joyride from 'react-joyride'
import { useDispatch, useSelector } from 'react-redux'
import getMe from 'store/selectors/getMe'
import updateUserSettings from 'store/actions/updateUserSettings'
import cx from 'classnames'
import 'routes/AuthLayoutRouter/AuthLayoutRouter.scss'

export default function SiteTour ({ currentSiteWidth }) {
  const dispatch = useDispatch()
  const currentUser = useSelector(getMe)
  const [run, setRun] = useState(false)
  const [closeTheTour, setCloseTheTour] = useState(false)
  const desktopWidth = currentSiteWidth > 600
  const { t } = useTranslation()

  const steps = [
    {
      disableBeacon: true,
      target: '#currentContext',
      title: desktopWidth ? t('You are here!') : t('Group menu'),
      content: desktopWidth
        ? t('This is where we show you which group or other view you are looking at. Click here to return to the home page.')
        : t('Press on the group name or icon to navigate within the current group or view. Discover events, discussions, resources & more!')
    },
    {
      target: '#toggleDrawer',
      title: t('Switching groups & viewing all'),
      content: t('This menu allows you to switch between groups, or see updates from all your groups at once.\n\nWant to see what else is out there? Navigate over to Public Groups & Posts to see!')
    }
  ]
  if (desktopWidth) {
    steps.push({
      target: '#groupMenu',
      title: t('Create & navigate'),
      content: t('Here you can switch between types of content and create new content for people in your group or everyone on Hylo!'),
      placement: 'right'
    })
  }
  steps.push({
    target: '#personalSettings',
    title: t('Messages, notifications & profile'),
    content: t('Search for posts & people. Send messages to group members or people you see on Hylo. Stay up to date with current events and edit your profile.')
  })

  const handleClickStartTour = (e) => {
    e.preventDefault()
    setRun(true)
    setCloseTheTour(true)
  }

  const handleCloseTour = () => {
    dispatch(updateUserSettings({ settings: { alreadySeenTour: true } }))
    setRun(false)
    setCloseTheTour(true)
  }

  return (
    <>
      <div styleName={cx('tourWrapper', { tourClosed: closeTheTour })}>
        <div styleName='tourPrompt'>
          <div styleName='tourGuide'><img src='/axolotl-tourguide.png' /></div>
          <div styleName='tourExplanation'>
            <p><strong>{t('Welcome to Hylo')}{' '}{currentUser.name}</strong>{' '}{t('I’d love to show you how things work, would you like a quick tour?')}</p>
            <p>{t('To follow the tour look for the pulsing beacons!')} <span styleName='beaconExample'><span styleName='beaconA' /><span styleName='beaconB' /></span></p>
            <div>
              <button styleName='skipTour' onClick={handleCloseTour}>{t('No thanks')}</button>
              <button styleName='startTour' onClick={handleClickStartTour}>{t('Show me Hylo')}</button>
            </div>
            <div styleName='speechIndicator' />
          </div>
        </div>
        <div styleName='tourBg' onClick={handleCloseTour} />
      </div>
      <Joyride
        run={run}
        continuous
        showProgress
        showClose
        tooltipComponent={TourTooltip}
        steps={steps}
      />
    </>
  )
}

function TourTooltip ({
  continuous,
  index,
  step,
  backProps,
  closeProps,
  primaryProps,
  tooltipProps
}) {
  const { t } = useTranslation()
  return (
    <div {...tooltipProps} styleName='tooltipWrapper'>
      <div styleName='tooltipContent'>
        <div styleName='tourGuide'><img src='/axolotl-tourguide.png' /></div>
        <div>
          {step.title && <div styleName='stepTitle'>{step.title}</div>}
          <div>{step.content}</div>
        </div>
      </div>
      <div styleName='tooltipControls'>
        {index > 0 && (
          <button styleName='backButton' {...backProps}>
            {t('Back')}
          </button>
        )}
        {continuous && (
          <button styleName='nextButton' {...primaryProps}>
            {t('Next')}
          </button>
        )}
        {!continuous && (
          <button {...closeProps}>
            {t('Close')}
          </button>
        )}
      </div>
    </div>
  )
}
