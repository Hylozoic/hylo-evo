const getTypeByTrigger = (trigger) => (
  trigger === '#' ? 'hashtag' : `${trigger}hashtag`
)

export default getTypeByTrigger
