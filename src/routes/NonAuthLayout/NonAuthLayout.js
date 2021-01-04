import cx from 'classnames'
import { some } from 'lodash/fp'
import React from 'react'
import { matchPath, Redirect, Route, Link, Switch } from 'react-router-dom'
import Particles from 'react-particles-js'
import particlesjsConfig from './particlesjsConfig'
import Button from 'components/Button'
import Login from './Login'
import Signup from './Signup'
import TopicSupportComingSoon from 'components/TopicSupportComingSoon'
import CommunityDetail from 'routes/CommunityDetail'
import MapExplorer from 'routes/MapExplorer'
import PasswordReset from 'routes/NonAuthLayout/PasswordReset'
import PostDetail from 'routes/PostDetail'
import { OPTIONAL_POST_MATCH, OPTIONAL_COMMUNITY_MATCH, POST_DETAIL_MATCH, COMMUNITY_DETAIL_MATCH } from 'util/navigation'
import { DETAIL_COLUMN_ID } from 'util/scrolling'
import './NonAuthLayout.scss'

export default class NonAuthLayout extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    const { location } = this.props

    const particlesStyle = {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%'
    }

    const hasDetail = some(
      ({ path }) => matchPath(location.pathname, { path, exact: true }),
      detailRoutes
    )

    return <div styleName='background'>
      <div styleName='particlesBackgroundWrapper'>
        <Particles params={particlesjsConfig} style={particlesStyle} />
      </div>
      <div styleName='topRow'>
        <a href='/'>
          <img styleName='logo' src='assets/hylo.svg' alt='Hylo logo' />
        </a>
        <Route path='/login' component={() =>
          <Link tabIndex={-1} to='/signup'>
            <Button styleName='signupButton' color='green-white-green-border'>Sign Up</Button>
          </Link>
        } />
        <Route path='/reset-password' component={() =>
          <Link to='/login'>
            <Button styleName='signupButton' color='green-white-green-border'>Log In</Button>
          </Link>
        } />
      </div>

      <Route path='/login' component={() =>
        <div styleName='signupRow'>
          <Login {...this.props} styleName='form' />
        </div>
      } />

      <Route path='/signup' component={() =>
        <div styleName='signupRow'>
          <Signup {...this.props} styleName='form' />
        </div>
      } />

      <Route path='/reset-password' component={() =>
        <PasswordReset {...this.props} styleName='form' />
      } />

      <Switch>
        <Redirect from={`/public/${OPTIONAL_POST_MATCH}`} exact to='/public/map' key='streamToMap' />
        <Route path={`/:context(public)/:view(map)/${OPTIONAL_POST_MATCH}`} exact component={MapExplorer} />
        <Route path={`/:context(public)/:view(map)/${OPTIONAL_COMMUNITY_MATCH}`} exact component={MapExplorer} />
        <Route path='/:context(public)/:topicName' exact component={TopicSupportComingSoon} />
      </Switch>

      <div styleName={cx('detail', { hidden: !hasDetail })} id={DETAIL_COLUMN_ID}>
        <Switch>
          {detailRoutes.map(({ path, component }) =>
            <Route path={path} component={component} key={path} />)}
        </Switch>
      </div>

      <div styleName='signupToggle'>
        <p styleName='below-container'>
          <Route path='/signup' component={() =>
            <Link to='/login'>
              Already have an account? <span styleName='green-text'>Sign in</span>
            </Link>
          } />
        </p>
      </div>
    </div>
  }
}

const detailRoutes = [
  { path: `/:context(|public)/${POST_DETAIL_MATCH}`, component: PostDetail },
  { path: `/:context(|public)/:view(map)/${POST_DETAIL_MATCH}`, component: PostDetail },
  { path: `/:context(|public)/:view(map)/${COMMUNITY_DETAIL_MATCH}`, component: CommunityDetail }
]
