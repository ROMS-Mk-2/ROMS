import React, { Fragment } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

const Game = () => {
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
  
  return (
    <div>
        <button onClick={sendZeroToUnity}>Hamburger</button>
        <button onClick={sendOneToUnity}>Pizza</button>
        <button onClick={sendTwoToUnity}>Hotdog</button>
        <Unity unityProvider={unityProvider} style={{ width: "100%" }} />
    </div>
    );
};

export default Game;