interface CustomWindow extends Window {
  electronAPI: any;
}

declare var window: CustomWindow;

export const sendSQL = async (command: string) => {
  const response = await window.electronAPI.sendSQL(command);
  return response;
};

export const insertSQL = async (command: string) => {
  const response = await window.electronAPI.insertSQL(command);
  return response;
};
