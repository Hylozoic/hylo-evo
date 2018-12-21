import component from './PostCard'
import connector from './PostCard.connector'

export { PostHeader, PostImage, PostBody, PostFooter, PostCommunities } from './PostCard'
export default connector(component)
