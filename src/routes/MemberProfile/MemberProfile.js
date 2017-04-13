import React from 'react'

import './MemberProfile.scss'
import Icon from 'components/Icon'
import RoundImage from 'components/RoundImage'
import { bgImageStyle } from 'util/index'

import SimpleTabBar from 'components/SimpleTabBar'
import PostCard from 'components/PostCard'

const { any, arrayOf, object, string, shape } = React.PropTypes

export default class MemberProfile extends React.Component {
  static propTypes = {
    id: any,
    person: shape({
      id: any,
      avatarUrl: string,
      bannerUrl: string,
      bio: string,
      facebookUrl: string,
      linkedinUrl: string,
      comments: arrayOf(object),
      memberships: arrayOf(object),
      name: string,
      posts: arrayOf(object),
      role: string,
      twitterName: string,
      url: string
    })
  }

  componentDidMount () {
    this.props.fetchPerson(this.props.id)
  }

  constructor (props) {
    super(props)
    this.state = {
      currentTab: props.currentTab
    }
  }

  selectTab = tab => this.setState({ currentTab: tab })

  displayError (error) {
    return <div styleName='member-profile'>
      <span styleName='error'>{ error }</span>
    </div>
  }

  render () {
    if (this.props.error) return this.displayError(this.props.error)

    const {
      avatarUrl,
      bannerUrl,
      bio,
      facebookUrl,
      linkedinUrl,
      location,
      name,
      comments,
      posts,
      role,
      twitterName,
      url
    } = this.props.person

    return <div styleName='member-profile'>
      <ProfileBanner
        avatarUrl={avatarUrl}
        bannerUrl={bannerUrl}
        location={location}
        name={name}
        role={role} />
      <div styleName='content'>
        <ProfileControls
          currentTab={this.state.currentTab}
          facebookUrl={facebookUrl}
          linkedinUrl={linkedinUrl}
          selectTab={this.selectTab}
          twitterName={twitterName}
          url={url} />
        <TabContentSwitcher bio={bio} comments={comments} currentTab={this.state.currentTab} posts={posts} />
      </div>
    </div>
  }
}

export function ProfileBanner ({ avatarUrl, bannerUrl, location, name, role }) {
  return <div styleName='banner'>
    <ProfileNamePlate
      avatarUrl={avatarUrl}
      location={location}
      name={name}
      role={role} />
    {bannerUrl && <div style={bgImageStyle(bannerUrl)} styleName='banner-image' />}
  </div>
}

export function ProfileNamePlate ({ avatarUrl, name, location, role }) {
  return <div styleName='name-plate'>
    <RoundImage url={avatarUrl} xlarge />
    <div styleName='details'>
      <h1 styleName='name'>{name}</h1>
      <span styleName='location'>{location}</span>
      {role && <span styleName='spacer'>•</span>}
      {role && <span styleName='role'>{ role }</span>}
    </div>
  </div>
}

export function ProfileControls ({ currentTab, facebookUrl, linkedinUrl, selectTab, twitterName, url }) {
  return <div styleName='controls'>
    <SocialButtons
      facebookUrl={facebookUrl}
      linkedinUrl={linkedinUrl}
      twitterName={twitterName}
      url={url} />
    <hr styleName='separator' />
    <SimpleTabBar
      currentTab={currentTab}
      selectTab={selectTab}
      tabNames={['Overview', 'Posts', 'Comments', 'Upvotes']} />
  </div>
}

export function SocialButtons ({ facebookUrl, linkedinUrl, twitterName, url }) {
  return <ul styleName='social-buttons'>
    {facebookUrl && <li><a href={facebookUrl}><Icon name='ArrowUp' /></a></li>}
    {linkedinUrl && <li><a href={linkedinUrl}><Icon name='ArrowUp' /></a></li>}
    {twitterName && <li><a href={twitterName}><Icon name='ArrowUp' /></a></li>}
    {url && <li><a href={url}><Icon name='ArrowUp' /></a></li>}
  </ul>
}

export function TabContentSwitcher ({ bio, comments, currentTab, posts }) {
  const tabContent = {
    Overview:
      <div>
        <h2 styleName='subhead'>About Me</h2>
        <div styleName='bio'>{bio}</div>
        <h2 styleName='subhead'>Recent Activity</h2>
        {posts && comments && posts.concat(comments).map((item, i) => {
          return item.hasOwnProperty('title')
            ? <PostCard key={i} post={item} />
            : <CommentCard key={i} comment={item} />
        })}
      </div>,

    Posts:
      <div>
        <h2 styleName='subhead'>Posts</h2>
        {posts && posts.map(post => <PostCard key={post.id} post={post} />)}
      </div>,

    Comments:
      <div>
        <h2 styleName='subhead'>Comments</h2>
      </div>,

    Upvotes:
      <div>
        <h2 styleName='subhead'>Upvotes</h2>
      </div>
  }

  return <div>
    {tabContent[currentTab]}
  </div>
}

export function CommentCard ({ text }) {
  return <div>
    {text}
  </div>
}
