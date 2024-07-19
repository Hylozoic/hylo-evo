import { pinPost } from './PostHeader.store'

describe('pinPost', () => {
  it('matches last snapshot', () => expect(pinPost(1, 2)).toMatchSnapshot())
})
