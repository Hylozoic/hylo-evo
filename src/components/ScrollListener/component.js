import React from 'react'
import { throttle } from 'lodash/fp'
import { isAtBottom } from 'util/scrolling'
const { func, number, string } = React.PropTypes

export default class ScrollListener extends React.Component {
  static propTypes = {
    onBottom: func,
    onLeaveBottom: func,
    onTop: func,
    onLeaveTop: func,
    onScroll: func,
    elementId: string,
    padding: number
  }

  constructor (props) {
    super(props)
    this.state = {
      hitTop: true,
      hitBottom: false
    }
  }

  passThroughScroll = event => {
    const { onScroll } = this.props
    onScroll && onScroll(event)
  }

  handleScrollEvents = throttle(100, event => {
    event.preventDefault()
    let { onBottom, onLeaveBottom, onTop, onLeaveTop, padding } = this.props
    const { hitBottom, hitTop } = this.state
    if (isNaN(padding)) padding = 250

    const isNowAtBottom = isAtBottom(padding, this.element())
    const element = this.element()
    const scrollTop = element.scrollTop || element.scrollY
    const isNowAtTop = scrollTop === 0
    if (!hitBottom && isNowAtBottom) {
      onBottom && onBottom()
      this.setState({hitBottom: true})
    } else if (hitBottom && !isNowAtBottom) {
      onLeaveBottom && onLeaveBottom()
      this.setState({hitBottom: false})
    }

    if (!hitTop && isNowAtTop) {
      onTop && onTop()
      this.setState({hitTop: true})
    } else if (hitTop && !isNowAtTop) {
      onLeaveTop && onLeaveTop()
      this.setState({hitTop: false})
    }
  })

  element () {
    const { elementId } = this.props
    return elementId ? document.getElementById(elementId) : window
  }

  componentDidMount () {
    this.element().addEventListener('scroll', this.handleScrollEvents)
    this.element().addEventListener('scroll', this.passThroughScroll)
  }

  componentWillUnmount () {
    this.element().removeEventListener('scroll', this.handleScrollEvents)
    this.element().removeEventListener('scroll', this.passThroughScroll)
  }

  render () {
    return null
  }
}
