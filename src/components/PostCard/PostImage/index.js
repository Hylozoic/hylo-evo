import { filter, flow, get, getOr, minBy } from 'lodash/fp'
import { bgImageStyle } from 'util/index'

const PostImage = ({ post, className }) => {
  const imageUrl = flow(
    filter(a => a.type === 'image'),
    minBy(getOr('position', 0)),
    get('url')
  )(post.attachments)

  if (!imageUrl) return null
  return <div style={bgImageStyle(imageUrl)} className={className} />
}

export default PostImage
