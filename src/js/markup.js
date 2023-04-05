// export function markup(photos) {
//   return photos
//     .map(
//       ({
//         webformatURL,
//         largeImageURL,
//         tags,
//         likes,
//         views,
//         comments,
//         downloads,
//       }) => {
//         return `<div class="photo-card">
//       <a class='link' href="${largeImageURL}">
//   <img src="${webformatURL}" alt="${tags}" loading="lazy" width='200' height='140' />
//   <div class="info">
//     <p class="info-item">
//       <b>Likes</b>${likes}
//     </p>
//     <p class="info-item">
//       <b>Views</b>${views}
//     </p>
//     <p class="info-item">
//       <b>Comments</b>${comments}
//     </p>
//     <p class="info-item">
//       <b>Downloads</b>${downloads}
//     </p>
//   </div>
//    </a>
//   </div>`;
//       }
//     )
//     .join('');
// }

export function markup(results) {
  const { hits } = results;
  return hits
    .map(
      hit =>
        `<a href="${hit.largeImageURL}">
        <div class="photo-card">
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
</div>
</a>`
    )
    .join('');
}
