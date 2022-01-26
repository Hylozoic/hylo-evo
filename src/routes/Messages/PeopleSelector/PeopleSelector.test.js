import React from 'react'
import { MemoryRouter } from 'react-router'
import { mount, shallow } from 'enzyme'
import { keyMap } from 'util/textInput'
import PeopleSelector from './PeopleSelector'
import PeopleListItem from './PeopleListItem'

const defaultProps = {
  setPeopleSearch: () => {},
  fetchPeople: () => {},
  fetchContacts: () => {},
  fetchDefaultList: () => {},
  selectPerson: () => {},
  removePerson: () => {},
  changeQuerystringParam: () => {},
  selectedPeople: [],
  onCloseURL: '',
  peopleSelectorOpen: true
}

describe('PeopleSelector', () => {
  it('matches the last snapshot', () => {
    const wrapper = shallow(
      <PeopleSelector {...defaultProps} />
    )
    expect(wrapper).toMatchSnapshot()
  })

  describe('onKeyDown', () => {
    let selectPerson
    let fetchPeople
    let removePerson
    let input
    let setPeopleSearch
    let wrapper

    beforeEach(() => {
      fetchPeople = jest.fn()
      selectPerson = jest.fn()
      removePerson = jest.fn()
      setPeopleSearch = jest.fn()
      wrapper = mount(
        <MemoryRouter>
          <PeopleSelector
            {...defaultProps}
            fetchPeople={fetchPeople}
            selectPerson={selectPerson}
            removePerson={removePerson}
            setPeopleSearch={setPeopleSearch}
            people={[ { id: '1' }, { id: '2' } ]}
          />
        </MemoryRouter>
      )
      wrapper.find(PeopleSelector)
      input = wrapper.find('input').first()
    })

    it('does not hit server when backspace is pressed', () => {
      input.simulate('keyDown', { keyCode: keyMap.BACKSPACE })
      expect(fetchPeople).not.toHaveBeenCalled()
    })

    it('hits server when the input value changes', () => {
      input.simulate('change', { target: { value: 'not empty' } })
      expect(fetchPeople).toHaveBeenCalled()
    })

    it('removes participant if backspace pressed when autocompleteInput is empty', () => {
      input.simulate('keyDown', { keyCode: keyMap.BACKSPACE })
      expect(removePerson).toHaveBeenCalled()
    })

    it('does not remove participant if backspace pressed when autocompleteInput is not empty', () => {
      input.simulate('change', { target: { value: 'not empty' } })
      input.simulate('keyDown', { keyCode: keyMap.BACKSPACE })
      expect(removePerson).not.toHaveBeenCalled()
    })

    it('does not change active match if at top of list when up arrow pressed', () => {
      input.simulate('keyDown', { keyCode: keyMap.UP })
      const actual = wrapper.find(PeopleListItem).first().prop('active')
      expect(actual).toBe(true)
    })

    it('changes active match if not at top of list when up arrow pressed', () => {
      input.simulate('keyDown', { keyCode: keyMap.DOWN })
      input.simulate('keyDown', { keyCode: keyMap.UP })
      const actual = wrapper.find(PeopleListItem).last().prop('active')
      expect(actual).toBe(false)
    })

    it('does not change active match if at bottom of list when down arrow pressed', () => {
      input.simulate('keyDown', { keyCode: keyMap.DOWN })
      input.simulate('keyDown', { keyCode: keyMap.DOWN })
      const actual = wrapper.find(PeopleListItem).last().prop('active')
      expect(actual).toBe(true)
    })

    it('changes active match if not at bottom of list when down arrow pressed', () => {
      input.simulate('keyDown', { keyCode: keyMap.DOWN })
      const actual = wrapper.find(PeopleListItem).first().prop('active')
      expect(actual).toBe(false)
    })

    it('calls selectPerson with currentMatch when enter pressed', () => {
      input.simulate('keyDown', { keyCode: keyMap.ENTER })
      expect(selectPerson).toBeCalledWith({ id: '1' })
    })

    it('calls selectPerson with currentMatch when comma pressed', () => {
      input.simulate('keyDown', { keyCode: keyMap.COMMA })
      expect(selectPerson).toBeCalledWith({ id: '1' })
    })

    it('resets values after adding selectedPeople', () => {
      input.simulate('keyDown', { keyCode: keyMap.ENTER })
      expect(setPeopleSearch).toBeCalledWith(null)
      expect(input.instance().value).toBe('')
    })
  })

  describe('setPeopleSearch', () => {
    let setPeopleSearch
    let wrapper

    beforeEach(() => {
      setPeopleSearch = jest.fn()
      wrapper = mount(
        <MemoryRouter>
          <PeopleSelector
            {...defaultProps}
            setPeopleSearch={setPeopleSearch} />
        </MemoryRouter>
      )
    })

    it('updates if user input contains valid characters', () => {
      const expected = 'Poor Yorick'
      const input = wrapper.find('input').first()
      input.instance().value = expected
      input.simulate('change')
      jest.runAllTimers()
      const actual = setPeopleSearch.mock.calls[0][0]
      expect(actual).toBe(expected)
    })

    it('does not update if user input contains invalid characters', () => {
      const invalid = 'Poor Yorick9238183$@#$$@!'
      const expected = 'Poor Yorick'
      const input = wrapper.find('input').first()
      input.instance().value = invalid
      input.simulate('change')
      jest.runAllTimers()
      expect(setPeopleSearch).not.toHaveBeenCalled()
      expect(input.instance().value).toBe(expected)
    })
  })

  describe('selectPerson', () => {
    it('calls selectPerson with the correct id', () => {
      const selectPerson = jest.fn()
      const wrapper = mount(
        <MemoryRouter>
          <PeopleSelector
            {...defaultProps}
            selectPerson={selectPerson}
            people={[ { id: '1' }, { id: '2' } ]}
          />
        </MemoryRouter>
      )
      const personItem = wrapper.find(PeopleListItem).first()
      personItem.simulate('click')
      expect(selectPerson).toBeCalledWith({ id: '1' })
    })

    it('resets values after adding a participant', () => {
      const setPeopleSearch = jest.fn()
      const wrapper = mount(
        <MemoryRouter>
          <PeopleSelector
            {...defaultProps}
            setPeopleSearch={setPeopleSearch}
            people={[ { id: '1' }, { id: '2' } ]}
          />
        </MemoryRouter>
      )
      const input = wrapper.find('input').first()
      input.instance().value = 'flargle'
      const personItem = wrapper.find(PeopleListItem).first()
      personItem.simulate('click')
      expect(input.instance().value).toBeFalsy()
      expect(setPeopleSearch).toBeCalledWith(null)
    })
  })
})
