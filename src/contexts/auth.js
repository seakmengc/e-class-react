import { createContext } from 'react'

const setAuthContext = (context, data, refreshTokenGql) => {
  console.log('try set authContext')

  localStorage.setItem('refreshToken', data.refresh_token)
  context.isLogin = true
  context.accessToken = data.access_token
  context.user = data.user
  setTimeout(
    context.refreshToken,
    data.expires_in * 1000,
    refreshTokenGql,
    context
  )
}

const AuthContext = createContext({
  user: null,
  isLogin: false,
  accessToken: null,
  login: async (loginGql, context, refreshTokenGql) => {
    const res = await loginGql()

    setAuthContext(context, res.data.login, refreshTokenGql)
  },
  logout: async (logoutGql, context) => {
    await logoutGql()

    localStorage.removeItem('refreshToken')
    context.isLogin = false
    context.accessToken = null
    context.user = null
  },
  refreshToken: async (refreshTokenGql, context) => {
    console.log('try refresh token', refreshTokenGql)
    const res = await refreshTokenGql({
      variables: {
        refreshToken: localStorage.getItem('refreshToken'),
      },
    })
    console.log('done refresh token')

    setAuthContext(context, res.data.refreshToken, refreshTokenGql)
  },
})

export { AuthContext, setAuthContext }
