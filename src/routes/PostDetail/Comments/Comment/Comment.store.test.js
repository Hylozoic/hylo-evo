import { deleteComment, updateComment } from './Comment.store'

describe('deleteComment', () => {
  it('should match latest snapshot', () => {
    expect(deleteComment('1')).toMatchSnapshot()
  })
})

describe('updateComment', () => {
  it('should match latest snapshot', () => {
    expect(updateComment('1', 'lalalala')).toMatchSnapshot()
  })
})
