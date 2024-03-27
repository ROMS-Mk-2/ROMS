mergeInto(LibraryManager.library, {
  SendData: function (data) {
    window.dispatchReactUnityEvent("SendData", UTF8ToString(data);
  },
});