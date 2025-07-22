// ✅ STEP-BY-STEP UNTUK FITUR HAPUS & EDIT DENGAN INDEXEDDB

let db;
const request = indexedDB.open("moviumDB", 1);

request.onupgradeneeded = function (event) {
  db = event.target.result;
  if (!db.objectStoreNames.contains("movies")) {
    db.createObjectStore("movies", { keyPath: "id", autoIncrement: true });
  }
};

request.onsuccess = function (event) {
  db = event.target.result;
  displayMovies();
};

function addMovie(data) {
  const tx = db.transaction("movies", "readwrite");
  const store = tx.objectStore("movies");
  store.add(data);
}

function deleteMovie(id) {
  const tx = db.transaction("movies", "readwrite");
  const store = tx.objectStore("movies");
  store.delete(id).onsuccess = () => displayMovies();
}

function confirmDelete(id, title) {
  if (confirm(`Yakin ingin menghapus ulasan "${title}"?`)) {
    deleteMovie(id);
  }
}

function editMovie(id) {
  const tx = db.transaction("movies", "readonly");
  const store = tx.objectStore("movies");
  const req = store.get(id);
  req.onsuccess = function () {
    const data = req.result;
    if (!data) return;

    const newTitle = prompt("Edit Judul:", data.title) || data.title;
    const newStatus = prompt("Edit Status:", data.status) || data.status;
    const newRating = prompt("Edit Rating:", data.rating) || data.rating;
    const newReview = prompt("Edit Ulasan:", data.review) || data.review;

    const updateTx = db.transaction("movies", "readwrite");
    const updateStore = updateTx.objectStore("movies");
    updateStore.put({ ...data, title: newTitle, status: newStatus, rating: newRating, review: newReview })
      .onsuccess = () => displayMovies();
  };
}

function displayMovies() {
  const tx = db.transaction("movies", "readonly");
  const store = tx.objectStore("movies");
  const request = store.getAll();

  request.onsuccess = function () {
    const list = document.getElementById("movieList");
    if (!list) return;

    list.innerHTML = request.result.map(item => `
      <div class="col-md-4">
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
            <p class="card-text">Status: ${item.status}<br>Rating: ${item.rating}</p>
            <p class="card-text small text-muted">${item.review}</p>
            <div class="d-flex justify-content-between mt-3">
              <button class="btn btn-outline-primary btn-sm" onclick="editMovie(${item.id})">✏️ Edit</button>
              <button class="btn btn-outline-danger btn-sm" onclick="confirmDelete(${item.id}, '${item.title.replace(/'/g, "\'")}')">🗑️ Hapus</button>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  };
}
