import React, { Fragment } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

const Game = () => {
  const { unityProvider, sendMessage } = useUnityContext({
    loaderUrl: "/unity/Build.loader.js",
    dataUrl: "/unity/Build.data",
    frameworkUrl: "/unity/Build.framework.js",
    codeUrl: "/unity/Build.wasm",
  });

  const randomNumberInRange = (min, max) => {
    return Math.floor(Math.random()
        * (max - min + 1)) + min;
};

  function sendDataToUnity() {
    var num = (randomNumberInRange(1, 100));
    var numToString = '' + num;
    sendMessage("EventHandler", "ReceiveData", numToString);
  }
  
  return (
    <div>
        <button onClick={sendDataToUnity}>Send Text to Unity</button>
        <Unity unityProvider={unityProvider} style={{ width: "100%" }} />
    </div>
    );
};

export default Game;