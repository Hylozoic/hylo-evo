export default function presentGroupRelationshipInvite (invite) {
  if (!invite) return null
  return {
    ...invite.ref,
    fromGroup: invite.fromGroup ? invite.fromGroup.ref : null,
    questionAnswers: invite.questionAnswers ? invite.questionAnswers.toModelArray().map(qa => {
      return {
        ...qa.ref,
        question: qa.question ? qa.question.ref : null
      }
    }) : [],
    toGroup: invite.toGroup ? invite.toGroup.ref : null
  }
}
