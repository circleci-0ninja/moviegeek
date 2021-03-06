import React, { useReducer, useEffect } from "react";
import "./App.css";
import Header from "../header/Header";
import Movie from "../movie/Movie";
import spinner from "../../ajax-loader.gif";
import Search from "../search/Search";

const MOVIE_API_URL = "http://localhost:3001";

const initialState = {
  loading: true,
  movies: [],
  errorMessage: null
};
//For complex logic, use reducer instead useState. It optimizes
//performance for components that trigger deep updates
//because you can pass dispatch down instead of callbacks
const reducer = (state, action) => {
  switch (action.type) {
    case "SEARCH_MOVIES_REQUEST":
      return {
        ...state,
        loading: true,
        errorMessage: null
      };
    case "SEARCH_MOVIES_SUCCESS":
      return {
        ...state,
        loading: false,
        movies: action.payload
      };
    case "SEARCH_MOVIES_FAILURE":
      return {
        ...state,
        loading: false,
        errorMessage: action.error
      };
    default:
      return state;
  }
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    fetch(MOVIE_API_URL+"/api/v1/movies/iron")
      .then(response => response.json())
      .then(jsonResponse => {
        dispatch({
          type: "SEARCH_MOVIES_SUCCESS",
          payload: jsonResponse.Search
        });
      });
  }, []);

  // you can add this to the onClick listener of the Header component
  // const refreshPage = () => {
  //   window.location.reload();
  // };

  const search = searchValue => {
    dispatch({
      type: "SEARCH_MOVIES_REQUEST"
    });
    //TODO: Move api call to service
    fetch(MOVIE_API_URL+`/api/v1/movies/${searchValue}`)
      .then(response => response.json())
      .then(jsonResponse => {
        if (jsonResponse.Response === "True") {
          dispatch({
            type: "SEARCH_MOVIES_SUCCESS",
            payload: jsonResponse.Search
          });
        } else {
          dispatch({
            type: "SEARCH_MOVIES_FAILURE",
            error: jsonResponse.Error
          });
        }
      });
  };

  const { movies, errorMessage, loading } = state;

  return (
    <div className="App">
      <Header text="Movie Geek" />
      <Search search={search} />
      <p className="App-intro"></p>
      <div className="movies">
        {loading && !errorMessage ? (
          <img className="spinner" src={spinner} alt="Loading" />
        ) : errorMessage ? (
          <div className="errorMessage">{errorMessage}</div>
        ) : (
          movies.map((movie, index) => (
            <Movie key={`${index}-${movie.Title}`} movie={movie} />
          ))
        )}
      </div>
    </div>
  );
};

export default App;
