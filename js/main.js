// Proxy Monaco Editor workers using a data URL (adapted from: https://github.com/microsoft/monaco-editor/blob/main/docs/integrate-amd-cross.md)
require.config(
  { paths: { "vs": "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.29.1/min/vs/" } }
);

window.MonacoEnvironment = {
  getWorkerUrl: function (workerId, label) {
    return `data:text/javascript;charset=utf-8,${
      encodeURIComponent(
        `self.MonacoEnvironment = {
          baseUrl: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.29.1/min/"
        };
        importScripts(
          "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.29.1/min/vs/base/worker/workerMain.min.js"
        );`
      )
    }`;
  }
};

require(["vs/editor/editor.main"], async function () {
  // Create the editor with some sample JavaScript code
  const editorDiv = document.getElementById("editor");
  var editor = monaco.editor.create(editorDiv, {
    value: await fetch('../assets/json/example.json').then(response => response.text()),
    language: "json"
  });

  // Resize the editor when the window size changes
  function resizeEditor() {
    editor.layout({
      width: editorDiv.offsetWidth,
      height: editorDiv.offsetHeight
    })
  }
  window.addEventListener("resize", resizeEditor);
});