import React, { useState, useEffect } from "react";
import { Button, Container, Row, Col, Form } from "react-bootstrap";
import { PlusSquare, Trash, PencilSquare } from "react-bootstrap-icons";

import "./EmployeeManagement.scss";
import { sendSQL } from "../Utilities/SQLFunctions";

const EmployeeListItem = ({
  pin,
  first_name,
  last_name,
  authority_level,
  setCheckedEmployees,
}) => {
  const [checked, setChecked] = useState(false);

  const handleCheckChange = (event) => {
    event.stopPropagation();
    const newCheckedState = !checked;
    setChecked(newCheckedState);
    updateCheckedEmployees(newCheckedState, pin);
  };

  const handleRowClick = (event) => {
    const newCheckedState = !checked;
    setChecked(newCheckedState);
    updateCheckedEmployees(newCheckedState, pin);
  };

  const updateCheckedEmployees = (isChecked, pin) => {
    if (isChecked) {
      setCheckedEmployees((prev) => [...prev, pin]);
    } else {
      setCheckedEmployees((prev) =>
        prev.filter((employeePin) => employeePin !== pin)
      );
    }
  };
  return (
    <Row className="employee-item">
      <Col className="employee-col" xs={1}>
        <Form.Check
          type="checkbox"
          checked={checked}
          onChange={handleCheckChange}
        />
      </Col>
      <Col className="employee-col">{pin}</Col>
      <Col className="employee-col">{first_name}</Col>
      <Col className="employee-col">{last_name}</Col>
      <Col className="employee-col">{authority_level}</Col>
    </Row>
  );
};

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [checkedEmployees, setCheckedEmployees] = useState([]);

  useEffect(() => {
    getEmployees();
  }, []);

  useEffect(() => {
    console.log(checkedEmployees);
  }, [checkedEmployees]);

  const getEmployees = async () => {
    const response = await sendSQL("SELECT * FROM employees ORDER BY pin");
    setEmployees(response);
  };

  return (
    <Container className="employee-management-container">
      <Row className="employee-list-header">
        <Col className="list-header-item" xs={1}></Col>
        <Col className="list-header-item">PIN</Col>
        <Col className="list-header-item">First Name</Col>
        <Col className="list-header-item">Last Name</Col>
        <Col className="list-header-item">Authority</Col>
      </Row>
      {employees.map((employee) => (
        <EmployeeListItem
          key={employee.pin}
          pin={employee.pin}
          first_name={employee.first_name}
          last_name={employee.last_name}
          authority_level={employee.authority_level}
          checkedEmployees={checkedEmployees}
          setCheckedEmployees={setCheckedEmployees}
        />
      ))}
      <div className="employee-button-container">
        <div className="employee-button-group">
          {checkedEmployees.length === 0 && (
            <Button className="icon-button">
              <PlusSquare size={16} />
              Add Employee
            </Button>
          )}

          {checkedEmployees.length === 1 && (
            <Button className="icon-button">
              <PencilSquare size={16} />
              Edit Employee
            </Button>
          )}

          {checkedEmployees.length > 0 && (
            <Button className="icon-button" variant="danger">
              <Trash size={16} />
              Delete Employee{checkedEmployees.length > 1 && `s`}
            </Button>
          )}
        </div>
      </div>
    </Container>
  );
};

export default EmployeeManagement;
