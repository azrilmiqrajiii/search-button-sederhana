// $(".search-button").on("click", function () {
//   $.ajax({
//     url:
//       "http://www.omdbapi.com/?apikey=cb103da6&s=" + $(".input-keyword").val(),
//     success: (rslt) => {
//       const movies = rslt.Search;
//       let cards = "";
//       movies.forEach((m) => {
//         cards += showCard(m);
//       });
//       $(".movie-container").html(cards);
//       $(".modal-detail-button").on("click", function () {
//         $.ajax({
//           url:
//             "http://www.omdbapi.com/?apikey=cb103da6&i=" +
//             $(this).data("imdbid"),
//           success: (m) => {
//             const movieDetail = showMovieDetail(m);
//             $(".modal-body").html(movieDetail);
//           },
//           error: (err) => console.log(err.responseText),
//         });
//       });
//     },
//     error: (err) => console.log(err.responseText),
//   });
// });

// const searchButton = document.querySelector(".search-button");
// const inputKey = document.querySelector(".input-keyword");
// searchButton.addEventListener("click", function () {
//   fetch(`http://www.omdbapi.com/?apikey=cb103da6&s=${inputKey.value}`).then(
//     (response) =>
//       response.json().then((r) => {
//         const movies = r.Search;
//         let cards = "";
//         movies.forEach((movie) => (cards += showCard(movie)));
//         const movieContainer = document.querySelector(".movie-container");
//         movieContainer.innerHTML = cards;

//         // KETIKA MODAL DETAILS DIKLIK
//         const modalDetail = document.querySelectorAll(".modal-detail-button");
//         modalDetail.forEach((btn) => {
//           btn.addEventListener("click", function () {
//             fetch(
//               `http://www.omdbapi.com/?apikey=cb103da6&i=${this.dataset.imdbid}`
//             )
//               .then((r) => r.json())
//               .then((r) => {
//                 const detailsCard = showMovieDetail(r);
//                 const modalBody = document.querySelector(".modal-body");
//                 modalBody.innerHTML = detailsCard;
//               });
//             // console.log(this.dataset.imdbid);
//           });
//         });
//       })
//   );
// });

const searchButton = document.querySelector(".search-button");

searchButton.addEventListener("click", async function () {
  try {
    const inputKey = document.querySelector(".input-keyword");
    const movies = await getMovies(inputKey.value);
    updateUI(movies);
  } catch (err) {
    alert(err);
  }
});

function getMovies(keyword) {
  return fetch(`http://www.omdbapi.com/?apikey=cb103da6&s=${keyword}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((response) => {
      if (response.Response === "False") {
        throw new Error(response.Error);
      }
      return response.Search;
    });
}

function updateUI(m) {
  const movieContainer = document.querySelector(".movie-container");
  let cards = "";
  m.forEach((m) => (cards += showCard(m)));
  movieContainer.innerHTML = cards;
}

document.addEventListener("click", async function (e) {
  try {
    if (e.target.classList.contains("modal-detail-button")) {
      const imdbid = e.target.dataset.imdbid;
      const movieDetail = await getMovieDetail(imdbid);
      updateUIDetail(movieDetail);
    }
  } catch (err) {
    alert(err);
  }
});

function getMovieDetail(imdbid) {
  return fetch(`http://www.omdbapi.com/?apikey=cb103da6&i=${imdbid}`)
    .then((r) => {
      if (!r.ok) {
        throw new Error(r.statusText);
      }
      return r.json();
    })
    .then((r) => r);
}

function updateUIDetail(m) {
  const movieDetails = showMovieDetail(m);
  const modalBody = document.querySelector(".modal-body");
  modalBody.innerHTML = movieDetails;
}

const showCard = (m) => {
  return `
            <div class="col-md-4 my-3">
              <div class="card">
                <img src="${m.Poster}" class="card-img-top" />
                <div class="card-body">
                  <h5 class="card-title">${m.Title}</h5>
                  <h6 class="card-subtitle mb-2 text-muted">${m.Year}</h6>
                  <a href="#" class="btn btn-primary modal-detail-button" data-bs-toggle="modal"
                     data-bs-target="#movieDetailModal" data-imdbid=${m.imdbID}>Show Details</a>
                </div>
              </div>
              </div>`;
};

const showMovieDetail = (m) => {
  return `<div class="container-fluid">
              <div class="row">
                <div class="col-md-3">
                  <img src="${m.Poster}" class="img-fluid" />
                </div>
                <div class="col-md">
                  <ul class="list-group">
                    <li class="list-group-item"><h4>${m.Title}(${m.Year})</h4></li>
                    <li class="list-group-item">
                      <strong>Director: </strong> ${m.Director}
                    </li>
                    <li class="list-group-item">
                      <strong>Actors: </strong>${m.Actors}
                    </li>
                    <li class="list-group-item">
                      <strong>Writer: </strong> ${m.Writer}
                    </li>
                    <li class="list-group-item">
                      <strong>Plot: </strong> ${m.Plot} 
                    </li>
                  </ul>
                </div>
              </div>
            </div>`;
};
