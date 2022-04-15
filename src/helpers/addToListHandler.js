import { dispatchSuccessHandler } from "./dispatchHandlers";
import { movies } from "./library";
import typedefs from "../components/MovieModal/typedefs";

/**
 * @param {} Moralis Moralis Instance
 * @param  {} account Moralis account instance
 * @param  {typedefs.Movies} selectedFilm
 * @param  {} dispatch Notification hook
 * @returns {typedefs.Movies}
 */
export const addToListHandler = async (
  Moralis,
  account,
  selectedFilm,
  dispatch
) => {
  await Moralis.Cloud.run("updateMyList", {
    addrs: account,
    newMovie: selectedFilm.Name,
  });

  const movieObj = movies.find((movie) => movie.Name === selectedFilm.Name);

  dispatchSuccessHandler(dispatch);

  return movieObj;
};
