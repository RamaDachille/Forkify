import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

// if(module.hot) module.hot.accept()

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    
    if (!id) return;
    recipeView.renderSpinner();
    
    // 0) Update results to mark selected
    resultsView.update(model.getSearchResultsPage())

    // 1) Loading recipe
    await model.loadRecipe(id);
    
    // 2) Rendering recipe
    recipeView.render(model.state.recipe);

  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner()

    // 1) Get search results
    const query = searchView.getQuery()
    if(!query) return
    
    // 1) load search results
    await model.loadSearchResults(query);
    
    // 1) render search results
    resultsView.render(model.getSearchResultsPage())

    // 4) Render initial pag buttons
    paginationView.render(model.state.search)
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function(goToPage) {
  // 1) render NEW search results
  resultsView.render(model.getSearchResultsPage(goToPage))

  // 4) Render NEW pag buttons
  paginationView.render(model.state.search)
}

const controlServings = function(newServings) {
  model.updateServings(newServings)
  recipeView.update(model.state.recipe);
}

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings)
  searchView.addHandlerSearch(controlSearchResults)
  paginationView.addHandlerClick(controlPagination)
};
init();
