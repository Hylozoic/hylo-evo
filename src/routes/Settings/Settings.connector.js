import { connect } from 'react-redux'
import { fakePerson, SAMPLE_IMAGE_URL } from 'components/PostCard/samplePost'
import faker from 'faker'

faker.seed(995)

const SAMPLE_USER = {
  ...fakePerson(),
  bio: 'Subtly charming problem solver. Friendly travel guru. Avid entrepreneur. Activist. Creator.',
  location: 'Vancouver, BC',
  website: 'www.soniajohnson.com',
  facebookUrl: 'facebook.com/soniaj',
  twitterUrl: 'twitter.com/soniaj',
  avatarUrl: faker.image.avatar(),
  bannerUrl: SAMPLE_IMAGE_URL
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
