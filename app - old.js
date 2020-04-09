const API = require("./lib/API");
const readlineSync = require("readline-sync");

function calculateAverageRating(book) {
  let total = 0;
  for (const review of book.reviews) {
    total += parseInt(review.rating);
  }
  return total / book.reviews.length;
}

function displayBooksSummary(books) {
  for (const book of books) {
    // if ths book has some reviews
    if (book.reviews.length > 0) {
      console.log(
        `--- ${book.id}: ${book.title}, rating: ${calculateAverageRating(book)}`
      );
    } else {
      console.log(`--- ${book.id}: ${book.title}, no reviews yet!`);
    }
  }
}

function displayBookDetails(book) {
  console.log(`-- ${book.title} --`);
  for (const review of book.reviews) {
    console.log(`${review.content} - Rating: ${review.rating}`);
  }
}

function chooseABook(books) {
  // display each ID and title
  for (const book of books) {
    console.log(`--- ${book.id}: ${book.title}`);
  }

  // user inputs an ID number
  const bookChoice = readlineSync.question(
    "Which number book would you like to review? "
  );
  const book = API.read("books", bookChoice);

  // if the API can't find that book
  // run chooseABook again
  if (book !== undefined) {
    return book;
  } else {
    console.log("Ooops we can't find that book!");
    return chooseABook(books);
  }
}

function mainMenu() {
  console.log("----------------");
  console.log("---- AMAZON ----");
  console.log("----------------");
  console.log("1. View our books");
  console.log("2. Leave a review");
  console.log("----------------");

  const choice = readlineSync.question("Please choose an option ");

  if (choice === "1") {
    console.log("-----------------");
    console.log("- ALL OUR BOOKS -");
    console.log("-----------------");

    // get all books
    const books = API.read("books");
    displayBooksSummary(books);

    // return to main menu
    mainMenu();
  } else if (choice === "2") {
    console.log("-----------------");
    console.log("- CHOOSE A BOOK -");
    console.log("-----------------");

    const books = API.read("books");
    const book = chooseABook(books);
    displayBookDetails(book);

    // Input review details
    const rating = readlineSync.question("What is your rating? ");
    const content = readlineSync.question("Please write your review ");

    // add the new review to the book reviews
    book.reviews.push({
      rating: rating,
      content: content
    });

    // update the book in the API
    API.update("books", book);

    console.log("----------------------------");
    console.log("Thanks for leaving a review!");
    console.log("----------------------------");

    // return to main manu
    mainMenu();
  } else {
    console.log("Sorry we didn't recognise that choice!");
    mainMenu();
  }
}

mainMenu();
