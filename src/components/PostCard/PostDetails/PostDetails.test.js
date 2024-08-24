import React from 'react'
import { shallow } from 'enzyme'
import PostDetails from './index'
import { render } from 'util/testing/reactTestingLibraryExtended'
import '@testing-library/jest-dom'

it('matches last snapshot', () => {
  const props = {
    id: 1,
    details: 'the details',
    linkPreview: {
      title: 'a walk in the park',
      url: 'www.hylo.com/awitp',
      imageUrl: 'foo.png'
    },
    slug: 'foomunity',
    expanded: true,
    className: 'classy',
    highlightProps: { term: 'foo' },
    fileAttachments: [
      {
        id: 1,
        url: 'https://www.hylo.com/awitp.pdf'
      },
      {
        id: 1,
        url: 'http://www.google.com/lalala.zip'
      }
    ]
  }
  const wrapper = shallow(<PostDetails {...props} />)
  expect(wrapper).toMatchSnapshot()
})

it('does render edited at timestamp and not edited at timestamp', () => {
  const createdTimestamp = 'Posted 1w ago'
  const editedTimestamp = 'Edited 12m ago'
  const props = {
    id: 1,
    details: 'the details',
    slug: 'foomunity',
    expanded: true,
    createdTimestamp,
    editedTimestamp
  }
  const re = new RegExp(`Unable to find an element with the text: ${createdTimestamp}`, 's')

  const { getByText } = render(<PostDetails {...props} />)
  expect(getByText(editedTimestamp)).toBeInTheDocument()
  expect(() => getByText(createdTimestamp)).toThrow(re)
})
