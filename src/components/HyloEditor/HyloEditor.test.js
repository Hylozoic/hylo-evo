import React from 'react'
// import Immutable from 'immutable'
import { shallow, mount } from 'enzyme'
import { ContentState } from 'draft-js'
import HyloEditor from './HyloEditor'

const emptyFunc = () => {}

const defaultMinProps = {
  findMentions: emptyFunc,
  clearMentions: emptyFunc,
  findHashtags: emptyFunc,
  clearHashtags: emptyFunc
}

function renderComponent (renderFunc, props = {}) {
  return renderFunc(
    <HyloEditor {...Object.assign({}, props, defaultMinProps)} />
  )
}

describe('HyloEditor', () => {
  it('renders correctly (with min props)', () => {
    const wrapper = renderComponent(shallow)
    expect(wrapper.find('PluginEditor').length).toEqual(1)
    expect(wrapper.find('Decorated(MentionSuggestions)').length).toEqual(1)
    expect(wrapper.find('Decorated(CompletionSuggestions)').length).toEqual(1)
  })

  it('#setContentState creates expected result through #getContentRaw', () => {
    const wrapper = renderComponent(mount)
    const testContent = 'test content <h1>test</h1>'
    wrapper.get(0).setContentState(ContentState.createFromText(testContent))
    expect(wrapper.get(0).getContentRaw().blocks.length).toEqual(1)
    expect(wrapper.get(0).getContentRaw().blocks[0].text).toEqual(testContent)
  })

  describe('#contentHTML', () => {
    it('converts mention into contentState entity, ', () => {
      const contentHTML = '<a data-entity-id="test" data-entity-type="mention" href="/u/test">Test User</a>'
      const wrapper = renderComponent(mount, { contentHTML })
      expect(wrapper.get(0).getContentRaw().entityMap[0].type)
        .toEqual('mention')
    })

    it('converts hashtags into contentState entity, ', () => {
      const contentHTML = '<a data-entity-type="hashtag">#testhashtag</a>'
      const wrapper = renderComponent(mount, { contentHTML })
      expect(wrapper.get(0).getContentRaw().entityMap[0].type)
        .toEqual('hashtag')
    })
  })
})

// calls onEnter when callback provided
