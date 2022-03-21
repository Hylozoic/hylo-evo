import cx from 'classnames'
import CookieConsent from 'react-cookie-consent'
import { some } from 'lodash/fp'
import React, { useState } from 'react'
import Div100vh from 'react-div-100vh'
import { matchPath, Redirect, Route, Link, Switch } from 'react-router-dom'
import Particles from 'react-particles-js'
import particlesjsConfig from './particlesjsConfig'
import Button from 'components/Button'
import Login from './Login'
import Signup from './Signup'
import TopicSupportComingSoon from 'components/TopicSupportComingSoon'
import GroupDetail from 'routes/GroupDetail'
import MapExplorer from 'routes/MapExplorer'
import PasswordReset from 'routes/NonAuthLayout/PasswordReset'
import PostDetail from 'routes/PostDetail'
import { OPTIONAL_POST_MATCH, OPTIONAL_GROUP_MATCH, POST_DETAIL_MATCH, GROUP_DETAIL_MATCH } from 'util/navigation'
import { DETAIL_COLUMN_ID } from 'util/scrolling'
import './NonAuthLayout.scss'

const particlesStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%'
}

export default function NonAuthLayout (props) {
  const [showCookieInfo, setShowCookieInfo] = useState(false)
  const { location } = props

  const toggleShowCookieInfo = () => {
    if (showCookieInfo === true) {
      setShowCookieInfo(false)
    } else {
      setShowCookieInfo(true)
    }
  }

  const hasDetail = some(
    ({ path }) => matchPath(location.pathname, { path, exact: true }),
    detailRoutes
  )

  return (
    <Div100vh styleName='nonAuthContainer'>
      <div styleName='background'>
        <div styleName='particlesBackgroundWrapper'>
          <Particles params={particlesjsConfig} style={particlesStyle} />
        </div>
        <div styleName='topRow'>
          <a href='/'>
            <img styleName='logo' src='/assets/hylo.svg' alt='Hylo logo' />
          </a>
        </div>
        <Switch>
          <Route
            path='/login'
            component={() => (
              <div styleName='signupRow'>
                <Login {...props} styleName='form' />
              </div>
            )}
          />
          <Route
            path='/reset-password'
            component={() => (
              <div styleName='signupRow'>
                <PasswordReset {...props} styleName='form' />
              </div>
            )}
          />
          <Route
            path='/signup'
            component={() => (
              <div styleName='signupRow'>
                <Signup {...props} styleName='form' />
              </div>
            )}
          />
          <Route path={`/:context(public)/:view(map)/${OPTIONAL_POST_MATCH}`} exact component={MapExplorer} />
          <Route path={`/:context(public)/:view(map)/${OPTIONAL_GROUP_MATCH}`} exact component={MapExplorer} />
          <Route path='/:context(public)/:topicName' exact component={TopicSupportComingSoon} />
          <Redirect from={`/public/${OPTIONAL_POST_MATCH}`} exact to='/public/map' key='streamToMap' />
        </Switch>
        <div styleName={cx('detail', { hidden: !hasDetail })} id={DETAIL_COLUMN_ID}>
          <Switch>
            {detailRoutes.map(({ path, component }) => (
              <Route path={path} component={component} key={path} />)
            )}
          </Switch>
        </div>
        <div styleName='below-container'>
          <Switch>
            <Route
              path='/signup'
              component={() => (
                <Link to='/login'>
                  Already have an account? <Button styleName='signupButton' color='green-white-green-border'>Sign in</Button>
                </Link>
              )}
            />
            <Route
              path='/login' component={() => (
                <Link tabIndex={-1} to='/signup'>
                  Not a member of Hylo? <Button styleName='signupButton' color='green-white-green-border'>Sign Up</Button>
                </Link>
              )}
            />
            <Route
              path='/reset-password'
              component={() => (
                <div styleName='resetPasswordBottom'>
                  <Link tabIndex={-1} to='/signup'>
                    <Button styleName='signupButton' color='green-white-green-border'>Sign Up</Button>
                  </Link>
                  or
                  <Link to='/login'>
                    <Button styleName='signupButton' color='green-white-green-border'>Log In</Button>
                  </Link>
                </div>
              )}
            />
          </Switch>
        </div>
      </div>

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
        <div styleName={cx('cookieInformation', { 'showCookieInfo': showCookieInfo })}>
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
    </Div100vh>
  )
}

const detailRoutes = [
  { path: `/:context(|public)/${POST_DETAIL_MATCH}`, component: PostDetail },
  { path: `/:context(|public)/:view(map)/${POST_DETAIL_MATCH}`, component: PostDetail },
  { path: `/:context(|public)/:view(map)/${GROUP_DETAIL_MATCH}`, component: GroupDetail }
]
