import { PropTypes, Component } from 'react'
import './NavigationHandler.scss'
const { string, object } = PropTypes

export default class NavigationHandler extends Component {
  static propTypes = {
    to: string,
    history: object
  }

  componentWillReceiveProps (nextProps) {
    const { resetNavigation, history } = this.props
    const { to } = nextProps
    if (to) {
      history.push(to)
      resetNavigation()
    }
  }

  render () {
    return null
  }
}
