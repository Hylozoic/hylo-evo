import { formatNames } from './MessageThread'
import orm from 'store/models'

describe('MessageThread', () => {
  it('marks a thread as unread if lastReadAt is undefined', () => {
    const session = orm.session(orm.getEmptyState())
    const { MessageThread } = session

    const thread = MessageThread.create({ id: '1', lastReadAt: undefined })
    expect(thread.isUnread()).toBeTruthy()
  })
  it('marks a thread as unread if lastReadAt is older than updatedAt', () => {
    const session = orm.session(orm.getEmptyState())
    const { MessageThread } = session

    const lastReadAt = new Date('2018-01-01')
    const updatedAt = new Date('2018-01-02')
    const thread = MessageThread.create({ id: '1', updatedAt, lastReadAt })
    expect(thread.isUnread()).toBeTruthy()
  })
  it('marks a thread as read if updatedAt is older than lastReadAt', () => {
    const session = orm.session(orm.getEmptyState())
    const { MessageThread } = session

    const lastReadAt = new Date('2018-01-02')
    const updatedAt = new Date('2018-01-01')
    const thread = MessageThread.create({ id: '1', updatedAt, lastReadAt })
    expect(thread.isUnread()).toBeFalsy()
  })
})

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
