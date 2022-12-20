import { shallow } from 'enzyme'
import React from 'react'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import ChatPost from './index'

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
  const wrapper = shallow(<Provider store={createStore(() => {})}><ChatPost {...props} /></Provider>)
  expect(wrapper).toMatchSnapshot()
})

