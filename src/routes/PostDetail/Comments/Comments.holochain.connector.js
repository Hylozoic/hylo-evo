import { connect } from 'react-redux'
import { compose, graphql } from 'react-apollo'
import { get } from 'lodash/fp'
import getMe from 'store/selectors/getMe'
import getRouteParam from 'store/selectors/getRouteParam'
import HolochainPostQuery from 'graphql/queries/HolochainPostQuery.graphql'
import { currentDateString } from 'util/holochain'
import HolochainCreateCommentMutation from 'graphql/mutations/HolochainCreateCommentMutation.graphql'

export function mapStateToProps (state, props) {
  return {
    currentUser: getMe(state)
  }
}

const comments = graphql(HolochainPostQuery, {
  props: ({ data: { post, loading } }) => {
    const comments = get('comments.items', post)

    return {
      comments,
      total: comments ? comments.length : 0,
      loading
    }
  },
  options: props => ({
    variables: {
      id: props.postId
    },
    fetchPolicy: 'cache-only'
  })
})

const createComment = graphql(HolochainCreateCommentMutation, {
  props: ({ mutate, ownProps }) => {
    return {
      createComment: async (text) => {
        await mutate({
          variables: {
            postId: ownProps.postId,
            text,
            createdAt: currentDateString()
          },
          refetchQueries: [
            {
              query: HolochainPostQuery,
              variables: {
                id: ownProps.postId
              }
            }
          ]
        })
        ownProps.scrollToBottom()
      }
    }
  }

})

export default compose(
  connect(mapStateToProps),
  comments,
  createComment
)
