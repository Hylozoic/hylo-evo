import { addSkill, removeSkill } from './AddSkills.store'

describe('AddSkills store', () => {
  it('should call addSkill', () => {
    const name = 'My Name'
    expect(addSkill(name)).toMatchSnapshot()
  })

  it('should call removeSkill', () => {
    const id = 1
    expect(removeSkill(id)).toMatchSnapshot()
  })
})
