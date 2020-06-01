export const loadFromStore = () => {
  const pages = localStorage.getItem("watchPages");
  if (pages) {
    return JSON.parse(pages);
  }
  return [];
};

export const saveToStore = (watchPages) => {
  localStorage.setItem("watchPages", JSON.stringify(watchPages));
};

