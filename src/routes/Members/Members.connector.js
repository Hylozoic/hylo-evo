import { connect } from 'react-redux'
import { SAMPLE_MEMBERS } from 'routes/Feed/sampleData'
// import { someAction } from 'some/path/to/actions'

export function mapStateToProps (state, props) {
  return {
    isAdmin: true,
    total: 1276,
    sort: 'name',
    members: SAMPLE_MEMBERS
  }
}

export const mapDispatchToProps = {
  // someAction
}

export default connect(mapStateToProps, mapDispatchToProps)
