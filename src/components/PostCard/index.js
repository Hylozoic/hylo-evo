import component from './PostCard'
import connector from './PostCard.connector'

export { PostHeader, PostBody, PostFooter, PostCommunities, EventBody } from './PostCard'
export default connector(component)
