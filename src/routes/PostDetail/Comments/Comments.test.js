import Comments, { ShowMore } from './Comments'
import { getComments } from './Comments.connector'
import { shallow } from 'enzyme'
import React from 'react'
import orm from 'store/models'

describe('Comments', () => {
  it('renders correctly', () => {
    const props = {
      comments: [{id: 1}, {id: 2}, {id: 3}],
      total: 9,
      hasMore: true,
      postId: '91',
      slug: 'foo'
    }
    const wrapper = shallow(<Comments {...props} />)
    expect(wrapper.find('ShowMore').length).toEqual(1)
    expect(wrapper.find('ShowMore').prop('commentsLength')).toEqual(3)
    expect(wrapper.find('Comment').length).toEqual(3)
    const comment = wrapper.find('Comment').at(0)
    expect(comment.prop('comment')).toEqual(props.comments[0])
    expect(comment.prop('slug')).toEqual(props.slug)
    expect(wrapper.find('Connect(CommentForm)').length).toEqual(1)
    expect(wrapper.find('Connect(CommentForm)').prop('postId')).toEqual(props.postId)
  })
})

describe('ShowMore', () => {
  it('returns null when hasMore is false', () => {
    const props = {
      hasMore: false
    }
    const wrapper = shallow(<ShowMore {...props} />)
    expect(wrapper.find('div').length).toEqual(0)
  })

  it('renders correctly', () => {
    const props = {
      commentsLength: 4,
      total: 11,
      hasMore: true
    }
    const wrapper = shallow(<ShowMore {...props} />)
    expect(wrapper.find('div').length).toEqual(1)
    expect(wrapper.find('div').text()).toEqual('View 1 previous comment')
  })
})

describe('getComments', () => {
  it("returns an empty array if post doesn't exist", () => {
    const session = orm.session(orm.getEmptyState())
    expect(getComments(session.state, {postId: '1'})).toEqual([])
  })

  it('returns comments for post, ordered by id', () => {
    const session = orm.session(orm.getEmptyState())
    const { Post, Comment } = session;
    [
      {model: Comment, attrs: {id: '4', post: '1'}},
      {model: Comment, attrs: {id: '5', post: '2'}},
      {model: Comment, attrs: {id: '1', post: '1'}},
      {model: Comment, attrs: {id: '3', post: '2'}},
      {model: Comment, attrs: {id: '2', post: '1'}},
      {model: Post, attrs: {id: '1'}},
      {model: Post, attrs: {id: '2'}}
    ].forEach(({ model, attrs }) => model.create(attrs))

    expect(getComments({orm: session.state}, {postId: '1'}).map(c => c.id))
    .toEqual(['1', '2', '4'])
  })
})
