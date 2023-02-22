import React, { useEffect, useRef } from 'react';
import { Unity, useUnityContext } from 'react-unity-webgl';
import Router from 'next/router';

export default function Game() {
  const iframeRef = useRef();
  const unityFrameRef = useRef();

  const { unityProvider } = useUnityContext({
    loaderUrl: '/unity/Build/Build.loader.js',
    dataUrl: '/unity/Build/Build.data',
    frameworkUrl: '/unity/Build/Build.framework.js',
    codeUrl: '/unity/Build/Build.wasm',
  });

  // on router change event, clear iframe
  useEffect(() => {
    const handleRouteChange = () => {
      if (iframeRef !== null) {
        iframeRef.current.removeChild(iframeRef.current.children[0]);
      }
    };
    Router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      Router.events.off('routeChangeStart', handleRouteChange);
    };
  }, []);

  return (
    <div className="h-full w-full m-0" id="iframeContainer" ref={iframeRef}>
      <Unity className="h-96 w-96" unityProvider={unityProvider} ref={unityFrameRef} />
    </div>
  );
}
