export async function signUser(jwt, user, secret) {
  const token = await jwt.sign(
    {
      mobile: user.mobile,
      id: user._id.toString(),
    },
    secret
  )
  return token
}
