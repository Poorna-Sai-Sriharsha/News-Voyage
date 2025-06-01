/* Initialize AOS library for animations */
AOS.init();
/* API configuration */
const API_KEY = 'ADD_YOUR_APIKEY';
const BASE_URL = 'https://gnews.io/api/v4';
/* Fetch news from GNews API */
async function fetchNews(query = '', topic = '') {
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = '<p class="loading"><i class="fas fa-spinner fa-spin"></i> Loading news...</p>';
    let url = `${BASE_URL}/top-headlines?lang=en&country=in&token=${API_KEY}`;
    if (query) url += `&q=${encodeURIComponent(query)}`;
    if (topic) url += `&topic=${encodeURIComponent(topic)}`;

    try {
        const response = await axios.get(url);
        displayNews(response.data.articles);
    } catch (error) {
        newsContainer.innerHTML = '<p class="error"><i class="fas fa-exclamation-triangle"></i> Failed to load news. Check your connection or API key.</p>';
    }
}
/* Display news articles in the news container */
function displayNews(articles) {
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = '';
    if (!articles || articles.length === 0) {
        newsContainer.innerHTML = '<p class="no-news"><i class="fas fa-frown"></i> No news found.</p>';
        return;
    }
    // Limit to top 9 articles
    const topNineArticles = articles.slice(0, 9);
    topNineArticles.forEach((article) => {
        const newsCard = document.createElement('div');
        newsCard.className = 'news-card';
        newsCard.setAttribute('data-aos', 'fade-up');
        const publishDate = new Date(article.publishedAt).toLocaleDateString('en-IN', {
            year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        });
        newsCard.innerHTML = `
            <img src="${article.image || 'https://via.placeholder.com/350x220?text=No+Image'}" alt="${article.title}">
            <div class="content">
                <h2>${article.title}</h2>
                <p>${article.description || 'No description available.'}</p>
                <div class="details">
                    <span><i class="fas fa-source"></i> ${article.source.name || 'Unknown'}</span>
                    <span><i class="far fa-calendar-alt"></i> ${publishDate}</span>
                </div>
                <a href="${article.url}" target="_blank">Read More <i class="fas fa-arrow-right"></i></a>
            </div>`;
        newsContainer.appendChild(newsCard);
    });
}
/* Handle search input and fetch news */
function handleSearch() {
    const searchInput = document.getElementById('search').value.trim();
    fetchNews(searchInput);
}
/* Filter news by category and update active button */
function filterNews(topic) {
    fetchNews('', topic);
    const buttons = document.querySelectorAll('.categories button');
    buttons.forEach(btn => btn.classList.remove('active'));
    const activeBtn = Array.from(buttons).find(btn => btn.textContent.toLowerCase() === topic);
    if (activeBtn) activeBtn.classList.add('active');
}
/* Toggle between light and dark mode */
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}
/* Initialize news fetch on page load */
document.addEventListener('DOMContentLoaded', () => {
    fetchNews();
});