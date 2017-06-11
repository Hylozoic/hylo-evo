import React, { PropTypes } from 'react'
import cheerio from 'cheerio'

export default class Highlight extends React.Component {
  static propTypes = {
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
    const { highlightTerms } = this.props
    let matches = []
    for (var i in highlightTerms) {
      const regex = new RegExp(highlightTerms[i], 'ig')
      var match
      while ((match = regex.exec(string)) !== null) {
        matches.push(match)
      }
    }
    return matches
  }

  parseString (string) {
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
    const domTree = cheerio.parseHTML(html)

    const parsedDomTree = domTree.map(el => this.domParseElement(el))

    const $ = cheerio.load(parsedDomTree)

    console.log('newHTML', $.html())

    return $.html()
  }

  domParseElement (el) {
    switch (el.type) {
      case 'text':
        return this.domReplaceInString(el.data)
      case 'tag':
        return {
          ...el,
          children: el.children.map(child => this.domParseElement(child))
        }
    }
    return null
  }

  domReplaceInString (string) {
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

    // const matches =
    //
    // for (var i in highlightTerms) {
    //   const regex = new RegExp(highlightTerms[i], 'ig')
    //   const replacement =
    //     `<${component} class='${highlightClassName}'>${highlightTerms[i]}</${component}>`
    //
    //   newString = newString.replace(regex, replacement)
    // }

    const newString = elements.join('')

    console.log('replaceInString', string)
    console.log('newString', newString)
    const domTree = cheerio.parseHTML(newString)

    var returnVal

    if (domTree.length === 1) {
      returnVal = domTree[0]
    } else {
      returnVal =  {
        type: 'tag',
        name: 'span',
        children: domTree
      }
    }

    console.log('returnVal', returnVal)
    return returnVal
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
          },
        )
      } else {
        parsed = React.cloneElement(
          children,
          {key: `parse${++this.parseCounter}`},
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
    const { children, className, highlightTerms = [] } = this.props

    var parsedChildren = children

    if (highlightTerms.length > 0) {
      this.parseCounter = 0
      parsedChildren = this.parse(children)
    }

    return <span className={className}>{parsedChildren}</span>
  }
}
