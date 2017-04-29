import React from 'react'
import { shallow } from 'enzyme'
import HyloEditor from './HyloEditor'

const emptyFunc = () => {}

const defaultMinProps = {
  findMentions: emptyFunc,
  clearMentions: emptyFunc,
  findHashtags: emptyFunc,
  clearHashtags: emptyFunc
}

function targetComponent (props) {
  return <HyloEditor {...Object.assign({}, props, defaultMinProps)} />
}

describe('HyloEditor', () => {
  it('renders correctly (with min props)', () => {
    const wrapper = shallow(targetComponent())
    expect(wrapper.find('PluginEditor').length).toEqual(1)
    expect(wrapper.find('Decorated(MentionSuggestions)').length).toEqual(1)
    expect(wrapper.find('Decorated(CompletionSuggestions)').length).toEqual(1)
  })
})
