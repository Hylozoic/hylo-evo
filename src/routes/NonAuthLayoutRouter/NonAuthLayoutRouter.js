import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Link, useLocation, useNavigate, Navigate, Routes } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import Div100vh from 'react-div-100vh'
import Particles from 'react-tsparticles'
import getQuerystringParam from 'store/selectors/getQuerystringParam'
import setReturnToPath from 'store/actions/setReturnToPath'
import { getAuthenticated } from 'store/selectors/getAuthState'
import particlesjsConfig from './particlesjsConfig'
import LocaleDropdown from 'routes/AuthLayoutRouter/components/TopNav/LocaleDropdown/LocaleDropdown'
import Button from 'components/Button'
import HyloCookieConsent from 'components/HyloCookieConsent'
import JoinGroup from 'routes/JoinGroup'
import Login from 'routes/NonAuthLayoutRouter/Login'
import ManageNotifications from 'routes/NonAuthLayoutRouter/ManageNotifications'
import PasswordReset from 'routes/NonAuthLayoutRouter/PasswordReset'
import SignupRouter from 'routes/NonAuthLayoutRouter/Signup/SignupRouter'
import OAuthConsent from 'routes/OAuth/Consent'
import OAuthLogin from 'routes/OAuth/Login'
import { localeLocalStorageSync, localeToFlagEmoji } from 'util/locale'

import classes from './NonAuthLayoutRouter.module.scss'

const particlesStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%'
}

export default function NonAuthLayoutRouter (props) {
  const { t } = useTranslation()
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isAuthenticated = useSelector(getAuthenticated)
  const returnToPathFromQueryString = getQuerystringParam('returnToUrl', { location })
  const returnToNavigationState = props.location?.state?.from
  const returnToPath = returnToNavigationState
    ? returnToNavigationState.pathname + returnToNavigationState.search
    : returnToPathFromQueryString
  const thisApplicationText = t('this application')
  const locale = localeLocalStorageSync()
  const localeDisplay = localeToFlagEmoji(locale)

  useEffect(() => {
    if (returnToPath && returnToPath !== '/') {
      // Clears location state on page reload
      navigate('.', { replace: true, state: null })
      dispatch(setReturnToPath(returnToPath))
    }

    // XXX: skipAuthCheck is kind of a hack for when we are doing the oAuth login flow
    //      and we want to still show the oAuth login/consent pages even when someone is logged into Hylo
    if (!props.skipAuthCheck && isAuthenticated) {
      navigate('/signup', { replace: true })
    }
  }, [dispatch, setReturnToPath, returnToPath])

  return (
    <Div100vh className={classes.nonAuthContainer}>
      <Helmet>
        <title>Hylo</title>
        <meta name='description' content='Prosocial Coordination for a Thriving Planet' />
      </Helmet>
      <div className={classes.background}>
        <div className={classes.particlesBackgroundWrapper}>
          <Particles options={particlesjsConfig} style={particlesStyle} />
        </div>
        <div className={classes.topRow}>
          <a href='/'>
            <img className={classes.logo} src='/assets/hylo.svg' alt={t('Hylo logo')} />
          </a>
          <LocaleDropdown renderToggleChildren={<span className={classes.locale}>{t('Locale')}: {locale} {localeDisplay}</span>} />
        </div>
        <div className={classes.signupRow}>
          <Routes>
            <Route
              path='/login'
              element={<Login {...props} className={classes.form} />}
            />
            <Route
              path='/signup'
              element={<SignupRouter {...props} className={classes.form} />}
            />
            <Route
              path='/reset-password'
              element={<PasswordReset {...props} className={classes.form} />}
            />
            <Route
              path='/notifications'
              element={<ManageNotifications {...props} className={classes.form} />}
            />
            <Route
              path='/:context(groups)/:groupSlug/join/:accessCode'
              element={<JoinGroup />}
            />
            <Route
              path='/h/use-invitation'
              element={<JoinGroup />}
            />
            <Route path='/oauth/login/:uid' element={<OAuthLogin className={classes.form} />} />
            <Route
              path='/oauth/consent/:uid'
              element={<OAuthConsent {...props} className={classes.form} />}
            />
            {/*
              Default route
              NOTE: This passes the unmatched location for anything unmatched except `/`
              into `location.state.from` which persists navigation and will be set as the
              returnToPath in the `useEffect` in this component. This shouldn't interfere
              with the static pages as those routes are first use `path='/(.+)'` to match
              anything BUT root if there is any issue.
            */}
            <Route path='*' element={<Navigate to='/login' state={{ from: location }} replace />} />
          </Routes>
        </div>

        {/* The below-container content for each route */}
        <Routes>
          <Route
            path='/signup'
            element={
              <div className={classes.belowContainer}>
                <Link to='/login'>
                  {t('Already have an account?')} <Button className={classes.signupButton} color='green-white-green-border'>{t('Sign in')}</Button>
                </Link>
              </div>
            }
          />
          <Route
            path='/reset-password'
            element={
              <div className={classes.belowContainer}>
                <div className={classes.resetPasswordBottom}>
                  <Link tabIndex={-1} to='/signup'>
                    <Button className={classes.signupButton} color='green-white-green-border'>{t('Sign Up')}</Button>
                  </Link>
                  or
                  <Link to='/login'>
                    <Button className={classes.signupButton} color='green-white-green-border'>{t('Log In')}</Button>
                  </Link>
                </div>
              </div>
            }
          />
          <Route
            path='/login'
            element={
              <div className={classes.belowContainer}>
                <Link tabIndex={-1} to='/signup'>
                  {t('Not a member of Hylo?')} <Button className={classes.signupButton} color='green-white-green-border'>{t('Sign Up')}</Button>
                </Link>
              </div>
            }
          />
          <Route
            path='/oauth/login'
            element={
              <div className={classes.belowContainer}>
                <p>{t(`Use your Hylo account to access {{name}}.`, { name: getQuerystringParam('name', { location }) || thisApplicationText })}</p>
              </div>
            }
          />
          <Route
            path='/oauth/consent'
            element={
              <div className={classes.belowContainer}>
                <p>{t(`Make sure you trust {{name}} with your information.`, { name: getQuerystringParam('name', { location }) || thisApplicationText })}</p>
              </div>
            }
          />
        </Routes>
        <div className={classes.belowContainer}>
          <a href='https://hylo.com/terms/' target='_blank' rel='noreferrer'>{t('Terms of Service')}</a> +&nbsp;
          <a href='https://hylo.com/terms/privacy' target='_blank' rel='noreferrer'>{t('Privacy Policy')}</a>
        </div>
      </div>
      <HyloCookieConsent />
    </Div100vh>
  )
}
