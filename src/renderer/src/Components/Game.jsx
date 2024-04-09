import React, { Fragment, useState, useCallback, useEffect } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import "./Game.scss";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const Game = () => {
  const { addEventListener, removeEventListener } = useUnityContext();
  const [data, setData] = useState();
  const [recData, recSetData] = useState();

  const { unityProvider, sendMessage } = useUnityContext({
    loaderUrl: "/unity/Builds.loader.js",
    dataUrl: "/unity/Builds.data",
    frameworkUrl: "/unity/Builds.framework.js",
    codeUrl: "/unity/Builds.wasm",
  });

  function sendDataToUnity(data) {
    var numToString = "" + data;
    if (recData == 0) sendMessage("Manager", "addItemToCart", numToString);
  }

  function checkoutCustomers() {
    var numToString = "" + 0;
    if (recData == 0) sendMessage("Manager", "ReceiveData", numToString);
  }

  const handleSetData = useCallback((data) => {
    setData(data);
  }, []);

  const handleRecData = useCallback((recData) => {
    recSetData(recData);
  }, []);

  useEffect(() => {
    addEventListener("SendData", handleRecData);
    return () => {
      removeEventListener("SendData", handleRecData);
    };
  }, [addEventListener, removeEventListener, handleRecData]);

  return (
    //Hides the ticket on the side
    //Also centers all content
    <div>
      <div style={{ padding: "10px" }}>
        <Container className="buttons-container">
          <Row className="grid-row">
            <Col className="grid-col">
              <button className="button" onClick={() => sendDataToUnity(0)}>
                Hot Dog
              </button>
            </Col>
            <Col className="grid-col">
              <button className="button" onClick={() => sendDataToUnity(1)}>
                Hamburger
              </button>
            </Col>
            <Col className="grid-col">
              <button className="button" onClick={() => sendDataToUnity(2)}>
                Pizza
              </button>
            </Col>
            <Col className="grid-col">
              <button className="button" onClick={() => sendDataToUnity(3)}>
                Chicken
              </button>
            </Col>
            <Col className="grid-col">
              <button className="button" onClick={() => sendDataToUnity(4)}>
                Fish
              </button>
            </Col>
            <Col className="grid-col">
              <button className="button" onClick={() => sendDataToUnity(5)}>
                Fry
              </button>
            </Col>
          </Row>
        </Container>

        <Unity unityProvider={unityProvider} style={{ width: "100%" }} />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button onClick={() => checkoutCustomers(data)}>
            Checkout Customers
          </button>
        </div>
      </div>
    </div>
  );
};

export default Game;
