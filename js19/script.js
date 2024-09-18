class MovieService {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    async search(title, type, page = 1) {
        const url = `http://www.omdbapi.com/?s=${encodeURIComponent(title)}&type=${type}&page=${page}&apikey=${this.apiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }

    async getMovie(movieId) {
        const url = `http://www.omdbapi.com/?i=${movieId}&apikey=${this.apiKey}`;
        const response = await fetch(url);
        const movie = await response.json();
        return movie;
    }
}

const moviesContainer = document.getElementById('movies');
const paginationContainer = document.getElementById('pagination');
const loader = document.createElement('div');
loader.innerHTML = 'Loading...';
loader.classList.add('loader');
let currentPage = 1;

function displayMovies(movies) {
    movies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');
        movieElement.innerHTML = `
            <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/100'}" alt="${movie.Title}">
            <div class="movie-info">
                <h2>${movie.Title} (${movie.Year})</h2>
                <button onclick="showMovieDetails('${movie.imdbID}')">Details</button>
            </div>
        `;
        moviesContainer.appendChild(movieElement);
    });
}

function showLoading() {
    moviesContainer.appendChild(loader);
}

function hideLoading() {
    loader.remove();
}

function setupMoreButton(movieService, title, type) {
    const moreButton = document.createElement('button');
    moreButton.textContent = 'More';
    moreButton.onclick = async () => {
        moreButton.disabled = true;
        showLoading();
        currentPage++;
        const data = await movieService.search(title, type, currentPage);
        if (data.Response === 'True') {
            displayMovies(data.Search);
        }
        hideLoading();
        moreButton.disabled = false;
    };
    paginationContainer.appendChild(moreButton);
}

async function showMovieDetails(id) {
    const movieService = new MovieService('ad5e955b'); // Замените на ваш ключ API
    showLoading();
    const movie = await movieService.getMovie(id);
    hideLoading();
    alert(`
        Title: ${movie.Title}
        Year: ${movie.Year}
        Genre: ${movie.Genre}
        Plot: ${movie.Plot}
    `);
}

document.getElementById('searchForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const title = document.getElementById('movieTitle').value;
    const type = document.getElementById('movieType').value;

    const movieService = new MovieService('ad5e955b'); // Замените на ваш API ключ
    currentPage = 1;

    moviesContainer.innerHTML = ''; // Очищаем предыдущие результаты
    paginationContainer.innerHTML = ''; // Очищаем кнопки пагинации
    showLoading(); // Отображаем загрузку

    const data = await movieService.search(title, type, currentPage);
    hideLoading(); // Убираем иконку загрузки
    if (data.Response === 'True') {
        displayMovies(data.Search);
        setupMoreButton(movieService, title, type); // Настраиваем кнопку More для загрузки следующих страниц
    } else {
        moviesContainer.innerHTML = `<p>${data.Error}</p>`;
    }
});
