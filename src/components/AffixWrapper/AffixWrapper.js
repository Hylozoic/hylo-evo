import React, { PropTypes, Component } from 'react'
import { omit } from 'lodash/fp'

export default class AffixWrapper extends Component {
  static propTypes = {
    offset: PropTypes.number
  }

  static defaultProps = {
    offset: 0
  }

  constructor (props) {
    super(props)
    this.state = {
      affix: false
    }
  }

  handleScroll = () => {
    const affix = this.state.affix
    const offset = this.props.offset
    const { scrollableId } = this.props
    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    if (scrollableId) {
      scrollTop = document.getElementById(scrollableId).scrollTop
    }

    console.log('handling scroll', scrollTop, offset, affix)
    if (!affix && scrollTop >= offset) {
      this.setState({
        affix: true
      })
    }

    if (affix && scrollTop < offset) {
      this.setState({
        affix: false
      })
    }
  }

  componentDidMount () {
    const { scrollableId } = this.props
    let scrollableElement = window
    if (scrollableId) {
      scrollableElement = document.getElementById(scrollableId)
    }

    scrollableElement.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount () {
    const { scrollableId } = this.props
    let scrollableElement = window
    if (scrollableId) {
      scrollableElement = document.getElementById(scrollableId)
    }

    scrollableElement.removeEventListener('scroll', this.handleScroll)
  }

  render () {
    const affix = this.state.affix ? 'affix' : ''
    const {className} = this.props
    console.log('affix', affix)

    return (
      <div {...omit('scrollableId', this.props)} className={`${className || ''} ${affix}`}>
        {this.props.children}
      </div>
    )
  }
}
