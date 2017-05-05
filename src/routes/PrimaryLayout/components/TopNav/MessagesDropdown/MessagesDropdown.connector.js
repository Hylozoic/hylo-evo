import { connect } from 'react-redux'
// import { getMe } from 'store/selectors/getMe'
import { fakePerson } from 'components/PostCard/samplePost'
import { times } from 'lodash/fp'
import faker from 'faker'

faker.seed(345)

const sampleMessages = times(i => ({
  id: i,
  text: "Yes that makes total sense. :) Let's connect tomorrow to chat about it.",
  creator: fakePerson(),
  createdAt: faker.date.recent().toString()
}), 5)

export function mapStateToProps (state, props) {
  return {
    messages: sampleMessages
//  currentUser: getMe(state, props)
  }
}

export const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)
