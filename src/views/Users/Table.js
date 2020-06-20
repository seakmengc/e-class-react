import React from 'react'
import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { H3 } from './Styled'

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardFooter,
  CardText,
  FormGroup,
  Form,
  Input,
  Table,
  Row,
  Col,
} from 'reactstrap'

const USERS_QUERY = gql`
  query USERS_QUERY($first: Int!, $page: Int!) {
    users(first: $first, page: $page) {
      data {
        id
        username
        identity {
          first_name
          last_name
        }
      }
    }
  }
`

const UserProfile = (props) => {
  const { loading, error, data, fetchMore } = useQuery(USERS_QUERY, {
    variables: {
      first: 1,
      page: 1,
    },
  })

  if (loading) return <p>Loading...</p>
  if (error) return `Error! ${error}`

  const { paginatorInfo, data: users } = data?.users

  return (
    <div className="content">
      <Row>
        <Col md="12">
          <Card>
            <CardHeader>
              <H3 className="title">Users</H3>
            </CardHeader>
            <CardBody>
              <Table className="tablesorter">
                <thead className="text-primary">
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Full Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map((user) => (
                    <tr>
                      <td>{user.id}</td>
                      <td>{user.username}</td>
                      <td>
                        {user.identity?.first_name
                          ? `${user.identity?.first_name} ${user.identity?.last_name}`
                          : 'No Name'}
                      </td>
                      <td>
                        <Button size="sm" className="mr-3 my-1" color="info">
                          Show
                        </Button>
                        <Button size="sm" className="mr-3 my-1" color="success">
                          Edit
                        </Button>
                        <Button size="sm" className="mr-3 my-1" color="danger">
                          Delete
                        </Button>
                      </td>
                      {/* <td className="text-center">$36,738</td> */}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default UserProfile
