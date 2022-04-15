import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  ConnectButton,
  Icon,
  Tab,
  TabList,
  useNotification,
} from "web3uikit";
import { Logo } from "../images/Netflix";
import { movies } from "../helpers/library";
import "./Home.css";
import { useMoralis } from "react-moralis";
import { appId, serverUrl } from "../config";
import { dispatchLoginHandler } from "../helpers/dispatchHandlers";
import { addToListHandler } from "../helpers/addToListHandler";
import MovieModal from "../components/MovieModal/MovieModal";
import { removeFromListHandler } from "../helpers/removeFromListHandler";

const Home = () => {
  const [visible, setVisible] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState();
  const [myMovies, setMyMovies] = useState([]);

  const { isAuthenticated, Moralis, account } = useMoralis();
  const dispatch = useNotification();

  useEffect(() => {
    Moralis.start({ serverUrl, appId });

    const fetchMyList = async () => {
      const myList = await Moralis.Cloud.run("getMyList", { addrs: account });

      const filteredArr = movies.filter((movie) => {
        return myList.indexOf(movie.Name) > -1;
      });

      setMyMovies(filteredArr);
    };
    fetchMyList();
  }, [Moralis, account]);

  return (
    <>
      <div className="logo">
        <Logo />
      </div>
      <div className="connect">
        <Icon size={24} fill="#ffffff" svg="bell" />
        <ConnectButton />
      </div>
      <div className="topBanner">
        <TabList>
          <Tab tabKey={1} tabName="Movies">
            <div className="scene">
              <img
                src={movies[0].Scene}
                className="sceneImg"
                alt="scene-background"
              />
              <img className="sceneLogo" src={movies[0].Logo} alt="Logo" />
              <p className="sceneDesc">{movies[0].Description}</p>
              <div className="playButton">
                <Link
                  to={isAuthenticated ? "/player" : "/"}
                  state={selectedFilm ? selectedFilm.Movie : movies[4].Movie}
                >
                  <Button
                    icon="chevronRightX2"
                    text="Play"
                    theme="secondary"
                    type="button"
                    onClick={
                      !isAuthenticated
                        ? () => dispatchLoginHandler(dispatch)
                        : null
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
                      selectedFilm ?? movies[0],
                      dispatch
                    );

                    setMyMovies([...myMovies, generateMovieObject]);
                  }}
                />
              </div>
            </div>

            <div className="title">Movies</div>
            <div className="thumbs">
              {movies &&
                movies.map((movie) => {
                  return (
                    <img
                      key={`${movie.Name}_${movie.Thumnbnail}`}
                      className="thumbnail"
                      src={movie.Thumnbnail}
                      alt={movie.Description}
                      onClick={() => {
                        setVisible(!visible);
                        setSelectedFilm(movie);
                      }}
                    />
                  );
                })}
            </div>
          </Tab>
          <Tab tabKey={2} tabName="Series" isDisabled></Tab>
          <Tab tabKey={3} tabName="MyList">
            <div className="ownListContent">
              <div className="title">Your Library</div>
              {myMovies.length > 0 && isAuthenticated ? (
                <div className="ownThumbs">
                  {myMovies.map((ownMovie) => {
                    return (
                      <div
                        key={`${ownMovie.Name}_${ownMovie.Thumnbnail}`}
                        className="movieListWrapper"
                      >
                        <img
                          className="thumbnail"
                          src={ownMovie.Thumnbnail}
                          alt={ownMovie.Description}
                          onClick={() => {
                            setVisible(!visible);
                            setSelectedFilm(ownMovie);
                          }}
                        />
                        <div className="deleteButtonWrapper">
                          <Button
                            type="button"
                            id="deleteBtn"
                            icon="bin"
                            iconLayout="icon-only"
                            size="small"
                            theme="primary"
                            onClick={async () => {
                              const filterOutMovie = myMovies.filter(
                                (movie) => movie.Name !== ownMovie.Name
                              );

                              removeFromListHandler(
                                Moralis,
                                account,
                                ownMovie,
                                dispatch
                              );

                              setMyMovies(filterOutMovie);
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="ownThumbs">You need to Authenticate</div>
              )}
            </div>
          </Tab>
        </TabList>
        {selectedFilm && (
          <MovieModal
            selectedFilm={selectedFilm}
            visible={visible}
            setVisible={setVisible}
            myMovies={myMovies}
            setMyMovies={setMyMovies}
          />
        )}
      </div>
    </>
  );
};

export default Home;
