import React from "react";
import ReactUnityWebGL from 'react-unity-webgl';

const UnityComponent = () => {
  return (
    <div>
      {/* Other React components or content */}
      <ReactUnityWebGL
        src="../../../game/index.html"
        width="800"
        height="600"
      />
    </div>
  );
};

export default UnityComponent;
