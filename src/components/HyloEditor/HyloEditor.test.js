import React from 'react'
// import Immutable from 'immutable'
import { shallow, mount } from 'enzyme'
import { ContentState } from 'draft-js'
import HyloEditor from './HyloEditor'
import { MENTION_ENTITY_TYPE, TOPIC_ENTITY_TYPE } from './HyloEditor.constants'

const emptyFunc = () => {}

const defaultMinProps = {
  findMentions: emptyFunc,
  clearMentions: emptyFunc,
  findTopics: emptyFunc,
  clearTopics: emptyFunc
}

function renderComponent (renderFunc, props = {}) {
  return renderFunc(
    <HyloEditor {...Object.assign({}, props, defaultMinProps)} />
  )
}

describe('HyloEditor', () => {
  it('renders correctly (with min props)', () => {
    const wrapper = renderComponent(shallow)
    expect(wrapper.find('PluginEditor')).toHaveLength(1)
    expect(wrapper.find('Decorated(MentionSuggestions)')).toHaveLength(2)
  })

  it('#setEditorStateFromContentState creates expected result through #getContentRaw', () => {
    const wrapper = renderComponent(mount)
    const testContent = 'test content <h1>test</h1>'
    wrapper.get(0).setEditorStateFromContentState(ContentState.createFromText(testContent))
    expect(wrapper.get(0).getContentRaw().blocks).toHaveLength(1)
    expect(wrapper.get(0).getContentRaw().blocks[0].text).toEqual(testContent)
  })

  describe('#contentHTML', () => {
    it('converts mention into contentState entity, ', () => {
      const contentHTML = `<a data-user-id="test" data-entity-type="${MENTION_ENTITY_TYPE}" href="/u/test">Test User</a>`
      const wrapper = renderComponent(mount, { contentHTML })
      expect(wrapper.get(0).getContentRaw().entityMap[0].type)
        .toEqual(MENTION_ENTITY_TYPE)
    })

    it('converts topic into contentState entity, ', () => {
      const contentHTML = `<a data-entity-type="${TOPIC_ENTITY_TYPE}">#testtopic</a>`
      const wrapper = renderComponent(mount, { contentHTML })
      expect(wrapper.get(0).getContentRaw().entityMap[0].type)
        .toEqual(TOPIC_ENTITY_TYPE)
    })
  })

  describe('#handleReturn', () => {
    it('does nothing if props.submitOnReturnHandler is not provided', () => {
      const wrapper = renderComponent(mount)
      const result = wrapper.get(0).handleReturn({shiftKey: false})
      expect(result).toEqual(undefined)
    })

    it('runs props.submitOnReturnHandler if provided', () => {
      const submitOnReturnHandler = jest.fn()
      const wrapper = renderComponent(mount, { submitOnReturnHandler })
      const result = wrapper.get(0).handleReturn({shiftKey: false})
      expect(submitOnReturnHandler.mock.calls).toHaveLength(1)
      expect(result).toEqual('handled')
    })

    it('will not run props.submitOnReturnHandler if provided but shiftKey+returnKey is entered', () => {
      const submitOnReturnHandler = jest.fn()
      const wrapper = renderComponent(mount, { submitOnReturnHandler })
      const result = wrapper.get(0).handleReturn({shiftKey: true})
      expect(submitOnReturnHandler.mock.calls).toHaveLength(0)
      expect(result).toEqual('not-handled')
    })
  })
})
