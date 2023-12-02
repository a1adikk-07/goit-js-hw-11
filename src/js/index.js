import  Notiflix  from "notiflix";
import SimpleLightbox from "simplelightbox";
import { createMarkup } from './marcup.js';
import { getRequest } from "./api.js";
import SimpleLightbox from "simplelightbox/dist/simple-lightbox.css";


const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('.search-input');
const boxGallery = document.querySelector('.gallery')
const boxTarget = document.querySelector('.observe-box')

let searchItem = '';
let page = 1;
let totalResult = 0;

let lightbox = new SimpleLightbox('.gallery-link', {
    captionDelay: 250,
    captionsData: 'alt',
});

let option = {
    root: null,
    rootMarg: '250px',
    threshold: 1.0,
}

let observer = new IntersectionObserver(onLoad, option);

function onLoad(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting && page >= Math.ceil(totalResult / 40)) {
            getRequest(serchItem, (page += 1)).then(
                ({ data: { hits: arrayCards } }) => {
                    const markup = createMarkup(arrayCards);
                    boxGallery.insertAdjacentHTML('beforeend', markup);

                    lightbox.refresh();
                }
            );
        } else if (entry.isIntersecting && page >= Math.ceil(totalResult / 40)) {
            observer.unobserve(boxTarget);
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        }
    });
}

function onSubmit(i) {
    i.preventDEfault();
    page = 1;
    boxGallery.innerHTML = '';

    observer.observe(boxTarget);

    searchItem = searchInput.value;

    if (!searchItem) {
        Notiflix.Notify.failure(`Please, write something in the search!`)
        return;
    }

    getRequest(searchItem, page).then(({ data: { hits: arrayCards, totalHits: totalCard, } }) => {
        if (arrayCards.length === 0) {
            throw new Error();
        }
        const markup = createMarkup(arrayCards);

        boxGallery.insertAdjacentHTML('beforeend', markup);
        Notiflix.Notify.success(`We found ${totalCard} images`);

        lightbox.refresh();
        observer.observe(boxTarget);
        totalResult = totalCard;
    }).catch(() =>
        Notiflix.Notify.failure(
            "Sorry, there are no images matching your search query. Please try again."
        )
    );
    searchForm.reset();
}

searchForm.addEventListener('submit', onSubmit);

window.addEventListener('scroll', () => {
    if (window.scrollY > 100 && !(document.activeElement === searchInput)) {
        searchForm.style.opacity = '0.6';
    } else {
        searchForm.style.opacity = '1';
    }
})
searchInput.addEventListener('focus', () => {
    searchForm.style.opacity = '1';
});

