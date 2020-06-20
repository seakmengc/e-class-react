import React, { useContext, useEffect } from 'react'
import { Route, Redirect, withRouter } from 'react-router-dom'
import { AuthContext } from '../contexts/auth'
import { useMutation, Mutation } from 'react-apollo'
import { REFRESH_TOKEN } from 'views/Unauthenticated/Api'

const ProtectedRoute = ({ render: Render, ...rest }) => {
  const authContext = useContext(AuthContext)

  const [refreshToken, {}] = useMutation(REFRESH_TOKEN)

  useEffect(() => {
    if (!authContext.isLogin && localStorage.getItem('refreshToken'))
      authContext.refreshToken(refreshToken, authContext).then((res) => {
        rest.history.push(rest.path)
      })
  }, [])

  if (authContext.isLogin) return <Route {...rest} render={Render} />
  else return <div></div>
}

export default withRouter(ProtectedRoute)
