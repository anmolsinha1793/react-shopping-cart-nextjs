import React from 'react';
import axios from 'axios';
import baseUrl from '../../utils/baseUrl';
import cookie from 'js-cookie';
import { Header, Checkbox, Table, Icon, Divider } from 'semantic-ui-react';
import formatDate from '../../utils/formatDate';

function AccountPermissions() {
  const [users, setUsers] = React.useState([]);

  React.useEffect(() => {
    getUsers();
  }, []);

  /**
  * This method is used to get all the users
  * @returns void
  */
  async function getUsers() {
    const url = `${baseUrl}/api/users`;
    const token = cookie.get('token');
    const payload = { headers: { Authorization: token } };
    const response = await axios.get(url, payload);
    setUsers(response.data);
  }


  function UserPermission({ user }) {
    const [admin, setAdmin] = React.useState(user.role === 'admin');
    const isFirstRun = React.useRef(true);

    React.useEffect(() => {
      if (isFirstRun.current) {
        isFirstRun.current = false;
        return;
      }
      updatePermission();
    }, [admin]);

    /**
    * This method is used to handle state change
    * @returns void
    */
    function handleChangePermission() {
      setAdmin(prevState => !prevState);
    }

    /**
    * This method is used to update user role
    * @returns void
    */
    async function updatePermission() {
      const url = `${baseUrl}/api/account`;
      const payload = { _id: user._id, role: admin ? 'admin' : 'user' };
      await axios.put(url, payload);
    }
    return (
      <Table.Row>
        <Table.Cell collapsing>
          <Checkbox checked={admin} toggle onChange={handleChangePermission} />
        </Table.Cell>
        <Table.Cell>
          {user.name}
        </Table.Cell>
        <Table.Cell>
          {user.email}
        </Table.Cell>
        <Table.Cell>
          {formatDate(user.createdAt)}
        </Table.Cell>
        <Table.Cell>
          {formatDate(user.updatedAt)}
        </Table.Cell>
        <Table.Cell>
          {admin ? 'admin' : 'user'}
        </Table.Cell>
      </Table.Row>
    )
  }
  return (
    <div style={{ margin: '2em 0' }}>
      <Header as="h2">
        <Icon name="settings" />
        User Permissions
      </Header>
      <Table compact celled definition>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Joined</Table.HeaderCell>
            <Table.HeaderCell>Updated</Table.HeaderCell>
            <Table.HeaderCell>Role</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {users.map(user => (
            <UserPermission key={user._id} user={user} />
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}

export default AccountPermissions;
