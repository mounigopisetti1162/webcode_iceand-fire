var page_index=0;
const headerrow=document.createElement("div")
headerrow.classList=+"row"
headerrow.id="first"
headerrow.className="class"
document.body.append(headerrow)
// console.log(headerrow)
const headerdivision=document.createElement("div") 
let header=document.createElement("h1")
headerdivision.classList+="col-md-9"
header.id="header"
header.innerHTML='<span id="ice"> ICE AND FIRE BOOKS API</span>'

headerdivision.append(header)
headerrow.append(headerdivision)
// console.log(headerrow)

const main=document.createElement("div")
main.classList+="container"
document.body.appendChild(main)

const nav=document.createElement("div")
nav.classList+="row"
nav.id="navBar"
nav.style.margin="15px 0"
main.append(nav)

const search=document.createElement("div")
search.classList+="col-4"
let bar=document.createElement("input")
bar.type="text"
bar.id="searchbar"
bar.classList+="form-control"
bar.placeholder="search here"
bar.setAttribute("onkeyup","searchFun()")
search.appendChild(bar)

const pageDiv = document.createElement("div")
pageDiv.classList += "col-6"
pageDiv.id = "pageNumDiv"
let paginationNo = document.createElement('h4')
pageDiv.appendChild(paginationNo)
paginationNo.innerHTML = `Page <span id="pageNum">${page_index}</span>`
nav.append(search, pageDiv)

const searchFun = () => {
    var input, filter, h2, title, i, txtValue, books, card;
    
    input = document.getElementById("searchbar");
    filter = input.value.toUpperCase();
    h2 = document.getElementsByTagName("h2");
    books = document.getElementById("booksDiv")
    card = books.getElementsByClassName("bookCard")
    for (i = 0; i < h2.length; i++) {
        title = h2[i].innerHTML
        if (title) {
            txtValue = title.toUpperCase();
            let re = new RegExp(filter, 'i');
            if (txtValue.includes(filter)) {
                card[i].style.display = "";
            } else {
                card[i].style.display = "none";
            }
        }
    }
}

const displayB=document.createElement("div")
displayB.classList+="container booklist"
displayB.id="bookdiv"
displayB.style.height="min-content"
displayB.style.backgroundImage = "url('https://images.unsplash.com/photo-1621944193575-816edc981878?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NTV8fGJvb2slMjBjb3ZlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60')"



async function creatcard(name,pages,isbn,author,publisher,relDate,characters)
{
    const bookCard=document.createElement("div")
    bookCard.classList+="bookcard"

    const bookName=document.createElement("h2")
    bookName.innerHTML=name
    bookName.id="bookname"
    const pagesNo = document.createElement("h5")
    pagesNo.innerHTML = `<b>No. of Pages</b> - ${pages}`

    const isbnNo = document.createElement("h5")
    isbnNo.innerHTML = `<b>Isbn</b> - ${isbn}`

    const authorName = document.createElement("h5")
    authorName.innerHTML = `<b>Authors Name</b> - ${author}`

    const publisherName = document.createElement("h5")
    publisherName.innerHTML = `<b>Publishers Name</b> - ${publisher}`

    const releasedDate = document.createElement("h5")
    releasedDate.innerHTML = `<b>Released Date</b> - ${relDate.split("").slice(0,10).join("")}`

    
    const charTitle = document.createElement("h5")
    charTitle.innerHTML = "<b>Five characters</b> -"
    const charactersList = document.createElement("ol")
    charactersList.id = "charList"
    charactersList.style.fontWeight = "bold"

      characters.forEach(async (character) => {
        const fetchCharApi = await fetch(character)
        const res = await fetchCharApi.json()
        const characterName = document.createElement("li")
        if (!res.name) {
            characterName.innerHTML = "Data Unavailable"
        }
        else {
            characterName.innerHTML = res.name
        }
        charactersList.append(characterName)
    })

    bookCard.append(bookName, pagesNo, isbnNo, authorName, publisherName, releasedDate, charTitle, charactersList)

    displayB.append(bookCard)
}

// fetching book api data using page number
const getBooks = async (pgNo) => {
    try {
   
        displayB.innerHTML = ""

        const loading = document.createElement("span")
        loading.id = "loadingBtn"
        loading.innerHTML = '<div class="spinner-border"></div>'
        displayB.appendChild(loading)

    
        const fetchPageApi = await fetch(`https://www.anapioficeandfire.com/api/characters?page=${pgNo}&pageSize=50`)

        const page = await fetchPageApi.json()

   
        displayB.removeChild(loading)

        
        page.forEach(async (data) => {
            try {
                const fetchBookApi = await fetch(`${data.books[0]}`)
                const book = await fetchBookApi.json()
                creatcard(book.name, book.numberOfPages, book.isbn, book.authors, book.publisher, book.released, book.characters.slice(0, 5))
            }
            catch (err) {
                console.log(err)
            }
        })
    }
    catch (err) {
        console.log(err)
    }
}
getBooks(page_index)


// pagination

// creating div for action buttons
const actionBtnDiv = document.createElement("div")
actionBtnDiv.id = "actionDiv"
actionBtnDiv.classList += "row"
main.append(actionBtnDiv, displayB)

// first Page
const firstBtn = document.createElement("button")
firstBtn.innerHTML = "First Page"
firstBtn.classList += "col-2 mr-auto btn btn-danger"

// previous btn
const prevBtn = document.createElement("button")
prevBtn.innerHTML = '<i class="fa-solid fa-chevron-left"></i>'
prevBtn.classList += "col-2 m-auto btn btn-primary"

// next btn
const nextBtn = document.createElement("button")
nextBtn.innerHTML = '<i class="fa-solid fa-chevron-right"></i>'
nextBtn.classList += "col-2 m-auto btn btn-primary"

// Last Page
const lastBtn = document.createElement("button")
lastBtn.innerHTML = "Last Page"
lastBtn.classList += "col-2 ml-auto btn btn-danger"

actionBtnDiv.append(firstBtn, prevBtn, nextBtn, lastBtn)


// event listeners for action buttons
prevBtn.addEventListener("click", () => {
    if (page_index === 1) {
        alert("First Page Reached")
    }
    else {
        page_index--
        getBooks(page_index)
        paginationNo.innerHTML = `Page <span id="pageNum">${page_index}</span>`
    }
})

nextBtn.addEventListener("click", () => {
    if (page_index === 5) {
        alert("Last Page Reached")
    }
    else {
        page_index++
        getBooks(page_index)
        paginationNo.innerHTML = `Page <span id="pageNum">${page_index}</span>`
    }
})

firstBtn.addEventListener("click", () => {
    if (page_index === 1) {
        alert("First Page Reached")
    }
    else {
        page_index = 1
        getBooks(page_index)
        paginationNo.innerHTML = `Page <span id="pageNum">${page_index}</span>`
    }
})

lastBtn.addEventListener("click", () => {
    if (page_index === 5) {
        alert("Last Page Reached")
    }
    else {
        page_index = 5
        getBooks(page_index)
        paginationNo.innerHTML = `Page <span id="pageNum">${page_index}</span>`
    }
})
