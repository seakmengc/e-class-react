import React, { useContext, useEffect } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { AuthContext } from '../contexts/auth'
import { useMutation, Mutation } from 'react-apollo'
import { REFRESH_TOKEN } from 'views/Unauthenticated/Api'

const ProtectedRoute = ({ render: Render, ...rest }) => {
  const authContext = useContext(AuthContext)

  if (authContext.isLogin) return <Route {...rest} render={Render} />
  else return <Redirect to="/login" />
}

export default ProtectedRoute
