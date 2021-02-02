import PropTypes from 'prop-types'
import React from 'react'
import cheerio from 'cheerio'
import { flatten } from 'lodash/fp'

export default class Highlight extends React.Component {
  static propTypes = {
    children: PropTypes.element,
    className: PropTypes.string,
    component: PropTypes.any,
    highlightClassName: PropTypes.string
  }

  static defaultProps = {
    component: 'span',
    highlightClassName: 'highlight'
  }

  parseCounter = 0

  getMatches (string) {
    const terms = this.props.terms.map(term =>
      term.replace(/\W/g, ''))

    let matches = []
    for (var i in terms) {
      const regex = new RegExp(`\\b${terms[i]}\\b`, 'ig')
      var match
      while ((match = regex.exec(string)) !== null) {
        matches.push(match)
      }
    }
    return matches
  }

  parseString (string) {
    // takes a plain string and returns react elements
    let elements = []
    if (string === '') {
      return elements
    }

    const matches = this.getMatches(string)

    let lastIndex = 0
    matches.forEach((match, i) => {
      const text = match[0]
      const { index } = match
      if (index > lastIndex) {
        elements.push(string.substring(lastIndex, index))
      }

      let props = {
        key: `parse${this.parseCounter}match${i}`,
        className: this.props.highlightClassName
      }

      elements.push(React.createElement(
        this.props.component,
        props,
        text
      ))

      lastIndex = index + text.length
    })

    if (lastIndex < string.length) {
      elements.push(string.substring(lastIndex))
    }

    return (elements.length === 1) ? elements[0] : elements
  }

  domParseHTMLString (html) {
    // takes and returns a html string
    const domTree = cheerio.parseHTML(html)
    const parsedDomTree = flatten(domTree.map(el => this.domParseElement(el)))
    const $el = cheerio.load([].concat(parsedDomTree), null, false)

    if (parsedDomTree.length > 1) {
      return `<span>${$el.html()}</span>`
    } else {
      return $el.html()
    }
  }

  domParseElement (el) {
    // takes an element and returns an element or an array of elements
    switch (el.type) {
      case 'text':
        const parsed = this.domParseString(el.data)
        return parsed
      case 'tag':
        const children = flatten(el.children.map(child => this.domParseElement(child)))
        return {
          ...el,
          children
        }
    }
    return null
  }

  domParseString (string) {
    // takes a plain string and returns a DOM tree
    const { highlightClassName, component } = this.props

    const matches = this.getMatches(string)

    var elements = []

    let lastIndex = 0
    matches.forEach((match, i) => {
      const text = match[0]
      const { index } = match
      if (index > lastIndex) {
        elements.push(string.substring(lastIndex, index))
      }

      elements.push(
        `<${component} class='${highlightClassName}'>${text}</${component}>`
      )

      lastIndex = index + text.length
    })

    if (lastIndex < string.length) {
      elements.push(string.substring(lastIndex))
    }

    const newString = elements.join('')

    const domTree = cheerio.parseHTML(newString)

    if (domTree.length === 1) {
      return domTree[0]
    } else {
      return domTree
    }
  }

  parse (children) {
    let parsed = children

    if (typeof children === 'string') {
      parsed = this.parseString(children)
    } else if (React.isValidElement(children)) {
      if (children.props.dangerouslySetInnerHTML) {
        const originalHTML = children.props.dangerouslySetInnerHTML.__html
        parsed = React.cloneElement(
          children,
          {
            key: `parse${++this.parseCounter}`,
            dangerouslySetInnerHTML: {
              __html: this.domParseHTMLString(originalHTML)
            }
          }
        )
      } else {
        parsed = React.cloneElement(
          children,
          { key: `parse${++this.parseCounter}` },
          this.parse(children.props.children)
        )
      }
    } else if (children instanceof Array) {
      parsed = children.map(child => {
        return this.parse(child)
      })
    }

    return parsed
  }

  render () {
    const { children, className, terms = [] } = this.props

    var parsedChildren = children

    if (terms.length === 0) {
      return children
    }

    this.parseCounter = 0
    parsedChildren = this.parse(children)

    return <span className={className}>{parsedChildren}</span>
  }
}
