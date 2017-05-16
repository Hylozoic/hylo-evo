import { connect } from 'react-redux'
import { goBack, push } from 'react-router-redux'
import { withRouter } from 'react-router-dom'

export const mapDispatchToProps = {
  goBack,
  push
}

export default component => connect(null, mapDispatchToProps)(withRouter(component))
