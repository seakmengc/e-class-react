import React, { useContext, useEffect, useState } from 'react'
import { Route, Redirect, withRouter } from 'react-router-dom'
import { AuthContext } from '../contexts/auth'
import { useMutation, Mutation } from 'react-apollo'
import { REFRESH_TOKEN_MUTATION } from 'views/Unauthenticated/Api'

const ProtectedRoute = ({ render: Render, ...rest }) => {
  const authContext = useContext(AuthContext)

  const [refreshToken, {}] = useMutation(REFRESH_TOKEN_MUTATION)

  const [isRefreshingToken, setIsRefreshingToken] = useState(false)

  useEffect(() => {
    if (!authContext.isLogin) {
      if (localStorage.getItem('refreshToken')) {
        authContext.refreshToken(refreshToken, authContext).then((res) => {
          console.log(rest);
          rest.history.push(rest.path)
        }).catch(e => {
          rest.history.push('/login')
        })
      } else {
        rest.history.push('/login')
      }
    }
  }, [authContext])

  if (authContext.isLogin) return <Route {...rest} render={Render} />
  else return <div></div>
}

export default withRouter(ProtectedRoute)
