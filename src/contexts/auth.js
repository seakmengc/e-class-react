import { createContext } from 'react'

const AuthContext = createContext({
  user: null,
  isLogin: false,
  accessToken: null,
  login: async (loginGql, context) => {
    const res = await loginGql()

    localStorage.setItem('refreshToken', res.data.login.refresh_token)
    context.isLogin = true
    context.accessToken = res.data.login.access_token
    context.user = res.data.login.user
    console.log(context)
  },
  logout: async (logoutGql, context) => {
    await logoutGql()

    localStorage.removeItem('refreshToken')
    context.isLogin = false
    context.accessToken = null
    context.user = null
    console.log(context)
  },
  refreshToken: async (refreshTokenGql, context) => {
    const res = await refreshTokenGql()

    localStorage.setItem('refreshToken', res.data.refreshToken.refresh_token)
    context.isLogin = true
    context.accessToken = res.data.refreshToken.access_token
    context.user = res.data.refreshToken.user
    console.log({ context })
    console.log({ res })
  },
})

export { AuthContext }
