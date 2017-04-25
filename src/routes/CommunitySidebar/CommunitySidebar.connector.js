import { connect } from 'react-redux'
import {
  fetchExample
} from './CommunitySidebar.store'
import { SAMPLE_COMMUNITY } from 'routes/CommunityFeed/sampleData'

export function mapStateToProps (state, props) {
  return {
    community: {
      ...SAMPLE_COMMUNITY
    }
  }
}

export const mapDispatchToProps = {
  fetchExample
}

export default connect(mapStateToProps, mapDispatchToProps)
