import * as model from './model.js';
import recipeView from './views/recipeView';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime/runtime';
import paginationView from './views/paginationView';
import { MODEL_CLOSE_SEC } from './config.js';

// if (module.hot) {
//   module.hot.accept();
// }

// const { func } = require('assert-plus');
// const { data } = require('browserslist');

// https://forkify-api.herokuapp.com/v2
///////////////////////////////////////
const controlRecipes = async function () {
  try {
    // 0 Update result view to mark selected search result
    resultView.update(model.getSearchResultsPage());

    // 1. Loading recipe
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();
    await model.loadRecipe(id);
    // 2. Rendering recipe
    recipeView.render(model.state.recipe);

    //4 Update Bookmark View
    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    console.log(err);
    recipeView.renderError();
  }
};

const controlSearchResult = async function () {
  try {
    resultView.renderSpinner();
    //1. Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // //1.5 Model state page 1
    // model.state.search.page = 1;

    //2.  Load search results
    await model.loadSearchResults(query);

    //3. Render results
    resultView.render(model.getSearchResultsPage());

    // 4. Render initial pagination button
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  //1. Render New results
  resultView.render(model.getSearchResultsPage(goToPage));

  // 2. Render New initial pagination button
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //Update the recipe servings (in state)
  model.updateServings(newServings);

  //Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookMark(model.state.recipe);
  else model.deleteBookMark(model.state.recipe.id);

  // console.log(model.state.recipe);
  recipeView.update(model.state.recipe);

  // 3/ Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  // console.log(newRecipe);
  try {
    //Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new  recipe data

    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //Render recipe
    recipeView.render(model.state.recipe);

    //Success Message
    addRecipeView.renderMessage();

    // Render bookmark view //Insert
    bookmarksView.render(model.state.bookmarks);

    //Change ID in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    //window.history.back //REturn last page

    //Close form
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODEL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err, '🐱‍👤');
    addRecipeView.renderError(err.message);
  }
};

// controlRecipes();
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  console.log('Hello !');
};

init();
