const getThemeStatus = () => {
  if (typeof window !== 'undefined') {
    // Perform localStorage action
    return localStorage.getItem("theme")
  }
};

const initialState = {
  theme: 'dark'
};

const themeReducers = (state = initialState, action) => {
  switch (action.type) {
    case "CHANGE_THEME":
      localStorage.setItem("theme", action.payload);

      return {
        ...state,
        theme: action.payload,
      };
    default:
      return state;
  }
};

export default themeReducers;
