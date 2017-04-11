import { connect } from 'react-redux'
import { fetchCurrentUser } from 'routes/PrimaryLayout/actions'
import getCurrentUser from 'store/selectors/getCurrentUser'
import { rndPerson } from 'routes/Feed/sampleData'
const SAMPLE_PERSON_1 = rndPerson()
const SAMPLE_PERSON_2 = rndPerson()
const SAMPLE_PERSON_3 = rndPerson()
const SAMPLE_PERSON_4 = rndPerson()
const SAMPLE_PERSON_5 = rndPerson()

export function mapStateToProps (state, props) {
  return {
    currentUser: getCurrentUser(state),
    threads: [
      {
        id: '1',
        participants: [SAMPLE_PERSON_1, SAMPLE_PERSON_2],
        messages: [{id: '1', createdAt: new Date(), message: 'Hey you', person: SAMPLE_PERSON_1}]
      },
      {
        id: '2',
        participants: [SAMPLE_PERSON_1, SAMPLE_PERSON_2, SAMPLE_PERSON_3],
        messages: [{id: '1', createdAt: new Date(), message: 'Hey you', person: SAMPLE_PERSON_1}]
      },
      {
        id: '3',
        participants: [SAMPLE_PERSON_1, SAMPLE_PERSON_2],
        messages: [{id: '1', createdAt: new Date(), message: 'Hey you', person: SAMPLE_PERSON_1}]
      },
      {
        id: '4',
        participants: [SAMPLE_PERSON_1, SAMPLE_PERSON_2, SAMPLE_PERSON_3, SAMPLE_PERSON_4],
        messages: [{id: '1', createdAt: new Date(), message: 'Hey you', person: SAMPLE_PERSON_1}]
      },
      {
        id: '5',
        participants: [SAMPLE_PERSON_1, SAMPLE_PERSON_2, SAMPLE_PERSON_3, SAMPLE_PERSON_4, SAMPLE_PERSON_5],
        messages: [{id: '1', createdAt: new Date(), message: 'Hey you', person: SAMPLE_PERSON_1}]
      }
    ]
  }
}

export const mapDispatchToProps = {
  fetchCurrentUser
}

export default connect(mapStateToProps, mapDispatchToProps)
