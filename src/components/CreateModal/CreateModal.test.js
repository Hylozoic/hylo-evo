import React from 'react'
import orm from 'store/models'
import { AllTheProviders, render, screen, waitFor } from 'util/testing/reactTestingLibraryExtended'
import CreateModal from './CreateModal'

// jest.mock('react-i18next', () => ({
//   // this mock makes sure any components using the translate hook can use it without a warning being shown
//   useTranslation: () => {
//     return {
//       t: (str) => str,
//       i18n: {
//         changeLanguage: () => new Promise(() => {})
//       }
//     }
//   }
// }))

function testProviders () {
  const ormSession = orm.mutableSession(orm.getEmptyState())
  ormSession.Me.create({ id: '1' })
  const reduxState = { orm: ormSession.state }

  return AllTheProviders(reduxState)
}

it('renders', () => {
  render(
    <CreateModal match={{ params: {} }} location={{ search: '' }} />,
    { wrapper: testProviders() }
  )

  waitFor(() => expect(screen.getByText('What would you like to create?')).toBeInTheDocument())
})
