import React, { Fragment, useState, useCallback, useEffect } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

const Game = () => {
  const { addEventListener, removeEventListener } = useUnityContext();
  const [data, setData] = useState();

  const { unityProvider, sendMessage } = useUnityContext({
    loaderUrl: "/unity/Builds.loader.js",
    dataUrl: "/unity/Builds.data",
    frameworkUrl: "/unity/Builds.framework.js",
    codeUrl: "/unity/Builds.wasm",
  });

  function sendDataToUnity(data) {
    var numToString = '' + data;
    sendMessage("Manager", "addItemToCart", numToString);
  }

  function checkoutCustomers() {
    var numToString = '' + 0;
    sendMessage("Manager", "ReceiveData", numToString);
  }
  
   const handleSetData = useCallback((data) => {
      setData(data);
    }, []);

  useEffect(() => {
    addEventListener("SendData", handleSetData);
    return () =>{
      removeEventListener("SendData", handleSetData);;
    };
  }, [addEventListener, removeEventListener, handleSetData]);


  return (
    //Hides the ticket on the side
    //Also centers all content
    <div style={{ position: 'relative' }}>
      <div
      style={{
        position: 'absolute',
        backgroundColor: 'rgba(255, 255, 255, 1)',
        width: '100vw',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
      }}
      > 
    </div>

    <div
      style={{
        position: 'absolute',
        top: '25%',
        left: '25%',
        backgroundColor: 'rgba(255, 255, 255, 1)',
        width: '70vw',
        height: '85vh',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
      }}
    > 
      <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button onClick={() => sendDataToUnity(0)}>Hot Dog</button>
          <button onClick={() => sendDataToUnity(1)}>Hamburger</button>
          <button onClick={() => sendDataToUnity(2)}>Pizza</button>
          <button onClick={() => sendDataToUnity(3)}>Chicken</button>
          <button onClick={() => sendDataToUnity(4)}>Fish</button>
          <button onClick={() => sendDataToUnity(5)}>Fry</button>
      </div>
      <Unity unityProvider={unityProvider} style={{ width: "100%" }} />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button onClick={() => checkoutCustomers(data)}>Checkout Customers</button>
      </div>

      </div>
    </div>

  );
};

export default Game;