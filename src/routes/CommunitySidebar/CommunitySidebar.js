import React, { PropTypes, Component } from 'react'
import Loading from 'components/Loading'
import './CommunitySidebar.scss'
const { object, shape } = PropTypes

export default class CommunitySidebar extends Component {
  static propTypes = {
    commmunity: object
  }

  render () {
    const { commmunity } = this.props
    if (!commmunity) return <Loading />
    const { name } = commmunity

    return <div>
      <div styleName='about-header'>
        About {name}
      </div>
    </div>
  }
}
