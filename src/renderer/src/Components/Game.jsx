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

  function sendZeroToUnity() {
    var numToString = '' + 0;
    sendMessage("Manager", "ReceiveData", numToString);
  }

  function sendOneToUnity() {
    var numToString = '' + 1;
    sendMessage("Manager", "ReceiveData", numToString);
  }

  function sendTwoToUnity() {
    var numToString = '' + 2;
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
    <div>
        <button onClick={sendZeroToUnity}>Hamburger</button>
        <button onClick={sendOneToUnity}>Pizza</button>
        <button onClick={sendTwoToUnity}>Hotdog</button>
        <Unity unityProvider={unityProvider} style={{ width: "100%" }} />
        <p>{`Data: ${data}!`}</p>
    </div>
    );
};

export default Game;