import { dispatchDeleteMovieHandler } from "./dispatchHandlers";
import typedefs from "../components/MovieModal/typedefs";

/**
 * @param {} Moralis Moralis Instance
 * @param  {} account Moralis account instance
 * @param  {typedefs.Movies} selectedFilm
 * @param  {} dispatch Notification hook
 * @returns {typedefs.Movies}
 */
export const removeFromListHandler = async (
  Moralis,
  account,
  removeFilm,
  dispatch
) => {
  await Moralis.Cloud.run("deleteMyList", {
    addrs: account,
    deleteMovie: removeFilm.Name,
  });

  dispatchDeleteMovieHandler(dispatch);
};
