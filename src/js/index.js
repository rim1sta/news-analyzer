import "../pages/index.css";
import DataStorage from "./modules/DataStorage.js";
import NewsCard from "./components/NewsCard.js";
import NewsCardList from "./components/NewsCardList.js";
import NewsApi from "./modules/NewsApi.js";
import SearchInput from "./components/SearchInput.js";
import {
  renderLoading,
  result,
  renderThreeCards,
  deleteButton,
  renderBlock,
} from "./utils/functions.js";
import {
  FIRST_ARG,
  SECOND_ARG,
  API_KEY,
  API_URL,
  CURRENT_DATE,
  WEEK_AGO,
  PAGE_SIZE,
} from "./constants/constants";

const firstCount = renderThreeCards(3, 3);
const secondCount = renderThreeCards(6, 3);

const newsButton = document.querySelector(".news__button");
const errorMeassages = document.querySelector(".searcher__error");
const searchButton = document.querySelector(".searcher__button");
const errorSection = document.querySelector(".search-error");
const preloader = document.querySelector(".preloader");
const newsSection = document.querySelector(".news");
const searchForm = document.forms.searcherForm;
const searcherInput = document.querySelector(".searcher__input");
const newsList = document.querySelector(".news__list");

const newsCardList = new NewsCardList(newsList, createNewsCard);
const newsApi = new NewsApi(
  API_URL,
  PAGE_SIZE,
  searcherInput,
  WEEK_AGO,
  CURRENT_DATE,
  API_KEY
);
const dataStorage = new DataStorage();
const searchInput = new SearchInput(
  searcherInput,
  searchButton,
  errorMeassages
);

//creating card
function createNewsCard(dataForElement) {
  const newsCard = new NewsCard(dataForElement);
  return newsCard.create();
}

//render cards after request
function searchNews() {
  event.preventDefault();
  newsCardList.updateList();
  renderLoading(true, preloader);
  const firstCount = renderThreeCards(3, 3);
  const secondCount = renderThreeCards(6, 3);
  deleteButton(dataStorage.getData());
  newsApi
    .getNews()

    .then((res) => {
        searchInput.checkInputValidity();
  searchInput.setSubmitButtonState(false);
      dataStorage.saveData(res.articles);
      dataStorage.getValue(searcherInput.value)
      

      result(res.articles.length === 0, newsSection, errorSection);
      newsCardList.render(dataStorage.getData(res), FIRST_ARG, SECOND_ARG);
      searchInput.setSubmitButtonState(true);
      deleteButton(dataStorage.getData(res));
    })
    .catch((err) => {
      alert(`ошибка:${err}. Запрос не выполнен`);
    })
    .finally(() => {
      renderLoading(false, preloader);
    });
}

// event listeners
searcherInput.addEventListener("input", () => {
  searchInput.checkInputValidity();
});

searchForm.addEventListener("submit", (event) => {
    event.preventDefault()
    dataStorage.setValue(searcherInput.value)
  searchInput.checkInputValidity();
  searchInput.setSubmitButtonState(true);
  searchNews();
  searchInput.setSubmitButtonState(false);
  deleteButton(dataStorage.getData());
});

newsButton.addEventListener("click", (event) => {
    dataStorage.setValue(searcherInput.value)
  event.preventDefault();
  newsCardList.render(dataStorage.getData(), firstCount(), secondCount());
  deleteButton(dataStorage.getData());
});




    if (localStorage.getItem('articles') === null || dataStorage.getData().length !== 0){
        renderBlock(false, newsSection)
    } else {
newsCardList.render(dataStorage.getData(), FIRST_ARG, SECOND_ARG);
    }