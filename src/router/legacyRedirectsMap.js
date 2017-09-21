export default function legacyRedirectsMap (match) {
  return [
    {
      path: '/c/:slug/tag/:topicName',
      to: `/c/${match.params.slug}/${match.params.topicName}`
    },
    {
      path: '/c/:slug/join/:betaAccessCode/tag/:topicName',
      to: `/c/${match.params.slug}/join/${match.params.betaAccessCode}/${match.params.topicName}`},
    {
      path: '/p/:postId',
      to: `/all/p/${match.params.postId}`
    },
    {
      path: '/u/:id',
      to: `/m/${match.params.id}`
    },
    {
      path: '/c/:slug/about',
      to: `/c/${match.params.slug}`
    },
    {
      path: '/c/:slug/people',
      to: `/c/${match.params.slug}/members`
    },
    {
      path: '/c/:slug/invite',
      to: `/c/${match.params.slug}/settings/invite`
    },
    // TODO this route should probably redirect to the communities events page when it's implemented (or remove this if the URLS are the same)
    {
      path: '/c/:slug/events',
      to: `/c/${match.params.slug}`
    },
    {
      path: '/c/:slug/projects',
      to: `/c/${match.params.slug}`
    }
  ]
}
