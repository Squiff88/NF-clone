import { useMoralis } from "react-moralis";
import { Link } from "react-router-dom";
import { Button, Modal, useNotification } from "web3uikit";
import { addToListHandler } from "../../helpers/addToListHandler";
import { dispatchLoginHandler } from "../../helpers/dispatchHandlers";
import { movies } from "../../helpers/library";
import typedefs from "./typedefs";

/**
 * @param  {typedefs.Movies} selectedFilm
 * @param  {boolean} visible
 * @param  {(boolean) => void} setVisible
 * @param  {Array<typedefs.Movies>} myMovies
 * @param  {[ (Array<typedefs.Movies>) => void ]} setMyMovies
 * @returns JSX.Element
 *
 */

const MovieModal = ({
  selectedFilm,
  visible,
  setVisible,
  myMovies,
  setMyMovies,
}) => {
  const { isAuthenticated, Moralis, account } = useMoralis();
  const dispatch = useNotification();

  const defaultData = movies[4];

  return (
    <div className="modal">
      <Modal
        onCloseButtonPressed={() => setVisible(false)}
        isVisible={visible}
        hasFooter={false}
        width="1000px"
      >
        <div className="modalContent">
          <img
            src={selectedFilm.Scene ?? defaultData.Scene}
            className="modalImg"
            alt="modal-background"
          />
          <img
            className="modalLogo"
            src={selectedFilm.Logo ?? defaultData.Logo}
            alt="Logo"
          />
          <div className="modalPlayButton">
            <Link
              to={isAuthenticated ? "/player" : "/"}
              state={selectedFilm.Movie ?? defaultData.Movie}
            >
              <Button
                icon="chevronRightX2"
                text="Play"
                theme="secondary"
                type="button"
                onClick={
                  !isAuthenticated ? () => dispatchLoginHandler(dispatch) : null
                }
              />
            </Link>

            <Button
              icon="plus"
              text="Add to My list"
              theme="translucent"
              type="button"
              onClick={async () => {
                const generateMovieObject = await addToListHandler(
                  Moralis,
                  account,
                  selectedFilm,
                  dispatch
                );

                setMyMovies([...myMovies, generateMovieObject]);
              }}
            />
          </div>
          <div className="movieInfo">
            <div className="description">
              <div className="details">
                <span>{selectedFilm.Year ?? defaultData.Year}</span>
                <span>{selectedFilm.Duration ?? defaultData.Duration}</span>
              </div>
              {selectedFilm.Description ?? defaultData.Description}
            </div>
            <div className="detailedInfo">
              Genre:
              <span className="deets">
                {selectedFilm.Genre ?? defaultData.Genre}
              </span>
              <br />
              Actors:
              <span className="deets">
                {selectedFilm.Actors ?? defaultData.Actors}
              </span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MovieModal;
