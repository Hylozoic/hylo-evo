import React, { useState } from 'react'
import CookieConsent from 'react-cookie-consent'
import cx from 'classnames'
import './HyloCookieConsent.scss'

export default function HyloCookieConsent () {
  const [showCookieInfo, setShowCookieInfo] = useState(false)

  const toggleShowCookieInfo = () => {
    if (showCookieInfo) {
      setShowCookieInfo(false)
    } else {
      setShowCookieInfo(true)
    }
  }

  return (
    <CookieConsent
      location='bottom'
      buttonText='I understand'
      cookieName='hyloCookieConsent'
      style={{ background: 'rgba(41, 64, 90, .8)' }}
      buttonStyle={{ color: 'rgba(255, 255, 255, 1.00)', fontSize: '13px', backgroundColor: 'rgba(37, 196, 159, 1.00)', borderRadius: '5px' }}
      expires={150}
      onAccept={() => { console.log('here is where we would call a function to store the users cookie preferences') }}
    >
      Hylo uses cookies to enhance the user experience. <button styleName='viewDetails' onClick={toggleShowCookieInfo}>View details</button>
      <div styleName={cx('cookieInformation', { showCookieInfo })}>
        <div styleName='content'>
          <div styleName='pad'>
            <h3>How do we use cookies?</h3>
            <h4>Hylo login &amp; session</h4>
            <p>We use cookies to help understand whether you are logged in and to understand your preferences and where you are in Hylo.</p>
            <h4>Mixpanel</h4>
            <p>We use a service called Mixpanel to understand how people like you use Hylo. Your identity is anonymized but your behavior is recorded so that we can make improvements to Hylo based on how people are using it.</p>
            <h4>Optimizely</h4>
            <p>Optimizely helps us to test improvements to Hylo by showing different users different sets of features. Optimizely tracks who has seen what and how successful the feature is in accomplishing it's goal</p>
            <h4>Intercom</h4>
            <p>When people on Hylo need help or want to report a bug, they are interacting with a service called intercom. Intercom stores cookies in your browser to keep track of conversations with us, the development team.</p>
            <h4>Local storage &amp; cache</h4>
            <p>We store images, icons and application data in your browser to improve performance and load times.</p>
            <button styleName='closeButton' onClick={toggleShowCookieInfo}>Close</button>
          </div>
        </div>
        <div styleName='bg' onClick={toggleShowCookieInfo} />
      </div>
    </CookieConsent>
  )
}
