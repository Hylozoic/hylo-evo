import { connect } from 'react-redux'

export function mapStateToProps (state, props) {
  let isPublic = props.isPublic
  let communitiesPlusPublic = props.communities

  if (isPublic) {
    communitiesPlusPublic.unshift({ name: 'Public', id: 'public', avatarUrl: '/public-icon.svg', slug: '' })
  }

  return {
    communities: communitiesPlusPublic
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)
