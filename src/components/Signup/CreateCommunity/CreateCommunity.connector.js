import { connect } from 'react-redux'
import { fetchCommunity } from './CreateCommunity.store'
import { push } from 'react-router-redux'

export const mapDispatchToProps = {fetchCommunity, navigate: push}

export default connect(null, mapDispatchToProps)
