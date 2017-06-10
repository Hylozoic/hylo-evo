import React from 'react'
import { shallow } from 'enzyme'
import Highlight from './Highlight'

describe('Highlight', () => {
  it('wraps search terms in spans and good stuff like that', () => {
    const markup = <div className='cat'>
      <span>one cat and one dog</span>
      <span className='dog'>
        <ul>another cat</ul>
      </span>
    </div>

    const highlightClassName = 'highlight'
    const componentClassName = 'highlight-component'

    const expected = <span className={componentClassName}><div className='cat'>
      <span>one <span className={highlightClassName}>cat</span> and one <span className={highlightClassName}>dog</span></span>
      <span className='dog'>
        <ul>another <span className={highlightClassName}>cat</span></ul>
      </span>
    </div></span>

    const wrapper = shallow(<Highlight
      className={componentClassName}
      searchTerms={['cat', 'dog']}
      highlightClassName={highlightClassName}
      >{markup}</Highlight>)

    console.log('Highlight', wrapper.debug())

    expect(wrapper.find('.cat').html()).toEqual(shallow(expected).html())
  })
})
