import { connect } from 'react-redux'
import { fakePerson } from 'components/PostCard/samplePost'

const SAMPLE_USER = {
  ...fakePerson(),
  bio: 'Subtly charming problem solver. Friendly travel guru. Avid entrepreneur. Activist. Creator.',
  location: 'Vancouver, BC',
  website: 'www.soniajohnson.com',
  facebookUrl: 'facebook.com/soniaj',
  twitterUrl: 'twitter.com/soniaj'
}

export function mapStateToProps (state, props) {
  return {
    currentUser: SAMPLE_USER
  }
}

export const mapDispatchToProps = {
  // someAction
}

export default connect(mapStateToProps, mapDispatchToProps)
