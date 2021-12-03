import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { DEFAULT_AVATAR } from 'store/models/Group'
import Icon from 'components/Icon'
import Loading from 'components/Loading'
import RoundImage from 'components/RoundImage'
import Widget from 'components/Widget'
import { groupDetailUrl } from 'util/navigation'

import './GroupProfile.scss'

export default function About ({ group = {}, childGroups, isModerator, posts, routeParams, widgets }) {
  // this.props.fetchPosts()  ==>   do I need an useEnsurePosts?

  return <div>
    <div styleName='banner' style={{ backgroundImage: `url(${group.bannerUrl})` }}>
      <div styleName='right'>
        <Link styleName='about' to={groupDetailUrl(group.slug, { context: 'groups', view: 'explore', groupSlug: group.slug })}><Icon name='Info' />About us</Link>
      </div>
      <div styleName='title'>
        <RoundImage url={group.avatarUrl || DEFAULT_AVATAR} large hasBorder={false} styleName='landing-page-avatar' />
        <div>
          <div styleName='name'>{group.name}</div>
          {group.location ? <div styleName='location'><Icon name='Location' />{group.location}</div> : ''}
        </div>
      </div>
      <div styleName='bg-fade' />
    </div>
  </div>
}

// export default class LandingPage extends Component {

//   render () {
//     const { childGroups, group, isModerator, posts, routeParams, widgets } = this.props
//     if (!group) return <Loading />

//     return (
//       <div>
//         <div styleName='banner' style={{ backgroundImage: `url(${group.bannerUrl})` }}>
//           <div styleName='right'>
//             <Link styleName='about' to={isAboutOpen ? groupUrl(group.slug, 'explore') : groupDetailUrl(group.slug, { context: 'groups', view: 'explore', groupSlug: group.slug })}><Icon name='Info' />About us</Link>
//           </div>

//           <div styleName='title'>
//             <RoundImage url={group.avatarUrl || DEFAULT_AVATAR} large hasBorder={false} styleName='landing-page-avatar' />
//             <div>
//               <div styleName='name'>{group.name}</div>
//               {group.location ? <div styleName='location'><Icon name='Location' />{group.location}</div> : ''}
//             </div>
//           </div>
//           <div styleName='bg-fade' />
//         </div>
//         {widgets && widgets.map(widget => // so each widget already gets childGroups, posts and the group entity
//           <Widget
//             {...widget}
//             childGroups={childGroups}
//             key={widget.id}
//             group={group}
//             isModerator={isModerator}
//             posts={posts}
//             routeParams={routeParams}
//           />
//         )}
//       </div>
//     )
//   }
// }
