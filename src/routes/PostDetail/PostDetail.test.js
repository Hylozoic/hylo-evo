import PostDetail, { PostTags } from './PostDetail'
import { shallow } from 'enzyme'
import React from 'react'
import { PostHeader, PostImage, PostBody, PostFooter } from 'components/PostCard/component'
import { getPost } from './PostDetail.connector'
import orm from 'store/models'

describe('PostDetail', () => {
  it('renders correctly', () => {
    const context = 'a project'
    const imageUrl = 'foo.jpg'
    const tags = ['singing', 'dancing']
    const details = 'the body of the post'
    const votesTotal = 7
    const slug = 'foo'

    const post = {
      id: '91',
      context,
      imageUrl,
      tags,
      details,
      votesTotal
    }

    const wrapper = shallow(<PostDetail post={post} slug={slug} />)
    expect(wrapper.find(PostHeader).length).toEqual(1)
    expect(wrapper.find(PostHeader).prop('context')).toEqual(context)
    expect(wrapper.find(PostImage).length).toEqual(1)
    expect(wrapper.find(PostImage).prop('imageUrl')).toEqual(imageUrl)
    expect(wrapper.find(PostTags).length).toEqual(1)
    expect(wrapper.find(PostTags).prop('tags')).toEqual(tags)
    expect(wrapper.find(PostBody).length).toEqual(1)
    expect(wrapper.find(PostBody).prop('details')).toEqual(details)
    expect(wrapper.find(PostFooter).length).toEqual(1)
    expect(wrapper.find(PostFooter).prop('votesTotal')).toEqual(votesTotal)
    expect(wrapper.find('Connect(Comments)').length).toEqual(1)
    expect(wrapper.find('Connect(Comments)').prop('postId')).toEqual(post.id)
    expect(wrapper.find('Connect(Comments)').prop('slug')).toEqual(slug)
  })
})

describe('getPost', () => {
  it("returns null if post doesn't exist", () => {
    const session = orm.session(orm.getEmptyState())
    expect(getPost(session.state, {match: {params: {postId: '1'}}})).toEqual(null)
  })

  it('returns the post with creator, commenters and communities', () => {
    const session = orm.session(orm.getEmptyState())
    const { Post, Person, Community } = session;
    [{
      model: Community, attrs: {id: '1', slug: 'foo'}
    },
    {
      model: Community, attrs: {id: '2', slug: 'bar'}
    },
    {
      model: Community, attrs: {id: '3', slug: 'baz'}
    },
    {
      model: Person, attrs: {id: '1', name: 'Jack'}
    },
    {
      model: Person, attrs: {id: '2'}
    },
    {
      model: Person, attrs: {id: '3', name: 'Sue'}
    },
    {
      model: Post, attrs: {id: '1', title: 'Hay', commenters: ['1'], creator: '3', communities: ['1', '2']}
    },
    {
      model: Post, attrs: {id: '2', commenters: ['2'], creator: '1', communities: ['2', '3']}
    }].forEach(spec => spec.model.create(spec.attrs))

    const result = (getPost({orm: session.state}, {match: {params: {postId: '1'}}}))
    expect(result.title).toEqual('Hay')
    expect(result.creator.name).toEqual('Sue')
    expect(result.commenters.length).toEqual(1)
    expect(result.commenters[0].name).toEqual('Jack')
    expect(result.communities.length).toEqual(2)
    expect(result.communities.map(c => c.slug)).toEqual(['foo', 'bar'])
  })
})
