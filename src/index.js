import React from 'react'
import { render } from 'react-dom'
import { createBrowserHistory } from 'history'
import { Router, Route, Switch, Redirect } from 'react-router-dom'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from '@apollo/react-hooks'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'

import AdminLayout from 'layouts/Admin/Admin.js'
import UnauthenticatedLayout from 'layouts/Unauthenticated/Unauthenticated.js'
import RTLLayout from 'layouts/RTL/RTL.js'

import 'assets/scss/black-dashboard-react.scss'
import 'assets/demo/demo.css'
import 'assets/css/nucleo-icons.css'

import auth from './variables/constants'
import { REFRESH_TOKEN } from './views/Unauthenticated/Api'

const hist = createBrowserHistory()

// const [refreshToken, { data, error, loading }] = useMutation(REFRESH_TOKEN)

// const httpLink = new HttpLink({
//   uri: "https://api.raymond.digital/graphql/",
//   credentials: 'include',

// });

// const client = new ApolloClient({
//   link: httpLink,
//   cache: new InMemoryCache()
// });



class App extends React.Component {
  state = {
    refreshToken: localStorage.getItem('refreshToken'),
    isLogin: false,
    accessToken: null,
    client: new ApolloClient({
      uri: 'https://api.raymond.digital/graphql',
      fetchOptions: {
        credentials: 'include',
      },
      request: (operation) => {
        const token = this.state.accessToken
        console.log(this.state.accessToken);
        
        operation.setContext({
          headers: {
            authorization: `Bearer ${token}`,
          },
        })
      },
    })
  }

  refreshToken = async (refreshToken) => {
    // Get refresh token from cookies
    console.log('.............................................')
    console.log('refresh auth token with token:')
    console.log(refreshToken)
    console.log('.............................................')
    if (!refreshToken) return null
    // Get new auth token from server
    try {
      return this.state.client.mutate({
        mutation: REFRESH_TOKEN,
        variables: {
          refreshToken,
        },
      })
    } catch (e) {
      return null
    }
  }

  componentDidMount() {
    console.log(this.client)

    if (!auth.isLogin) {
      this.refreshToken(localStorage.getItem('refreshToken')).then((res) => {
        console.log(res)
        localStorage.setItem(
          'refreshToken',
          res.data.refreshToken.refresh_token
        )
        auth.isLogin = true
        this.setState({
          refreshToken: res.data.refreshToken.refresh_token,
          accessToken: res.data.refreshToken.access_token,
          isLogin: true,
          client: new ApolloClient({
            uri: 'https://api.raymond.digital/graphql',
            fetchOptions: {
              credentials: 'include',
            },
            request: (operation) => {
              const token = this.state.accessToken
              console.log(this.state.accessToken);
              
              operation.setContext({
                headers: {
                  authorization: `Bearer ${token}`,
                },
              })
            },
          })
        })
      })
    }
  }

  render() {
    console.log(this.state)
    return (
      <ApolloProvider client={this.state.client}>
        <Router history={hist}>
          <Switch>
            <Route
              exact
              path="/"
              render={(props) => <AdminLayout {...props} />}
            />
            <Route
              exact
              path="/user-profile"
              render={(props) => <AdminLayout {...props} />}
            />
            <Route path="/rtl" render={(props) => <RTLLayout {...props} />} />
            <Route
              path="/login"
              render={(props) => <UnauthenticatedLayout {...props} />}
            />
            <Route
              path="/register"
              render={(props) => <UnauthenticatedLayout {...props} />}
            />
            <Redirect from="*" to="/" />
          </Switch>
        </Router>
        ,
      </ApolloProvider>
    )
  }
}

// const App = () => {
//   console.log(client, auth)

//   if (!auth.isLogin) {
//     refreshToken(localStorage.getItem('refreshToken')).then((res) => {
//       console.log(res)
//       localStorage.setItem('refreshToken', res.data.refreshToken.refresh_token)
//       auth.accessToken = res.data.refreshToken.access_token
//       auth.isLogin = true
//     });
//   }

//   return (
//     <ApolloProvider client={client}>
//       <Router history={hist}>
//         <Switch>
//           <Route
//             exact
//             path="/"
//             render={(props) => <AdminLayout {...props} />}
//           />
//           <Route
//             exact
//             path="/user-profile"
//             render={(props) => <AdminLayout {...props} />}
//           />
//           <Route path="/rtl" render={(props) => <RTLLayout {...props} />} />
//           <Route
//             path="/login"
//             render={(props) => <UnauthenticatedLayout {...props} />}
//           />
//           <Route
//             path="/register"
//             render={(props) => <UnauthenticatedLayout {...props} />}
//           />
//           <Redirect from="*" to="/" />
//         </Switch>
//       </Router>
//       ,
//     </ApolloProvider>
//   )
// }

render(<App />, document.getElementById('root'))
