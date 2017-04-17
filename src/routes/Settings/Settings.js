import React, { PropTypes, Component } from 'react'
import './Settings.scss'
import { Link } from 'react-router-dom'
import Icon from 'components/Icon'
const { object } = PropTypes

export default class Settings extends Component {
  static propTypes = {
    currentUser: object
  }

  render () {
    const { currentUser } = this.props
    return <div styleName='modal'>
      <div styleName='content'>
        <div styleName='left-sidebar'>
          <Link to='/settings' styleName='nav-link nav-link--active'>Account</Link>
          <Link to='/settings/communities'styleName='nav-link'>Communities</Link>
        </div>
        <div styleName='center'>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut tempus, arcu vitae commodo ornare, arcu risus hendrerit velit, quis facilisis urna arcu ut felis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nunc lacinia malesuada mauris, ac sollicitudin lorem laoreet vel. Integer vel venenatis ligula, in luctus neque. Nullam mollis semper risus eget eleifend. Cras vestibulum massa magna, nec auctor libero ullamcorper quis. Morbi porttitor faucibus posuere. Cras commodo feugiat massa, sed mattis leo pulvinar ut.
          </p><p>
            Praesent tincidunt interdum rhoncus. Ut faucibus magna arcu, non cursus lectus tincidunt id. Proin elementum ut mi a ullamcorper. Sed mi orci, dignissim at commodo sed, congue at diam. Mauris sapien lectus, scelerisque vel mauris eget, egestas vestibulum augue. Quisque tristique eget neque at mollis. Quisque egestas nibh vel massa euismod, vitae semper est dictum. Integer mattis metus nec tempor dapibus. Maecenas ac consequat nulla. Pellentesque accumsan, nisi ac interdum mattis, lectus dolor vehicula nulla, ornare tincidunt dui arcu et diam.
          </p><p>
            Praesent congue luctus diam, bibendum interdum quam posuere eu. Duis sodales viverra ipsum nec convallis. Nam vel est vel mauris fermentum condimentum. Suspendisse volutpat ut orci et tempor. Duis ac ex lorem. Curabitur varius ultricies justo et placerat. Suspendisse et elementum tortor. Nunc sed quam rhoncus, consequat nisl ultricies, laoreet quam. Proin hendrerit nisl quis ex dignissim, fringilla semper nisi finibus. Mauris rutrum malesuada sapien, at dictum est. Donec ut libero nec eros porta lacinia nec vitae velit. Nulla gravida, urna quis viverra laoreet, urna tellus vestibulum erat, at tristique risus enim a tortor.
          </p><p>
            Integer iaculis sed leo vel fringilla. Pellentesque lacinia fringilla elit, aliquam viverra ex tincidunt a. Sed ac nisl vel sem consequat mollis. Phasellus efficitur porta risus et fermentum. Mauris ac elit ut dolor posuere elementum vitae vitae nibh. Etiam scelerisque egestas ligula eu tristique. Nulla ut ex libero. Etiam nisi tellus, commodo vitae tincidunt ut, laoreet non tellus. Phasellus laoreet tincidunt turpis, non feugiat justo congue a. Sed ultricies mollis lectus sit amet fermentum. Nam id sapien vitae tellus condimentum imperdiet consequat at tortor. Nullam suscipit mauris a nunc finibus vehicula.
          </p><p>
            Vivamus efficitur quis dolor at faucibus. Vivamus nibh tortor, accumsan a dolor vel, egestas porttitor eros. Nullam eu ullamcorper neque. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed nibh risus, volutpat sit amet congue ut, mollis et risus. Aenean sodales libero nec ante lobortis iaculis. Nulla quis aliquam nunc. Vestibulum varius lectus et metus gravida, nec porttitor diam luctus. Donec quis est arcu. Nam aliquam risus orci, eget vehicula dui auctor ut. Vivamus maximus ultrices lectus. Nulla quis dui augue. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
          </p>
        </div>
        <div styleName='right-sidebar'>
          <CloseButton onClose={() => console.log('closed')} />
        </div>
      </div>
    </div>
  }
}

export function CloseButton ({ onClose }) {
  return <div styleName='close-button' onClick={onClose}>
    <Icon name='Ex' styleName='icon' />
  </div>
}
