import { connect } from 'react-redux'
import { navigate } from 'routes/NavigationHandler/store'
import { sampleComment } from 'components/PostCard/samplePost'
import { times } from 'lodash/fp'

const comments = times(i => sampleComment(), 5)

export function mapStateToProps (state, props) {
  return {
    comments: comments,
    slug: 'hylo'
  }
}

export const mapDispatchToProps = {
  navigate
}

export default connect(mapStateToProps, mapDispatchToProps)
