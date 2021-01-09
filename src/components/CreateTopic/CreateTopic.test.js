import React from 'react'
import { shallow, mount } from 'enzyme'
import CreateTopic from './CreateTopic'

describe('CreateTopic', () => {
  let instance, props, wrapper

  beforeEach(() => {
    props = {
      groupId: '1',
      groupSlug: 'wombat-group',
      groupTopicExists: {
        wombats: {
          'wombat-group': false,
          'other-group': true
        },
        xylophones: {
          'wombat-group': true
        }
      },
      subscribeAfterCreate: true,
      topics: [
        {
          id: '3',
          name: 'flarglebargles',
          value: 'flarglebargles'
        }
      ],
      createTopic: () => {},
      fetchGroupTopic: jest.fn()
    }
    wrapper = shallow(
      <CreateTopic {...props}>
        <div>Describe how awesome wombats are:</div>
        <input autofocus />
      </CreateTopic>
    )
    instance = wrapper.instance()
  })

  describe('snapshots (various states)', () => {
    it('matches the last snapshot for no buttonText', () => {
      expect(wrapper).toMatchSnapshot()
    })

    it('matches the last snapshot with buttonText', () => {
      props.buttonText = 'Create a Topic'
      wrapper = shallow(
        <CreateTopic {...props}>
          <div>Describe how awesome wombats are:</div>
          <input autofocus />
        </CreateTopic>
      )

      expect(wrapper).toMatchSnapshot()
    })

    // One of the rare instances we need wrapper.setState
    it('matches the last snapshot for a redirect', () => {
      wrapper.setState({ redirectTopic: 'ecological-implications-wombat-migration' })
      expect(wrapper).toMatchSnapshot()
    })

    it('matches the last snapshot (modal visible)', () => {
      wrapper.instance().toggleTopicModal()
      wrapper.update()

      expect(wrapper).toMatchSnapshot()
    })

    it('matches the last snapshot for notification (modal visible)', () => {
      const instance = wrapper.instance()
      instance.toggleTopicModal()
      instance.createAndNotify('floof')
      wrapper.update()

      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('topic name behaviour', () => {
    let instance, wrapper

    beforeEach(() => {
      wrapper = mount(<CreateTopic {...props} />)
      instance = wrapper.instance()
      instance.subscribeAndRedirect = jest.fn()
      instance.createAndNotify = jest.fn()
      instance.updateTopicName({ target: { value: 'aardvark' } })
    })

    it('subscribes and redirects to existing topics', () => {
      wrapper.setProps({
        subscribeAfterCreate: true,
        groupTopicExists: {
          aardvark: {
            'wombat-group': true
          }
        }
      })
      expect(instance.subscribeAndRedirect).toHaveBeenCalled()
    })

    it('creates a topic if it does not exist', () => {
      wrapper.setProps({
        groupTopicExists: {
          aardvark: {
            'wombat-group': false
          }
        }
      })
      expect(instance.createAndNotify).toHaveBeenCalled()
    })

    // Most validation testing is done in hylo-utils, but this is a
    // case specifically handled in the component
    it('allows leading `#` characters', () => {
      instance.updateTopicName({ target: { value: '#flargle' } })
      wrapper.setProps({
        groupTopicExists: {
          flargle: {
            'wombat-group': false
          }
        }
      })
      expect(instance.createAndNotify).toHaveBeenCalledWith('flargle')
    })
  })

  describe('submitButtonAction', () => {
    it('requires a non-empty topic name', () => {
      instance.submitButtonAction('')
      expect(wrapper.state().nameError).toMatch(/name is required/)
    })

    it('redirects for an existing topic on the client', () => {
      const subscribeAndRedirect = jest.spyOn(instance, 'subscribeAndRedirect')
      instance.updateTopicName({ target: { value: 'flarglebargles' } })
      instance.submitButtonAction()
      expect(subscribeAndRedirect).toHaveBeenCalled()
      expect(props.fetchGroupTopic).not.toHaveBeenCalled()
    })

    it('goes looking on the server if topic not in client', () => {
      instance.updateTopicName({ target: { value: 'florfle' } })
      instance.submitButtonAction()
      expect(props.fetchGroupTopic).toHaveBeenCalled()
    })
  })

  describe('submitButtonIsDisabled', () => {
    it('disables when nameError set', () => {
      wrapper.setState({ nameError: 'No. Just no.' })
      expect(instance.submitButtonIsDisabled()).toBe(true)
    })

    it('disables when name is empty', () => {
      expect(instance.submitButtonIsDisabled()).toBe(true)
    })

    it('enables when name is not empty and nameError cleared', () => {
      instance.updateTopicName({ target: { value: 'florfle' } })
      expect(instance.submitButtonIsDisabled()).toBe(false)
    })
  })
})
