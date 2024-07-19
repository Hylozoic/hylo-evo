import { connect } from 'react-redux'
import { fetchDefaultTopics } from 'store/actions/fetchTopics'
import findTopics from 'store/actions/findTopics'
import getDefaultTopics from 'store/selectors/getDefaultTopics'

export function mapStateToProps (state, props) {
  return {
    defaultTopics: getDefaultTopics(state, { groups: props.forGroups })
  }
}

export const mapDispatchToProps = {
  findTopics,
  fetchDefaultTopics
}

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })
