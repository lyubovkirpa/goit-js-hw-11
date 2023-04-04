// Your API key: 34902675-92ba045b8bca6beb63d638c3b
// import { refs } from './js/refs';
// import { createMarkup } from './js/createMarkup';
// import { fetchimages } from './js/fetchimages';

// import { Notify } from 'notiflix/build/notiflix-notify-aio';

// // import SimpleLightbox from 'simplelightbox';
// // import 'simplelightbox/dist/simple-lightbox.min.css';

// let query = '';
// let pageNumber = 1;
// let totalPages = 1;
// let totalHits = 0;
// const itemsOnPage = 40;

// refs.searchFormRef.addEventListener('submit', onSearchFormSubmit);

// function onSearchFormSubmit(evt) {
//   evt.preventDefault();

//   query = evt.target.query.value;

//   if (query === '') {
//     return;
//   }
//   pageNumber = 1;
//   totalPages = 1;

//   clearMarkup(contentParentElement);
//   searchImages();
// }

// async function searchImages() {
//   try {
//     const res = await fetchimages(query, pageNumber, itemsOnPage);
//     requestHandler(res);
//   } catch (error) {
//     console.log(error);
//   }
// }

// function requestHandler({ data }) {
//   const content = data.hits;
//   if (!content[0]) {
//     Notify.failure(
//       'Sorry, there are no images matching your search query. Please try again.'
//     );
//     return;
//   }
//   totalHits = data.totalHits;
//   totalPages = Math.ceil(totalHits / itemsOnPage);
//   createMarkup(content, contentParentElement);
//   gallery.refresh();
//   addInfScroll(loadNextPage);
//   pageNumber !== 1 && makeSmoothScroll();
// }

// function loadNextPage() {
//   removeInfScroll();
//   if (totalPages === pageNumber) {
//     Notify.info(`Hooray! We found ${totalHits} images.`);
//     return;
//   }
//   pageNumber += 1;
//   searchImages();
//   console.log(`total pages: ${totalPages}`);
//   console.log(`current page: ${pageNumber}`);
// }

// import './sass/main.scss';

import { Notify } from 'notiflix';
const axios = require('axios').default;
// Описан в документации
import SimpleLightbox from 'simplelightbox';
// Дополнительный импорт стилей
import 'simplelightbox/dist/simple-lightbox.min.css';

// -------------------------------------------------------------------------------------------------------
//let variables

let searchQueryResult = '';
let q = '';
let pageN = 1;
let gallery = new SimpleLightbox('.gallery a', {
  /* options */ enableKeyboard: true,
});

//Objects

//pixabayObj

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

//markup

const markupData = {
  markup: '',
  htmlCode: '',
};

// -------------------------------------------------------------------------------------------------------
// searchForm and gallery find in DOM

const searchForm = document.querySelector('.search-form');
const gallerySelector = document.querySelector('.gallery');

// -------------------------------------------------------------------------------------------------------
// event listener search form

searchForm.addEventListener('submit', async e => {
  e.preventDefault();

  const {
    elements: { searchQuery },
  } = e.target;

  searchQueryResult = searchQuery.value;

  // console.log
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
    markupData.htmlCode = await renderedPhotos(results);

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

    Notify.success(`'Hooray! We found ${results.totalHits} images.'`);

    //console.log
    console.log('results', results);
  } catch (error) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  // console.log
  console.log('');
});

// -------------------------------------------------------------------------------------------------------
// button load more

const btnLoadMore = document.querySelector('.load-more');
btnLoadMore.addEventListener('click', async () => {
  pageN += 1;
  pixabayAPI.page = `${pageN}`;

  try {
    const results = await fetchPhotos(searchQueryResult);
    markupData.htmlCode = await renderedPhotos(results);

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

// -------------------------------------------------------------------------------------------------------
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

  // const response = await fetch(`${baseUrl}?key=${key}&q=${q}&image_type=${image_type}&orientation=${orientation}&safesearch=${safesearch}&order=${order}&page=${page}&per_page=${per_page}`);
  // const results = await response.json();

  const response = await axios.get(
    `${baseUrl}?key=${key}&q=${q}&image_type=${image_type}&orientation=${orientation}&safesearch=${safesearch}&order=${order}&page=${page}&per_page=${per_page}`
  );
  const results = response.data;
  console.log('response.data', response.data);

  console.log('response', response);
  console.log('page', page);

  //results destruction

  const { total, totalHits, hits } = results;
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

  //received data
  return results;
}

// -------------------------------------------------------------------------------------------------------
// render photos function, make html markup

async function renderedPhotos(results) {
  const { hits } = results;

  markupData.markup = hits
    .map(
      hit =>
        `<a href="${hit.largeImageURL}"><div class="photo-card">
        <img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy"
          class="img-item" />
        <div class="info">
    <p class="info-item">
      <b>Likes:</b>${hit.likes}
    </p>
    <p class="info-item">
      <b>Views:</b>${hit.views}
    </p>
    <p class="info-item">
      <b>Comments:</b>${hit.comments}
    </p>
    <p class="info-item">
      <b>Downloads:</b>${hit.downloads}
    </p>
  </div>
</div></a>`
    )
    .join('');

  return markupData.markup;
}
