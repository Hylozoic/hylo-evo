import { formatNames } from './MessageThread'

describe('formatNames', () => {
  it('shows all names with no maxShown', () => {
    const names = ['Jon', 'Jane', 'Sue', 'Mike']
    const expected = 'Jon, Jane, Sue and Mike'
    expect(formatNames(names)).toEqual(expected)
  })

  it('shows two names with no maxShown', () => {
    const names = ['Jon', 'Jane']
    const expected = 'Jon and Jane'
    expect(formatNames(names)).toEqual(expected)
  })

  it('shows 3 names with maxShown = 3', () => {
    const names = ['Jon', 'Jane', 'Sue', 'Mike', 'Indra']
    const expected = 'Jon, Jane, Sue and 2 others'
    expect(formatNames(names, 3)).toEqual(expected)
  })

  it('shows two names with maxShown = 3', () => {
    const names = ['Jon', 'Jane']
    const expected = 'Jon and Jane'
    expect(formatNames(names, 3)).toEqual(expected)
  })

  it('shows one of two names maxShown = 1', () => {
    const names = ['Jon', 'Jane']
    const expected = 'Jon and 1 other'
    expect(formatNames(names, 1)).toEqual(expected)
  })
})
