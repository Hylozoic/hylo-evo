import PostDetail from './PostDetail'
import { shallow } from 'enzyme'
import React from 'react'
import { PostHeader, PostImage, PostBody, PostFooter } from 'components/PostCard/component'
import { PostTags } from './PostDetail'
import Comments from './Comments/Comments'

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
