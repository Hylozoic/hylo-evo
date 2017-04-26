import { connect } from 'react-redux'
import {
  fetchExample
} from './CommunitySidebar.store'
import { SAMPLE_COMMUNITY } from 'routes/CommunityFeed/sampleData'
import { fakePerson } from 'components/PostCard/samplePost'

export function mapStateToProps (state, props) {
  return {
    community: {
      ...SAMPLE_COMMUNITY
    },
    members: fakePerson(8),
    membersTotal: 5600,
    leaders: fakePerson(5)
  }
}

export const mapDispatchToProps = {
  fetchExample
}

export default connect(mapStateToProps, mapDispatchToProps)
