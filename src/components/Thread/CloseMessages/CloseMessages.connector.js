import { connect } from 'react-redux'
import { goBack } from 'react-router-redux'

const mapDispatchToProps = { goBack }

export default connect(null, mapDispatchToProps)
