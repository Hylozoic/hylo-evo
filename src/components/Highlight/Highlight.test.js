import React from 'react'
import { shallow } from 'enzyme'
import Highlight from './Highlight'

describe('Highlight', () => {
  const highlightClassName = 'highlight-span'
  const componentClassName = 'highlight-component'
  const highlightTerms = ['cat', 'dog']

  it('works with react tree', () => {
    const markup = <div className='cat'>
      <span>one cat and one dog</span>
      <span className='dog'>
        <ul>another cat and another cat</ul>
      </span>
    </div>

    const expected = <span className={componentClassName}><div className='cat'>
      <span>
        one <span className={highlightClassName}>cat</span> and one <span className={highlightClassName}>dog</span>
      </span>
      <span className='dog'>
        <ul>another <span className={highlightClassName}>cat</span> and another <span className={highlightClassName}>cat</span></ul>
      </span>
    </div></span>

    const wrapper = shallow(<Highlight
      className={componentClassName}
      highlightTerms={highlightTerms}
      highlightClassName={highlightClassName}
      >{markup}</Highlight>)

    expect(wrapper.html()).toEqual(shallow(expected).html())
  })

  it('works with dangerouslySetInnerHTML', () => {
    const html = `starts with a cat <div className='cat'>
      <span>one cat and one dog</span>
      <span className='dog'>
        <ul>another cat and another cat</ul>
      </span>
    </div> ends with a dog`

    const wrapper = shallow(<Highlight
      className={componentClassName}
      highlightTerms={highlightTerms}
      highlightClassName={highlightClassName}>
      <div className='outer' dangerouslySetInnerHTML={{__html: html}} />
    </Highlight>)

    const expected = `<span>starts with a <span class="highlight-span">cat</span> </span><div classname="cat">
      <span><span>one <span class="highlight-span">cat</span> and one <span class="highlight-span">dog</span></span></span>
      <span classname="dog">
        <ul><span>another <span class="highlight-span">cat</span> and another <span class="highlight-span">cat</span></span></ul>
      </span>
    </div><span> ends with a <span class="highlight-span">dog</span></span>`

    expect(wrapper.find('.outer').prop('dangerouslySetInnerHTML').__html).toEqual(expected)
  })

  it('removes non word characters from search terms', () => {
    const highlightTerms = ['$%&^<dog>.,/.>']

    const markup = <div>just a solitary dog</div>

    const expected = <span className={componentClassName}>
      <div>just a solitary <span className={highlightClassName}>dog</span></div>
    </span>

    const wrapper = shallow(<Highlight
      className={componentClassName}
      highlightTerms={highlightTerms}
      highlightClassName={highlightClassName}
      >{markup}</Highlight>)

    expect(wrapper.html()).toEqual(shallow(expected).html())
  })
})
