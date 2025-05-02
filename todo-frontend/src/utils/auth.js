export const getCurrentUserId = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  return user?._id || null
}
