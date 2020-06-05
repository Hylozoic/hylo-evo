import { connect } from 'react-redux'

export function mapStateToProps (state, props) {
  let isPublic = props.isPublic
  let communitiesPlusPublic = props.communities

  if (isPublic) {
    // TODO Update slug for public context when Public Communities and Posts context is available
    // for now, this links to the user's All Communities view
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
