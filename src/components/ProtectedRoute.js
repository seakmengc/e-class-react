import React, { useContext } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { AuthContext } from '../contexts/auth'

const ProtectedRoute = ({ render: Render, ...rest }) => {
  const authContext = useContext(AuthContext)

  if (authContext.isLogin) return <Route {...rest} render={Render} />
  else return <Redirect to="/login" />
}

export default ProtectedRoute
