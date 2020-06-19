import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { Link } from 'react-router-dom'
import useForm from '../../lib/useForm'
import { FormWrapper, H3 } from './Styled'
import { USER_LOGIN_MUTATION } from './Api'
import Error from './ErrorMessage'

// reactstrap components
import {
  Alert,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardText,
  FormGroup,
  FormFeedback,
  Form,
  Input,
  Row,
  Col,
} from 'reactstrap'

const Login = (props) => {
  const { inputs, handleChange, resetForm } = useForm({
    username: '',
    password: '',
  })

  const [validation, setValidation] = useState(false)
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  const [login, { error, loading }] = useMutation(USER_LOGIN_MUTATION, {
    variables: inputs,
  })

  return (
    <FormWrapper>
      <Row style={{ width: 700 }}>
        <Col md="12">
          <Card>
            <CardHeader>
              <H3 className="title">Login</H3>
            </CardHeader>
            <Error error={error} />
            <CardBody>
              <Form
                onSubmit={async (e) => {
                  e.preventDefault()
                  setIsButtonDisabled(true)
                  // setValidation(true)
                  try {
                    const { data } = await login()
                    const {
                      access_token,
                      refresh_token,
                      expires_in,
                    } = data?.login

                    // handle data
                    localStorage.setItem('access_token', access_token)
                    localStorage.setItem('refresh_token', refresh_token)

                    props.history.push('/')
                  } catch (err) {
                    setIsButtonDisabled(false)
                  }
                }}
              >
                <Row className="p-3">
                  <Col md="12">
                    <FormGroup>
                      <label>Username</label>
                      <Input
                        placeholder="Username, Phone, or Email"
                        type="text"
                        name="username"
                        value={inputs.username}
                        onChange={handleChange}
                        required
                      />
                      <FormFeedback>
                        You will not be able to see this
                      </FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md="12">
                    <FormGroup>
                      <label>Password</label>
                      <Input
                        placeholder="********"
                        type="password"
                        name="password"
                        value={inputs.password}
                        onChange={handleChange}
                        required
                      />
                    </FormGroup>
                  </Col>

                  <Col md="12" className="mb-4">
                    <Link to="/login/forgot-password">Forgot Password?</Link>
                  </Col>

                  <Col md="12" className="mt-1">
                    <Button
                      type="submit"
                      className="btn-fill"
                      color="primary"
                      disabled={isButtonDisabled}
                    >
                      Login
                    </Button>
                  </Col>
                </Row>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </FormWrapper>
  )
}

export default Login
