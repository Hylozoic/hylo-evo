import { connect } from 'react-redux'
import { navigate } from 'routes/NavigationHandler/store'
import { sampleComment, fakePerson } from 'components/PostCard/samplePost'
import { times } from 'lodash/fp'

const comments = times(i => sampleComment(), 5)

export function mapStateToProps (state, props) {
  return {
    comments: comments,
    commentsTotal: 20,
    fetchComments: () => console.log('Fetch more comments'),
    createComment: params => console.log('creating comment', params),
    slug: 'hylo',
    currentUser: fakePerson()
  }
}

export const mapDispatchToProps = {
  navigate
}

export default connect(mapStateToProps, mapDispatchToProps)
