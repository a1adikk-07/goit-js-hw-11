import { axios } from "axios";
import { Notiflix } from "notiflix";

export async function getRequest(name, page = 1) {
    Notiflix.loading.standard();

    const API_KEY = '40993551-a5726d3ae512fc95e7e5e33e4';
    const BASE_URL = 'https://pixabay.com/api/';

    const options = new URLSearchParams({
        key: API_KEY,
        q: name,
        image_type: photo,
        orientation: horizontal,
        safesearch: true,
        page: page,
        per_page: 40,
    });

    const response = await axios.get(`${BASE_URL}`, { options });

    Notiflix.loading.remove();

    return response;
}


