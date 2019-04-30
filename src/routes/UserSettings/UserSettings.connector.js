import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import React from 'react'
import gql from 'graphql-tag'
import { get, every, includes } from 'lodash/fp'
import getQuerystringParam from 'store/selectors/getQuerystringParam'
import MeQuery from 'graphql/queries/MeQuery.graphql'
import MeUpdateMutation from 'graphql/mutations/MeUpdateMutation.graphql'
import UpdateMembershipMutation from 'graphql/mutations/UpdateMembershipMutation.graphql'
import {
  leaveCommunity,
  unlinkAccount,
  updateAllMemberships,
  registerStripeAccount
} from './UserSettings.store'
import unBlockUser from 'store/actions/unBlockUser'
import { setConfirmBeforeClose } from '../FullPageModal/FullPageModal.store'
import { loginWithService } from 'routes/NonAuthLayout/Login/Login.store'

export function mapStateToProps (state, props) {
  return {
    confirm: get('FullPageModal.confirm', state),
    queryParams: {
      registered: getQuerystringParam('registered', null, props)
    }
  }
}

export const mapDispatchToProps = {
  unBlockUser,
  leaveCommunity,
  loginWithService,
  unlinkAccount,
  setConfirmBeforeClose,
  updateAllMemberships,
  registerStripeAccount
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { confirm } = stateProps
  const { setConfirmBeforeClose } = dispatchProps
  const setConfirm = newState => {
    if (newState === confirm) return
    return setConfirmBeforeClose(newState)
  }
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    setConfirm
  }
}

const fetchCurrentUser = graphql(MeQuery, {
  props: ({ data: { me, loading } }) => {
    if (loading) return { fetchPending: loading }

    return {
      fetchPending: loading,
      currentUser: me,
      memberships: me.memberships,
      blockedUsers: me.blockedUsers,
      messageSettings: {
        sendEmail: includes(me.settings && me.settings.dmNotifications, ['email', 'both']),
        sendPushNotifications: includes(me.settings && me.settings.dmNotifications, ['push', 'both'])
      },
      allCommunitiesSettings: {
        sendEmail: every(m => m.settings && m.settings.sendEmail, me.memberships),
        sendPushNotifications: every(m => m.settings && m.settings.sendPushNotifications, me.memberships)
      }
    }
  }
})

const updateUserSettings = graphql(MeUpdateMutation, {
  props: ({ mutate, ownProps: { currentUser } }) => {
    return {
      updateUserSettings: changes => mutate({
        variables: { changes },
        optimisticResponse: {
          __typename: 'Mutation',
          updateMe: {
            __typename: 'Me',
            id: 'current-user',
            ...currentUser,
            settings: {
              __typename: 'UserSettings',
              ...currentUser.settings,
              ...changes.settings
            }
          }
        }
      }),
      update: (client, { data: { updateMe } }) => {
        const query = MeQuery
        const meBeforeUpdate = client.readQuery({ query })
        client.writeQuery({
          query,
          data: {
            me: {
              ...meBeforeUpdate.me,
              ...updateMe
            }
          }
        })
      }
    }
  }
})

const updateMembershipSettings = graphql(UpdateMembershipMutation, {
  props: ({ mutate }) => {
    return {
      updateMembershipSettings: (communityId, settings) => mutate({
        variables: {
          data: {
            settings
          },
          communityId
        }
      })
    }
  }
})

export default compose(
  fetchCurrentUser,
  updateUserSettings,
  updateMembershipSettings,
  connect(mapStateToProps, mapDispatchToProps, mergeProps)
)

// const graphqlDynamic = (query, config) => {
//   return component => {
//     return props => {
//       return React.createElement(
//         graphql(query(props), config)(component),
//         props
//       )
//     }
//   }
// }
//
// const updateAllMembershipsQuery = (props) => {
//   console.log('!!!!!! props!!!!:', props)
//   if (props.fetchPending) return gql``
//   const mutations = props.currentUser.memberships.map(({ community: { id } }) => `
//     alias${id}: updateMembership(
//       communityId: ${id},
//       data: {settings: ${JSON.stringify(settings).replace(/"/g, '')}}
//     ) {
//       id
//     }
//   `).join()
//   return gql`
//     mutation UpdateAllMemberships {
//       ${mutations}
//     }
//   `
// }

// const updateAllMemberships = graphqlDynamic(updateAllMembershipsQuery)
