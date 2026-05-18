function getImgUrl (name) {
    if (!name) {
        return new URL(`../assets/books/book-1.png`, import.meta.url).href
    }

    if (/^(data:image\/|https?:\/\/|blob:|\/)/i.test(name)) {
        return name
    }

    return new URL(`../assets/books/${name}`, import.meta.url).href
}

export {getImgUrl}
