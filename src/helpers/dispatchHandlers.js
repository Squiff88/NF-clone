export const dispatchLoginHandler = (dispatch) =>
  dispatch({
    type: "error",
    message: "Please log into your crypto wallet",
    title: "Not authenticated",
    position: "topL",
  });

export const dispatchSuccessHandler = (dispatch) =>
  dispatch({
    type: "success",
    message: "This movie was added to your list.",
    title: "Success",
    position: "topL",
  });

export const dispatchDeleteMovieHandler = (dispatch) =>
  dispatch({
    type: "success",
    message: "This movie was removed successfully from your list.",
    title: "Success",
    position: "topL",
  });
