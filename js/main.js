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
  // Create the editor with sample JSON
  const editorDiv = document.getElementById("editor");
  var editor = monaco.editor.create(editorDiv, {
    value: await fetch('../assets/json/example.json').then(response => response.text()),
    language: "json",
    scrollBeyondLastLine: false
  });

  // Fit the editor to its content, including its container's border.
  function resizeEditor() {
    const height = editor.getContentHeight();
    const borderHeight = editorDiv.offsetHeight - editorDiv.clientHeight;
    editorDiv.style.height = `${height + borderHeight}px`;
    editor.layout({
      width: editorDiv.clientWidth,
      height
    });
  }
  editor.onDidContentSizeChange(resizeEditor);
  window.addEventListener("resize", resizeEditor);
  resizeEditor();
});
