import React, {
  Fragment,
  useState,
  useCallback,
  useEffect,
  useContext,
} from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import "./Game.scss";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { SimContext } from "../Utilities/SimContext";

const Game = () => {
  const { addEventListener, removeEventListener } = useUnityContext();
  const [data, setData] = useState();
  const [recData, recSetData] = useState();
  const { simItems, setSimItems, simCheckoutFn, setSimCheckoutFn } =
    useContext(SimContext);

  const { unityProvider, sendMessage } = useUnityContext({
    loaderUrl: "./unity/Builds.loader.js",
    dataUrl: "./unity/Builds.data",
    frameworkUrl: "./unity/Builds.framework.js",
    codeUrl: "./unity/Builds.wasm",
  });

  useEffect(() => {
    setSimCheckoutFn(() => () => checkoutCustomers());
  }, []);

  function sendDataToUnity(data) {
    var numToString = "" + data;
    if (recData == 0) sendMessage("Manager", "addItemToCart", numToString);

    if (data === 0) setSimItems((prev) => [...prev, "Hot Dog"]);
    else if (data === 1) setSimItems((prev) => [...prev, "Hamburger"]);
    else if (data === 2) setSimItems((prev) => [...prev, "Pizza"]);
    else if (data === 3) setSimItems((prev) => [...prev, "Chicken"]);
    else if (data === 4) setSimItems((prev) => [...prev, "Fish"]);
    else if (data === 5) setSimItems((prev) => [...prev, "Fries"]);
  }

  function checkoutCustomers() {
    var numToString = "" + 0;
    if (recData == 0) sendMessage("Manager", "ReceiveData", numToString);

    setSimItems([]);
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
                Fries
              </button>
            </Col>
          </Row>
        </Container>

        <Unity unityProvider={unityProvider} style={{ width: "100%" }} />
        {/* <div style={{ display: "flex", justifyContent: "center" }}>
          <button onClick={() => checkoutCustomers(data)}>
            Checkout Customers
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default Game;
