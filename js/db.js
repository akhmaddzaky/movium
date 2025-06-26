let db;
const request = indexedDB.open("moviumDB", 1);

request.onupgradeneeded = function (event) {
  db = event.target.result;
  db.createObjectStore("movies", { keyPath: "id", autoIncrement: true });
};

request.onsuccess = function (event) {
  db = event.target.result;
  displayMovies();
};

function addMovie(data) {
  const tx = db.transaction("movies", "readwrite");
  tx.objectStore("movies").add(data);
}

function displayMovies() {
  const tx = db.transaction("movies", "readonly");
  const store = tx.objectStore("movies");
  const request = store.getAll();
  request.onsuccess = function () {
    const list = document.getElementById("movieList");
    list.innerHTML = request.result.map(item => `
      <div class="col-md-4">
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
            <p class="card-text">Status: ${item.status}<br>Rating: ${item.rating}</p>
            <p class="card-text small text-muted">${item.review}</p>
          </div>
        </div>
      </div>
    `).join('');
  };
}