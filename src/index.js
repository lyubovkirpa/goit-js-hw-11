// Your API key: 34902675-92ba045b8bca6beb63d638c3b

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { markup } from './js/markup';

let searchQueryResult = '';
let q = '';
let pageN = 1;
let gallery = new SimpleLightbox('.gallery a', {
  /* options */ enableKeyboard: true,
});

const pixabayAPI = {
  baseUrl: 'https://pixabay.com/api/',
  key: '34902675-92ba045b8bca6beb63d638c3b',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: 'true',
  order: 'popular',
  page: '1',
  per_page: '40',
};

const markupData = {
  htmlCode: '',
};

const searchForm = document.querySelector('.search-form');
const gallerySelector = document.querySelector('.gallery');

searchForm.addEventListener('submit', onSearchForm);

async function onSearchForm(e) {
  e.preventDefault();

  const {
    elements: { searchQuery },
  } = e.target;

  searchQueryResult = searchQuery.value;

  console.log('searchQueryResult:', `"${searchQueryResult}"`);
  console.log('q:', `"${q}"`);

  if (searchQueryResult === '') {
    console.log(searchQueryResult);
    gallerySelector.innerHTML = '';
    btnLoadMore.classList.remove('is-visible');

    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  if (searchQueryResult !== q) {
    console.log('CHANGED!!! NOT EMPTY QUERY');

    pageN = 1;
    pixabayAPI.page = `${pageN}`;

    gallerySelector.innerHTML = '';
    btnLoadMore.classList.remove('is-visible');
  } else {
    console.log('page+1!!!');

    pageN += 1;
    pixabayAPI.page = `${pageN}`;

    btnLoadMore.classList.remove('is-visible');
  }

  q = searchQueryResult;

  try {
    const results = await fetchPhotos(searchQueryResult);
    markupData.htmlCode = await markup(results);

    gallerySelector.insertAdjacentHTML('beforeend', markupData.htmlCode);
    btnLoadMore.classList.add('is-visible');

    // simpleLightbox gallery destroys and reinitilized
    gallery.refresh();

    const { page, per_page } = pixabayAPI;
    const { total, totalHits, hits } = results;
    const totalPages = Math.ceil(totalHits / per_page);

    if (page >= totalPages) {
      btnLoadMore.classList.remove('is-visible');
    }

    Notify.success(`'Hooray! We found ${results.totalHits} images.'`);

    //console.log
    console.log('results', results);
  } catch (error) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  console.log('');
}

// button load more

const btnLoadMore = document.querySelector('.load-more');
btnLoadMore.addEventListener('click', async () => {
  pageN += 1;
  pixabayAPI.page = `${pageN}`;

  try {
    const results = await fetchPhotos(searchQueryResult);
    markupData.htmlCode = await markup(results);

    gallerySelector.insertAdjacentHTML('beforeend', markupData.htmlCode);
    btnLoadMore.classList.add('is-visible');

    // simpleLightbox gallery destroys and reinitilized
    gallery.refresh();

    const {
      baseUrl,
      key,
      image_type,
      orientation,
      safesearch,
      order,
      page,
      per_page,
    } = pixabayAPI;
    const { total, totalHits, hits } = results;

    const totalPages = Math.ceil(totalHits / per_page);

    if (page >= totalPages) {
      btnLoadMore.classList.remove('is-visible');
    }

    console.log('results', results);
  } catch (error) {
    Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  }

  console.log('btnLoadMore working');
  console.log('');
});

// fetch photos function

async function fetchPhotos(searchQueryResult) {
  const {
    baseUrl,
    key,
    image_type,
    orientation,
    safesearch,
    order,
    page,
    per_page,
  } = pixabayAPI;

  pixabayAPI.page = `${pageN}`;

  console.log('page', page);

  const response = await axios.get(
    `${baseUrl}?key=${key}&q=${q}&image_type=${image_type}&orientation=${orientation}&safesearch=${safesearch}&order=${order}&page=${page}&per_page=${per_page}`
  );
  const results = response.data;
  console.log('response.data', response.data);

  console.log('response', response);
  console.log('page', page);

  //results destruction

  const { total, totalHits } = results;
  const totalPages = Math.ceil(totalHits / per_page);

  if (total === 0) {
    throw new Error();
  }

  //total pages check
  if (page >= totalPages) {
    btnLoadMore.classList.remove('is-visible');
    Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
    return results;
  }

  console.log('totalHits', totalHits);
  console.log('per_page', per_page);

  console.log('totalPages=', totalPages);

  return results;
}
