import { func, number, object, string } from 'prop-types'
import React from 'react'
import { throttle } from 'lodash/fp'
import { isAtBottom } from 'util/scrolling'

export default class ScrollListener extends React.Component {
  state = {
    hitTop: true,
    hitBottom: false
  }

  passThroughScroll = event => {
    const { onScroll } = this.props
    onScroll && onScroll(event)
  }

  throttledScroll = throttle(100, event => {
    this.handleScrollEvents(event)
  })

  handleScrollEvents = event => {
    event.preventDefault()
    let { onBottom, onLeaveBottom, onTop, onLeaveTop, padding } = this.props
    const { hitBottom, hitTop } = this.state
    if (isNaN(padding)) padding = 250

    const element = this.element()
    const isNowAtBottom = isAtBottom(padding, element)
    const scrollTop = element.scrollTop !== undefined ? element.scrollTop : element.scrollY
    const isNowAtTop = scrollTop === 0
    if (!hitBottom && isNowAtBottom) {
      onBottom && onBottom()
      this.setState({ hitBottom: true })
    } else if (hitBottom && !isNowAtBottom) {
      onLeaveBottom && onLeaveBottom()
      this.setState({ hitBottom: false })
    }

    if (!hitTop && isNowAtTop) {
      onTop && onTop()
      this.setState({ hitTop: true })
    } else if (hitTop && !isNowAtTop) {
      onLeaveTop && onLeaveTop()
      this.setState({ hitTop: false })
    }
  }

  element = () => {
    const { elementId, element } = this.props
    if (element) {
      return element
    } else {
      return elementId ? document.getElementById(elementId) : window
    }
  }

  componentDidMount () {
    this.element().addEventListener('scroll', this.throttledScroll)
    this.element().addEventListener('scroll', this.passThroughScroll)
  }

  componentWillUnmount () {
    this.element().removeEventListener('scroll', this.throttledScroll)
    this.element().removeEventListener('scroll', this.passThroughScroll)
  }

  render () {
    return null
  }
}
ScrollListener.propTypes = {
  onBottom: func,
  onLeaveBottom: func,
  onTop: func,
  onLeaveTop: func,
  onScroll: func,
  elementId: string,
  element: object,
  padding: number
}
