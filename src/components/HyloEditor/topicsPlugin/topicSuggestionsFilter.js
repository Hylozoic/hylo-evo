const topicSuggestionFilter = (searchValue, issues) => {
  console.log(issues.get(0).get('name'))
  const lowerSearch = searchValue.toLowerCase()
  return issues
    .filter(i =>
      String(i
        .get('name')
        .replace(/\s+/g, '')
        .toLowerCase()
        .indexOf(lowerSearch) !== -1
      )
    )
    .take(5)
}

export default topicSuggestionFilter
