const { shell } = require('electron');

const errorMessage = document.querySelector('.error-message');
const newLinkForm = document.querySelector('.new-link-form');
const newLinkUrl = document.querySelector('.new-link-url');
const newLinkSubmit = document.querySelector('.new-link-submit');
const linksSection = document.querySelector('.links');
const clearStorageButton = document.querySelector('.clear-storage');
const parser = new DOMParser();

const clearForm = () => {
    newLinkUrl.value = null;
};

const parseResponse = (text) => {
    return parser.parseFromString(text, 'text/html');
};

const findTitle = (nodes) => {
    return nodes.querySelector('title').innerText;
};

const storeLink = (url, title) => {
  localStorage.setItem(url, JSON.stringify({
      title,
      url
  }))
};

const getLinks = () => {
  return Object.keys(localStorage).map(key => JSON.parse(localStorage.getItem(key)))
};

const convertToElement = (link) => {
    return `
        <div class='link'>
            <h3>${link.title}</h3>
            <p>
                <a href="${link.url}">${link.url}</a>
            </p>
        </div>
    `;
};

const renderLinks = () => {
    linksSection.innerHTML = getLinks().map(convertToElement).join('');
};

const handleError = (error, url) => {
    errorMessage.innerHTML = `There was an issue adding ${url}: ${error.message}`;
    setTimeout(() => {
        errorMessage.innerHTML = null;
    }, 5000)
};

const validateResponse = (response) => {
  if(response.ok) {
      return response;
  }
  return new Error(`Status code of ${response.statusCode} ${response.statusText}`);
};

newLinkUrl.addEventListener('keyup', () => {
    newLinkSubmit.disabled = !newLinkUrl.validity.valid;
});

newLinkForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = newLinkUrl.value;
    fetch(url)
        .then(validateResponse)
        .then(response => response.text())
        .then(parseResponse)
        .then(findTitle)
        .then((title) => {storeLink(url, title)})
        .then(clearForm)
        .then(renderLinks)
        .catch(error => handleError(error, url));
});

clearStorageButton.addEventListener('click', () => {
    localStorage.clear();
    linksSection.innerHTML = null;
});

linksSection.addEventListener('click', (e) => {
    if(e.target.href) {
        e.preventDefault();
        shell.openExternal(e.target.href);
    }
});

renderLinks();
