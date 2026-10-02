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
    value: await fetch('./assets/json/example.json').then(response => response.text()),
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

  editor.getModel().onDidChangeContent(() => previewResult(editor.getValue()));
  previewResult(editor.getValue());
});

// Preview of JSON HTML
function previewResult(jsonString) {
  const output = document.getElementById("output");
  try {
    const object = JSON.parse(jsonString);
    output.replaceChildren(render(object));
  } catch (error) {
    const errorDiv = document.createElement("div");
    errorDiv.classList.add(
      "p-3", "text-danger-emphasis", "bg-danger-subtle", "border", "border-danger-subtle",
      "rounded-3"
    );
    errorDiv.replaceChildren(error)
    output.replaceChildren(errorDiv);
  }
}

function render(input) {
  const isObject = value => typeof value === 'object' && value !== null && !Array.isArray(value);
  if (isObject(input)) {
    return renderObject(input);
  } else {
    return input;
  }
}

function renderObject(object) {
  const result = document.createElement(object.tag);
  if (Object.hasOwn(object, "attrs")) {
    Object.entries(object.attrs).forEach(
      ([key, value]) => {
        result.setAttribute(key, value);
      }
    );
  }
  if (Object.hasOwn(object, "children")) {
    result.replaceChildren(...object.children.map(child => render(child)));
  }
  return result;
}
