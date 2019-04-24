import React from 'react'
import { shallow, mount } from 'enzyme'
import FlagContent from './FlagContent'

describe('FlagContent', () => {
  it('matches the last snapshot', () => {
    const wrapper = shallow(<FlagContent type='post'
      onClose={() => { }} />
    , <div />)

    expect(wrapper).toMatchSnapshot()
  })

  it('changes title based on type', () => {
    const wrapper = shallow(<FlagContent type='post'
      onClose={() => { }} />
    , <div />)

    expect(wrapper).toMatchSnapshot()
  })

  it('calls onClose successfully', () => {
    const onClose = jest.fn()
    const instance = mount(<FlagContent visible
      type='post'
      onClose={onClose} />
    ).instance()

    instance.closeModal()

    expect(onClose).toHaveBeenCalled()
  })

  it('sets required to true when called with no reason', () => {
    const onClose = jest.fn()
    const submitFlagContent = jest.fn()

    const linkData = { id: 33, type: 'post' }
    const instance = mount(<FlagContent visible
      type='post'
      linkData={linkData}
      submitFlagContent={submitFlagContent}
      onClose={onClose} />
    ).instance()

    expect(instance.state.reasonRequired).toBeFalsy()

    instance.submit()

    expect(instance.state.reasonRequired).toBeTruthy()
  })

  it('calls submit successfully with category:inappropriate', () => {
    const onClose = jest.fn()
    const submitFlagContent = jest.fn()

    const linkData = { id: 33, type: 'post' }
    const instance = mount(<FlagContent visible
      type='post'
      linkData={linkData}
      submitFlagContent={submitFlagContent}
      onClose={onClose} />
    ).instance()

    instance.setState({ selectedCategory: 'inappropriate' })

    instance.setState({
      explanation: '  my reason  '
    })

    instance.submit()

    expect(instance.isExplanationOptional()).toBeTruthy()

    expect(submitFlagContent).toHaveBeenCalledWith('inappropriate', 'my reason', linkData)
    expect(onClose).toHaveBeenCalled()
  })

  it('calls submit successfully with category:other', () => {
    const onClose = jest.fn()
    const submitFlagContent = jest.fn()

    const linkData = { id: 33, type: 'post' }
    const renderer = mount(<FlagContent visible
      type='post'
      linkData={linkData}
      submitFlagContent={submitFlagContent}
      onClose={onClose} />
    )

    expect(renderer).toMatchSnapshot()

    const instance = renderer.instance()

    instance.setState({ selectedCategory: 'other' })

    expect(instance.isExplanationOptional()).toBeFalsy()
    expect(instance.state.highlightRequired).toBeFalsy()

    instance.setState({
      explanation: '   '
    })

    instance.submit()

    expect(submitFlagContent).not.toHaveBeenCalled()
    expect(instance.state.highlightRequired).toBeTruthy()

    instance.setState({
      explanation: '  my reason  '
    })

    instance.submit()

    expect(submitFlagContent).toHaveBeenCalledWith('other', 'my reason', linkData)
    expect(onClose).toHaveBeenCalled()
  })

  describe('cancel', () => {
    it('sets the state and calls closeModal', () => {
      const instance = mount(
        <FlagContent type='post' />).instance()

      instance.closeModal = jest.fn()

      instance.setState({
        highlightRequired: true
      })

      instance.cancel()
      expect(instance.state.highlightRequired).toEqual(false)
      expect(instance.closeModal).toHaveBeenCalled()
    })
  })

  describe('isExplanationOptional', () => {
    it('works from param', () => {
      const instance = mount(
        <FlagContent type='post' />).instance()

      instance.setState({
        selectedCategory: 'Not other'
      })
      expect(instance.isExplanationOptional('other')).toEqual(false)
      expect(instance.isExplanationOptional('fine')).toEqual(true)
    })

    it('works from state', () => {
      const instance = mount(
        <FlagContent type='post' />).instance()

      instance.setState({
        selectedCategory: 'other'
      })
      expect(instance.isExplanationOptional()).toEqual(false)
      instance.setState({
        selectedCategory: 'fine'
      })
      expect(instance.isExplanationOptional()).toEqual(true)
    })
  })
})
