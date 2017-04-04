import { connect } from 'react-redux'
import { SAMPLE_MEMBERS } from 'routes/Feed/sampleData'
// import { someAction } from 'some/path/to/actions'

export function mapStateToProps (state, props) {
  return {
    total: 1276,
    members: SAMPLE_MEMBERS
  }
}

export const mapDispatchToProps = {
  // someAction
}

export default connect(mapStateToProps, mapDispatchToProps)
