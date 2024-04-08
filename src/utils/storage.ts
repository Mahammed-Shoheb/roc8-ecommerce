type data = {
  name: string;
  email: string;
  verified: Boolean;
};

export const wrtieToStorage = (key: string, data: data) => {
  localStorage.setItem(key, JSON.stringify(data));
};
export const readFromStorage = (key: string) => {
  const data = localStorage.getItem(key);
  localStorage.getItem;
  if (!data) return data;
  return JSON.parse(data);
};
