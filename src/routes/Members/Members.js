import React, { PropTypes, Component } from 'react'
import Button from 'components/Button'
import Member from 'components/Member'
import TextInput from 'components/TextInput'
import './Members.scss'
const { number, string, arrayOf, shape } = PropTypes

export default class Members extends Component {
  static propTypes = {
    total: number,
    members: arrayOf(shape({
      id: string,
      name: string,
      location: string,
      tagline: string,
      avatarUrl: string
    }))
  }

  render () {
    const { total, members } = this.props
    return <div>
      <div className='hdr-display'>Members</div>
      <div className='caption-lt-lg'>{total} Total Members</div>
      <Button label='Invite People' color='green-white-green-border' narrow />
      <TextInput placeholder='Search by name or location' />
      <div>Order</div>
      <div>
        {members.map(m => <div styleName='memberLi'><Member member={m} /></div>)}
      </div>
    </div>
  }
}
