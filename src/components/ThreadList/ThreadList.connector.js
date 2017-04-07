import { connect } from 'react-redux'
// import { someAction } from 'some/path/to/actions'
import { rndPerson } from 'routes/Feed/sampleData'
const SAMPLE_PERSON_1 = rndPerson()
const SAMPLE_PERSON_2 = rndPerson()

export function mapStateToProps (state, props) {
  return {
    threads: [
      {
        id: '1',
        participants: [SAMPLE_PERSON_1, SAMPLE_PERSON_2],
        messages: [{id: '1', createdAt: new Date(), message: 'Hey you', person: SAMPLE_PERSON_1}]
      },
      {
        id: '2',
        participants: [SAMPLE_PERSON_1, SAMPLE_PERSON_2],
        messages: [{id: '1', createdAt: new Date(), message: 'Hey you', person: SAMPLE_PERSON_1}]
      }
    ]
  }
}

export const mapDispatchToProps = {
  // someAction
}

export default connect(mapStateToProps, mapDispatchToProps)
