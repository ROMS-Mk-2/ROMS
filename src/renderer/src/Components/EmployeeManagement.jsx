import React, { useState, useEffect } from "react";
import { Button, Container, Row, Col, Form, Modal } from "react-bootstrap";
import { PlusSquare, Trash, PencilSquare } from "react-bootstrap-icons";
import { connect } from "react-redux";

import "./EmployeeManagement.scss";
import { insertSQL, sendSQL } from "../Utilities/SQLFunctions";

const EmployeeListItem = ({
  pin,
  first_name,
  last_name,
  authority_level,
  checkedEmployees,
  setCheckedEmployees,
  disableCheck,
}) => {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!checkedEmployees.includes(pin)) {
      setChecked(false);
    }
  }, [checkedEmployees]);

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
          disabled={disableCheck}
        />
      </Col>
      <Col className="employee-col">{pin}</Col>
      <Col className="employee-col">{first_name}</Col>
      <Col className="employee-col">{last_name}</Col>
      <Col className="employee-col">{authority_level}</Col>
    </Row>
  );
};

const EmployeeModal = ({
  show,
  setShow,
  setCheckedEmployees,
  isEditting,
  editUser,
}) => {
  const [user, setUser] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    pin: "",
    firstName: "",
    lastName: "",
    authorityLevel: null,
  });
  const [validation, setValidation] = useState({
    pin: { invalid: false, msg: "" },
    firstName: { invalid: false, msg: "" },
    lastName: { invalid: false, msg: "" },
    authorityLevel: { invalid: false, msg: "" },
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    sendSQL(`SELECT * FROM employees WHERE pin='${editUser}'`).then(
      (response) => {
        if (response.length > 0) {
          console.log(response);
          const employee = response[0];
          setUser(employee);
          setNewEmployee({
            pin: employee.pin,
            firstName: employee.first_name,
            lastName: employee.last_name,
            authorityLevel: employee.authority_level,
          });
        } else {
          setUser(null);
          setNewEmployee({
            pin: "",
            firstName: "",
            lastName: "",
            authorityLevel: null,
          });
        }
      }
    );
  }, [editUser]);

  const clearValidation = () => {
    setValidation({
      pin: { invalid: false, msg: "" },
      firstName: { invalid: false, msg: "" },
      lastName: { invalid: false, msg: "" },
      authorityLevel: { invalid: false, msg: "" },
    });
  };

  const handleAddEmployee = async (event) => {
    setFormSubmitted(true);
    if (
      newEmployee.pin.length === 4 &&
      newEmployee.firstName.length > 0 &&
      newEmployee.lastName.length > 0 &&
      !isNaN(newEmployee.authorityLevel) &&
      newEmployee.authorityLevel
    ) {
      clearValidation();

      const employees = await sendSQL(
        `SELECT pin FROM employees WHERE pin='${newEmployee.pin}'`
      );
      const employeeExist = (await employees.length) > 0;

      let oldPin = undefined;
      if (isEditting) {
        oldPin = employees[0].pin;
      }

      const insertSQLCommand = `INSERT INTO employees (pin, first_name, last_name, authority_level) VALUES('${newEmployee.pin}', '${newEmployee.firstName}', '${newEmployee.lastName}', ${newEmployee.authorityLevel})`;
      const updateSQLCommand = `UPDATE employees SET pin='${newEmployee.pin}', first_name='${newEmployee.firstName}', last_name='${newEmployee.lastName}', authority_level=${newEmployee.authorityLevel} WHERE pin='${oldPin}'`;

      if (employeeExist && !isEditting) {
        setValidation({
          ...validation,
          pin: { invalid: true, msg: "PIN already exist." },
        });
      } else {
        if (isEditting) {
          const response = await sendSQL(updateSQLCommand);
          console.log(response);
        } else {
          const response = await insertSQL(insertSQLCommand);
          console.log(response);
        }
        setShow({ show: false, isEdit: false });
        setCheckedEmployees([]);
      }
    } else {
      let newValidation = { ...validation };
      if (newEmployee.pin.length !== 4) {
        newValidation = {
          ...newValidation,
          pin: { invalid: true, msg: "PIN has to be 4 digits." },
        };
      } else {
        newValidation = {
          ...newValidation,
          pin: { invalid: false, msg: "" },
        };
      }
      if (newEmployee.firstName.length === 0) {
        newValidation = {
          ...newValidation,
          firstName: { invalid: true, msg: "There must be a first name." },
        };
      } else {
        newValidation = {
          ...newValidation,
          firstName: { invalid: false, msg: "" },
        };
      }
      if (newEmployee.lastName.length === 0) {
        newValidation = {
          ...newValidation,
          lastName: { invalid: true, msg: "There must be a last name." },
        };
      } else {
        newValidation = {
          ...newValidation,
          lastName: { invalid: false, msg: "" },
        };
      }
      if (isNaN(newEmployee.authorityLevel) || !newEmployee.authorityLevel) {
        newValidation = {
          ...newValidation,
          authorityLevel: {
            invalid: true,
            msg: "Please select an authority level.",
          },
        };
      } else {
        newValidation = {
          ...newValidation,
          authorityLevel: { invalid: false, msg: "" },
        };
      }
      setValidation(newValidation);
    }
  };

  const handleDeleteEmployee = async (event) => {
    const response = await insertSQL(
      `DELETE FROM employees WHERE pin='${editUser}'`
    );
    setShow({ show: false, inEdit: false });
    setCheckedEmployees([]);
    return response;
  };

  return (
    <Modal
      show={show}
      onHide={() => {
        setShow((prev) => ({ show: false, inEdit: false }));
        setNewEmployee({
          pin: "",
          firstName: "",
          lastName: "",
          authorityLevel: null,
        });
        setCheckedEmployees([]);
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Add Employee</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate>
          <Form.Group>
            <Form.Label className="required">PIN</Form.Label>
            <Form.Control
              type="number"
              placeholder="0000"
              defaultValue={isEditting ? `${user.pin}` : ""}
              isInvalid={formSubmitted && validation.pin.invalid}
              required
              onChange={(event) =>
                setNewEmployee({ ...newEmployee, pin: event.target.value })
              }
            />
            <Form.Control.Feedback type="invalid">
              {validation.pin.msg}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group>
            <Form.Label className="required">First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="John"
              defaultValue={isEditting ? `${user.first_name}` : ""}
              isInvalid={formSubmitted && validation.firstName.invalid}
              required
              onChange={(event) =>
                setNewEmployee({
                  ...newEmployee,
                  firstName: event.target.value,
                })
              }
            />

            <Form.Control.Feedback type="invalid">
              {validation.firstName.msg}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group>
            <Form.Label className="required">Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Doe"
              defaultValue={isEditting ? `${user.last_name}` : ""}
              isInvalid={formSubmitted && validation.lastName.invalid}
              required
              onChange={(event) =>
                setNewEmployee({ ...newEmployee, lastName: event.target.value })
              }
            />
            <Form.Control.Feedback type="invalid">
              {validation.lastName.msg}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label className="required">Authority Level</Form.Label>
            <Form.Select
              defaultValue={isEditting ? user.authority_level : "Please select"}
              isInvalid={formSubmitted && validation.authorityLevel.invalid}
              required
              onChange={(event) =>
                setNewEmployee({
                  ...newEmployee,
                  authorityLevel: event.target.value,
                })
              }
            >
              <option>Please select</option>
              <option value="1">Staff</option>
              <option value="2">Manager</option>
              <option value="3">Owner</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {validation.authorityLevel.msg}
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {isEditting && (
          <Button variant="danger" onClick={handleDeleteEmployee}>
            Delete
          </Button>
        )}
        <Button onClick={handleAddEmployee}>Ok</Button>
      </Modal.Footer>
    </Modal>
  );
};

const EmployeeManagement = ({ user }) => {
  const [employees, setEmployees] = useState([]);
  const [checkedEmployees, setCheckedEmployees] = useState([]);
  const [showModal, setShowModal] = useState({ show: false, isEdit: false });

  useEffect(() => {
    getEmployees();
  }, []);

  useEffect(() => {
    getEmployees();
  }, [showModal]);

  console.log(showModal);
  useEffect(() => {
    console.log(checkedEmployees.map((employee) => `'${employee}'`).join(","));
  }, [checkedEmployees]);

  const getEmployees = async () => {
    const response = await sendSQL("SELECT * FROM employees ORDER BY pin");
    setEmployees(response);
  };

  const deleteEmployees = async () => {
    const response = await insertSQL(
      `DELETE FROM employees WHERE pin IN (${checkedEmployees
        .map((employee) => `'${employee}'`)
        .join(",")})`
    );
    console.log(await response);
    setEmployees(
      employees.filter((employee) => !checkedEmployees.includes(employee.pin))
    );
    setCheckedEmployees([]);
  };

  return (
    <Container className="employee-management-container">
      <EmployeeModal
        show={showModal.show}
        setShow={setShowModal}
        setCheckedEmployees={setCheckedEmployees}
        isEditting={showModal.isEdit}
        editUser={checkedEmployees.length === 1 && checkedEmployees[0]}
      />
      <Row className="employee-list-header">
        <Col className="list-header-item" xs={1}></Col>
        <Col className="list-header-item">PIN</Col>
        <Col className="list-header-item">First Name</Col>
        <Col className="list-header-item">Last Name</Col>
        <Col className="list-header-item">Authority</Col>
      </Row>
      {employees.map((employee) => {
        console.log(
          `${user.authority_level} <= ${employee.authority_level} ${
            user.authority_level <= employee.authority_level
          }`
        );
        return (
          <EmployeeListItem
            key={employee.pin}
            pin={employee.pin}
            first_name={employee.first_name}
            last_name={employee.last_name}
            authority_level={employee.authority_level}
            checkedEmployees={checkedEmployees}
            setCheckedEmployees={setCheckedEmployees}
            disableCheck={
              user.pin === employee.pin ||
              user.authority_level <= employee.authority_level
            }
          />
        );
      })}
      <div className="employee-button-container">
        <div className="employee-button-group">
          {checkedEmployees.length === 0 && (
            <Button
              className="icon-button"
              onClick={() => setShowModal((prev) => ({ ...prev, show: true }))}
            >
              <PlusSquare size={16} />
              Add Employee
            </Button>
          )}

          {checkedEmployees.length === 1 && (
            <Button
              className="icon-button"
              onClick={() => setShowModal({ show: true, isEdit: true })}
            >
              <PencilSquare size={16} />
              Edit Employee
            </Button>
          )}

          {checkedEmployees.length > 0 && (
            <Button
              className="icon-button"
              variant="danger"
              onClick={deleteEmployees}
            >
              <Trash size={16} />
              Delete Employee{checkedEmployees.length > 1 && `s`}
            </Button>
          )}
        </div>
      </div>
    </Container>
  );
};

const mapStateToProps = (state) => {
  return { user: state.auth.user };
};

export default connect(mapStateToProps)(EmployeeManagement);
