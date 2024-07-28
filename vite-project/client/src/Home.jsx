import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

// Styled components
const FullScreenContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
`;

const Logo = styled.img`
  height: 50px;
`;

const NavBar = styled.nav`
  display: flex;
  gap: 15px;
`;

const NavLink = styled.a`
  color: #fff;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  padding-top: 50px;
  position: relative;
`;

const CreateButtonContainer = styled.div`
  position: absolute;
  top: 10px;
  right: 20px;
  display: flex;
  justify-content: flex-end;
`;

const CreateButton = styled.button`
  padding: 8px 16px;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
`;

const FormContainer = styled.div`
  max-width: 400px;
  width: 100%;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const SubmitButton = styled.button`
  padding: 8px 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const ErrorMessage = styled.p`
  color: #dc3545;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  padding: 10px;
  border-bottom: 1px solid #ccc;
  background-color: #f5f5f5;
`;

const TableRow = styled.tr`
  &:hover {
    background-color: #f5f5f5;
  }
`;

const Header = ({ username, onLogout }) => {
  return (
    <HeaderContainer>
      <Logo src="https://www.clipartmax.com/png/small/203-2037661_logo-sample-earth.png" alt="Logo" />
      <NavBar>
        <NavLink href="#">{username}</NavLink>
        <NavLink href="/login" onClick={onLogout}>Logout</NavLink>
      </NavBar>
    </HeaderContainer>
  );
};

const EmployeeForm = ({ onClose, onFormSubmit, employee }) => {
  const [formData, setFormData] = useState(employee || {
    userid: '',
    name: '',
    email: '',
    designation: '',
    gender: '',
    course: '',
    image: ''
  });
  const [formError, setFormError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.designation) {
      setFormError("Please fill in all required fields.");
      return;
    }

    const request = employee
      ? axios.put(`http://localhost:3001/updateEmployee/${employee.userid}`, formData)
      : axios.post('http://localhost:3001/createEmployee', formData);

    request
      .then(response => {
        console.log('Employee saved:', response.data);
        setFormError(null);
        onClose();
        onFormSubmit();
      })
      .catch(error => {
        console.error('Error saving employee:', error);
        setFormError("There was an error saving the employee!");
      });
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <FormContainer>
          <Form onSubmit={handleSubmit}>
            <Input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
            />
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <Input
              type="text"
              name="designation"
              placeholder="Designation"
              value={formData.designation}
              onChange={handleInputChange}
            />
            <Input
              type="text"
              name="gender"
              placeholder="Gender"
              value={formData.gender}
              onChange={handleInputChange}
            />
            <Input
              type="text"
              name="course"
              placeholder="Course"
              value={formData.course}
              onChange={handleInputChange}
            />
            <Input
              type="text"
              name="image"
              placeholder="Image URL"
              value={formData.image}
              onChange={handleInputChange}
            />
            <SubmitButton type="submit">{employee ? 'Update Employee' : 'Add Employee'}</SubmitButton>
            {formError && <ErrorMessage>{formError}</ErrorMessage>}
          </Form>
        </FormContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

const EmployeeTable = ({ employees, onEdit, onDelete }) => {
  return (
    <Table>
      <thead>
        <tr>
          <TableHeader>Employee ID</TableHeader>
          <TableHeader>Name</TableHeader>
          <TableHeader>Email</TableHeader>
          <TableHeader>Designation</TableHeader>
          <TableHeader>Gender</TableHeader>
          <TableHeader>Course</TableHeader>
          <TableHeader>Actions</TableHeader>
        </tr>
      </thead>
      <tbody>
        {employees.map((employee) => (
          <TableRow key={employee.userid}>
            <td>{employee.userid}</td>
            <td>{employee.name}</td>
            <td>{employee.email}</td>
            <td>{employee.designation}</td>
            <td>{employee.gender}</td>
            <td>{employee.course}</td>
            <td>
              <button onClick={() => onEdit(employee)}>Edit</button>
              <button onClick={() => onDelete(employee)}>Delete</button>
            </td>
          </TableRow>
        ))}
      </tbody>
    </Table>
  );
};

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [username, setUsername] = useState("User");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    axios.get('http://localhost:3001/')
      .then(response => {
        setEmployees(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError("There was an error fetching the employees!");
        setLoading(false);
      });
  };

  const handleLogout = () => {
    console.log("User logged out");
    // Add logic to handle logout
    // For example, clear user session and redirect to login page
  };

  const handleShowForm = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleEdit = (employee) => {
    setCurrentEmployee(employee);
    setShowEditForm(true);
  };

  const handleDelete = (employee) => {
    axios.delete(`http://localhost:3001/deleteEmployee/${employee.userid}`)
      .then(response => {
        console.log('Employee deleted:', response.data);
        fetchEmployees();
      })
      .catch(error => {
        setError("There was an error deleting the employee!");
      });
  };

  const handleCloseEditForm = () => {
    setShowEditForm(false);
    setCurrentEmployee(null);
  };

  return (
    <FullScreenContainer>
      <Header username={username} onLogout={handleLogout} />
      <ContentContainer>
        <CreateButtonContainer>
          <CreateButton onClick={handleShowForm}>Create Employee</CreateButton>
        </CreateButtonContainer>
        {showForm && (
          <EmployeeForm
            onClose={handleCloseForm}
            onFormSubmit={fetchEmployees}
          />
        )}
        {showEditForm && currentEmployee && (
          <EmployeeForm
            employee={currentEmployee}
            onClose={handleCloseEditForm}
            onFormSubmit={fetchEmployees}
          />
        )}
        {loading && <p>Loading...</p>}
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <EmployeeTable employees={employees} onEdit={handleEdit} onDelete={handleDelete} />
      </ContentContainer>
    </FullScreenContainer>
  );
};

export default Dashboard;
