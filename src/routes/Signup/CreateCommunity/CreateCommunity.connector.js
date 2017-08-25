import { connect } from 'react-redux'
import { createCommunity } from './CreateCommunity.store'
import { push } from 'react-router-redux'

export const mapDispatchToProps = {createCommunity, navigate: push}

export default connect(null, mapDispatchToProps)
