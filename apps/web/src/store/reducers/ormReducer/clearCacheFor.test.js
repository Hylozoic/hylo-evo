import clearCacheFor from './clearCacheFor'

describe('clearCacheFor', () => {
  it('runs expected Redux ORM cache clear hack', () => {
    const ModelClass = {
      withId: jest.fn(() => ModelClass),
      update: jest.fn()
    }
    clearCacheFor(ModelClass, '10')
    expect(ModelClass.update).toHaveBeenCalled()
  })
})
