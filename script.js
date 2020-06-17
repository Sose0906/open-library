const searchInput = document.getElementById('search');
const booksContent = document.getElementById('main-content');
const loader = document.getElementsByClassName('loader')[0];
searchInput.oninput = debounce(searchBook, 1000);
let START_INDEX = 0;


function searchBook(e) {
    loader.style.display = 'block';
    booksContent.innerHTML = '';
    let value = searchInput.value;
    START_INDEX = 0;
    fetchCall(value, START_INDEX)


}

function fetchCall(value, startIndex = 0) {

    if (value) {
        fetch(`https://www.googleapis.com/books/v1/volumes?q=${value}&key=AIzaSyDt-j6pr_6qPeiN4qZ5pkyWbs5J5vc-_f0&startIndex=${startIndex}`)
            .then(function (response) {
                return response.json()
            })
            .then(function (result) {
                loader.style.display = 'none';
                if (result && result.items && result.items.length) {
                    result.items.forEach(item => makeElement(item.volumeInfo));
                } else {
                    let h2 = `<h2 class="text-center">Oops!! No result :(</h2>`
                    booksContent.innerHTML = h2;
                }


            }).catch(error => {
            loader.style.display = 'none';
            console.log(error);
        });

    } else {
        loader.style.display = 'none';
    }
}

function makeElement(obj) {
    let div = document.createElement('div');
    let authors = (obj.authors && obj.authors.length != 0) ? obj.authors.join(',') : "";
    let inner = `<div class="book d-flex flex-column "><img  src="${obj.imageLinks.thumbnail}" alt="">
<h6 class="mt-2"><span>Title:</span> <span>${obj.title}</span></h6>
<h6><span>Author(s):</span> <span>${authors}</span></h6>
<h6><span>Publish date:</span> <span>${obj.publishedDate}</span></h6>
</div>`;
    div.innerHTML = inner;
    div.classList.add("book", "d-flex", "flex-column");
    booksContent.appendChild(div);


}

function debounce(func, ms) {
    let timeout;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, arguments), ms);
    };
}


window.onscroll = function () {
    myFunction()
};

function myFunction() {

    if (window.scrollY + window.innerHeight > document.body.offsetHeight - 200) {
        START_INDEX += 10;
        let value = searchInput.value;
        fetchCall(value, START_INDEX)
    }
}
