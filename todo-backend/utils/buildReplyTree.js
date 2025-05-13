function buildReplyTree (flatReplies) {
  const replyMap = {}
  const rootReplies = []

  flatReplies.forEach(reply => {
    reply.children = []
    replyMap[reply._id] = reply
  })

  flatReplies.forEach(reply => {
    if (reply.parentReply) {
      replyMap[reply.parentReply]?.children.push(reply)
    } else {
      rootReplies.push(reply)
    }
  })

  return rootReplies
}

export default buildReplyTree
