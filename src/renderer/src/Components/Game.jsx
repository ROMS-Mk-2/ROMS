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
    //This is hacky and messy, I think, but it works to hide the ticket on the side, if we need it.
    //Also centers all content
    //Please let me know if there is a better way
    //I am sorry lol
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
          <button onClick={sendZeroToUnity}>Hamburger</button>
          <button onClick={sendOneToUnity}>Pizza</button>
          <button onClick={sendTwoToUnity}>Hotdog</button>
      </div>
      <Unity unityProvider={unityProvider} style={{ width: "100%" }} />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
          <p>{`Data: ${data}!`}</p>
      </div>
          
      </div>
    </div>

  );
};

export default Game;