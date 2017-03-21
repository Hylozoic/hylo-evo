import { connect } from 'react-redux'
import { fetchPost } from 'store/actions/posts'
import { getPostById } from 'store/selectors'

export function mapStateToProps (state, props) {
  console.log(getPostById(state, props))
  return {
    post: getPostById(state, props)
  }
}

export const mapDispatchToProps = { fetchPost }

export default connect(mapStateToProps, mapDispatchToProps)



// const session = orm.session(state)
// const session = schema
// console.log(schema)
// if (session.Post.exists()) {
//   console.log('rendering', session.Post.withId(id))
//   return {post: session.Post.withId(id)}
// } else {
//   return {}
// }
