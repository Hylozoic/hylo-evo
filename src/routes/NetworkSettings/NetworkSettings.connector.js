import { connect } from 'react-redux'
import {
  fetchExample
} from './NetworkSettings.store'
// import getMe from 'store/selectors/getMe'

const network = {
  name: 'Lawyers for Good Government',
  description: 'An army of more than 120,000 lawyers, law students and activists' +
    'that have risen up in the wake of the 2016 election fighting for equality, justice,' +
    'and the future of our nation in defense of the values, principles, individuals,' +
    'and communities that make America a truly great nation'
}

export function mapStateToProps (state, props) {
  return {
    network
  }
}

export const mapDispatchToProps = {
  fetchExample
}

export default connect(mapStateToProps, mapDispatchToProps)
