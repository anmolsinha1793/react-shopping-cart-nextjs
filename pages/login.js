import {Form, Message, Button, Icon, Segment} from 'semantic-ui-react';
import Link from 'next/link';
import React from 'react';
import catchErrors from '../utils/catchErrors';
import axios from 'axios';
import baseUrl from '../utils/baseUrl';
import {handleLogin} from '../utils/auth';

const INITIAL_USER = {
  email: '',
  password: ''
}
function Login() {
  const [user, setUser] = React.useState(INITIAL_USER);
  const [disbaled, setDisabled] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const isUser = Object.values(user).every(elm => Boolean(elm));
    setDisabled(!isUser);
  }, [user])

  /**
  * This method is used to handle state change for user
  * @returns void
  */
  function handleChange() {
    const { name,value } = event.target;
    setUser(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  /**
  * This method is triggered when user tries to login
  * @returns void
  */
  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setLoading(true);
      setError('');
      const url = `${baseUrl}/api/login`;
      const payload = { ...user };
      const response = await axios.post(url, payload);
      handleLogin(response.data)
      //* make a request to signup user
    } catch (err) {
      catchErrors(err, setError)
    } finally {
      setLoading(false);
    }
  }

  return <>
    <Message attached icon="privacy" header="Welcome Back!"
    content="Login with email and password"
    color="blue"/>
    <Form error={Boolean(error)} onSubmit={handleSubmit} loading={loading}>
      <Message
      error
      header="Oops!"
      content={error}/>
      <Segment>
        <Form.Input
        fluid
        icon="envelope"
        iconPosition="left"
        label="Email"
        placeholder="Email"
        name="email"
        type="email"
        value={user.email}
        onChange={handleChange}
        />
        <Form.Input
        fluid
        icon="lock"
        iconPosition="left"
        label="Password"
        placeholder="Password"
        name="password"
        type="password"
        value={user.password}
        onChange={handleChange}
        />
        <Button
        icon="sign in"
        type="submit"
        color="orange"
        content="Login"
        disabled={disbaled || loading}/>
      </Segment>
    </Form>
    <Message attached="bottom" warning>
      <Icon name="help"/>
    New user?{' '}
    <Link href="/signup">
      <a>Sign up here</a>
    </Link>{' '}instead.
    </Message>
 </>
}

export default Login;
