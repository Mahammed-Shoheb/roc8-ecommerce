export type data = {
  name: string;
  email: string;
  verified: boolean;
};

export const wrtieToStorage = (key: string, data: data): void => {
  localStorage.setItem(key, JSON.stringify(data));
};
export const readFromStorage = (key: string): data => {
  const data = localStorage.getItem(key);
  if (!data) return { name: "", email: "", verified: false } as data;
  return JSON.parse(data) as data;
};
