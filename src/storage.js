export const loadFromStore = () => {
  try {
    const pages = localStorage.getItem("watchPages");
    if (pages) {
      return JSON.parse(pages);
    }
  } catch(e) {
    return [];
  }
};

export const saveToStore = (watchPages) => {
  localStorage.setItem("watchPages", JSON.stringify(watchPages));
};

