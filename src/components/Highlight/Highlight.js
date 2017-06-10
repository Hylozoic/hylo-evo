import React from 'react'

export default class Highlight extends React.Component {
  parseCounter = 0

  getMatches (string) {
    const { searchTerms } = this.props
    let matches = []

  }

  parseString (string) {
    let elements = []
    if (string === '') {
      return elements
    }

    const matches = this.getMatches(string)

    console.log('matches', matches)

  }

  parse (children) {
    let parsed = children

    if (typeof children === 'string') {
      parsed = this.parseString(children)
    } else if (React.isValidElement(children)) {
      parsed = React.cloneElement(
        children,
        {key: `parse${++this.parseCounter}`},
        this.parse(children.props.children)
      )
    } else if (children instanceof Array) {
      parsed = children.map(child => {
        return this.parse(child)
      })
    }

    return parsed
  }

  render () {
    const { children, className } = this.props

    this.parseCounter = 0
    const parsedChildren = this.parse(children)
    return <span className={className}>{parsedChildren}</span>
  }
}
