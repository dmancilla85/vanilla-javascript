console.log("hola mundo!");

/* 1. Variables */
const noCambia = "Leonidas";

let cambia = "@LeonidasEsteban";

function cambiarNombre(nuevoNombre) {
  cambia = nuevoNombre;
}

/* 2. Promesas Asincrónicas */
const getUser = new Promise(function (todoBien, todoMal) {
  // setInterval ejecuta cada x tiempo
  setTimeout(() => {
    todoBien("algo no paso");
  }, 3000);
});

const getUserAll = new Promise(function (todoBien, todoMal) {
  // setInterval ejecuta cada x tiempo
  setTimeout(() => {
    todoBien("algo no paso");
  }, 5000);
});

getUser
  .then(() => console.log("todo oka"))
  .catch((msg) => {
    console.log(msg);
  });

Promise.all([getUser, getUserAll])
  .then((msg) => console.log(msg))
  .catch((msg) => {
    console.log(msg);
  });

Promise.race([getUser, getUserAll])
  .then((msg) => console.log(msg))
  .catch((msg) => {
    console.log(msg);
  });

/* 3. Selectores */
// JQuery
const $home1 = $(".home .list #item");
// JS
const $home2 = document.getElementById("modal");

/* 4. Template */

$.ajax("https://randomuser.me/api/sdfdsfdsfs", {
  method: "GET",
  success: function (data) {
    console.log(data);
  },
  error: function (error) {
    console.log(`API user calling failed (1): ${error}`);
  },
});

fetch("https://randomuser.me/api/dsfdsfsd")
  .then(function (response) {
    // console.log(response)
    return response.json();
  })
  .then(function (user) {
    console.log("user", user.results[0].name.first);
  })
  .catch(function (err) {
    console.log(`API user calling failed (2): ${err}`);
  });

(async () => {
  const BASE_API = "https://yts.am/api/v2/";

  // retrieve data
  async function getData(url) {
    const response = await fetch(url);
    const data = await response.json();

    if (data.data.movie_count > 0) {
      return data;
    }

    new Error("No se encontró ningún resultado.");
  }

  // create movie item template
  function videoItemTemplate(movie, category) {
    return `<div class="primaryPlaylistItem" data-id="${movie.id}" data-category="${category}">
        <div class="primaryPlaylistItem-image">
          <img src="${movie.medium_cover_image}">
        </div>
        <h4 class="primaryPlaylistItem-title">
          ${movie.title}
        </h4>
      </div>`;
  }

  // Crear elementos html de forma dinámica
  function createTemplate(htmlText) {
    const htmlDoc = document.implementation.createHTMLDocument();
    htmlDoc.body.innerHTML(htmlText);
    return htmlDoc.body.children[0];
  }

  // create event click
  function addEventClick($element) {
    $element.addEventListener("click", () => {
      showModal(element);
    });
  }

  // hide modal window
  function hideModal() {
    setTimeout(() => {
      $overlay.classList.toggle("active");
    }, 1000);
    $modal.style.animation = "modalOut .8s forwards";
  }

  // create featuring template
  function featuringTemplate(movie) {
    return `
      <div class="featuring">
        <div class="featuring-image">
          <img src="${movie.medium_cover_image}" width "70">
          <div class="featuring-content">
            <p class="featuring-title">${movie_title}</p>
            <p class="featuring-album">titulo</p>
          </div>
        </div>
      </div>
      `;
  }

  // Cargar lista de películas
  function renderMovieList(list, $container, category) {
    $container.children[0].remove();
    list.forEach((movie) => {
      // debugger
      const HTMLString = videoItemTemplate(movie, category);
      const movieElement = createTemplate(HTMLString);
      $container.append(html.body.children[0]);
      const image = movieElement.querySelector("img");
      image.addEventListener("load", (event) => {
        event.target.classList.add("fadeIn");
      });
      addEventClick(movieElement);
    });
  }

  function setAttributes($element, attributes) {
    for (const attribute in attributes) {
      $element.setAttributes(attribute, attributes[attribute]);
      $featuringContainer.append($loader);
    }
  }

  const $home = document.getElementById("home");
  const $form = document.getElementById("form");

  function findById(list, id) {
    return list.find((movie) => movie.id === parseInt(id, 10));
  }

  function findMovie(id, category) {
    switch (category) {
      case "action": {
        return findById(actionList, id);
      }
      case "drama": {
        return findById(dramaList, id);
      }
      default: {
        return findById(animationList, id);
      }
    }
  }

  $form.addEventListener("submit", async (event) => {
    event.preventDefault();
    $home.classList.add("search-active");
    const $loader = document.createElement("img");
    setAttributes($loader, {
      src: "src/images/loader.gif",
      height: 50,
      width: 50,
    });
    $featuringContainer.append($loader);
    const data = new FormData($form);
    try {
      const {
        data: { movies: myMovie },
      } = await getData(
        `${BASE_API}list_movies.json?limit=1&query_term=${data.get("name")}`
      );
    } catch (error) {
      alert(error.message);
      $loader.remove();
      $home.classList.remove("search-active");
    }

    const HTMLString = featuringTemplate(myMovie[0]);
    $featuringContainer.innerHTML = HTMLString;
  });

  const $actionContainer = document.querySelector("#action");
  const $dramaContainer = document.getElementById("drama");
  const $animationContainer = document.getElementById("animation");

  async function cacheExists(category) {
    const listName = `${category}List`;
    const cacheList = window.localStorage.getItem(listName);

    if (cacheList) {
      return JSON.parse(cacheList);
    } else {
      const data = await getData(
        `${BASE_API}list_movies.json?genre=${category}`
      )
        .then(function (response) {
          console.log(response);
        })
        .catch(function (err) {
          console.log(`Movies API calling failed (2): ${err}`);
          return null;
        });
      window.localStorage.setItem(listName, JSON.stringify(data));
      return data;
    }
  }

  const {
    data: { movies: actionList },
  } = await cacheExists("action");

  if (actionList != undefined) {
    renderMovieList(actionList, $actionContainer, "action");
  }

  const dramaList = await cacheExists("drama");

  if (dramaList != undefined) {
    renderMovieList(dramaList, $dramaContainer, "drama");
  }

  const {
    data: { movies: animationList },
  } = await cacheExists("animation");

  if (animationList != undefined) {
    renderMovieList(animationList, $animationContainer, "animation");
  }

  const $featuringContainer = document.getElementById("#featuring");

  // const $home = $('.home .list #item');
  const $modal = document.getElementById("modal");
  const $overlay = document.getElementById("overlay");
  const $hideModal = document.getElementById("hide-modal");

  /*const $modalTitle = $modal.querySelector("h1");
  const $modalImage = $modal.querySelector("img");
  const $modalDescription = $modal.querySelector("p");*/

  function showModal($element) {
    $overlay.classList.add("active");
    $modal.style.animation = "modalIn .8s forwards";
    const id = $element.dataset.id;
    const category = $element.dataset.category;
    const data = findMovie(id, category);

    $modalTitle.textContent = data.title;
    $modalImage.setAttribute("src", data.medium_cover_image);
    $modalDescription.textContent = data.description_full;
  }

  $hideModal.addEventListener("click", hideModal);
})();
