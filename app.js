const API = require("./lib/API");
const readlineSync = require("readline-sync");
const chalk = require("chalk");


function displayPostsSummary(posts) {
  for (const post of posts) {
    console.log(` ${post.id}: ${post.title}        
        Popularity: ${parseInt((post.upvotes * 100) / (post.downvotes + post.upvotes))}% upvoted
        Total comments: ${post.comments.length}
    ----------------------------`);
  }
}

function displayPostDetails(post) {
  console.log(`-- POST NUMBER ${post.id} `);
  console.log(` Title: ${post.title} `);
  console.log(` Category: ${post.category} `);
  console.log(` Upvotes: ${post.upvotes} `);
  console.log(` Downvotes: ${post.downvotes} `);
  console.log(` Popularity: ${parseInt((post.upvotes * 100) / (post.downvotes + post.upvotes))}% upvoted `);
  console.log(` Comments: see what ${post.comments.length} people said about this post `);
  for (const review of post.comments) {
    console.log(`---${review}`);
  }
  console.log("------------------------");
  console.log('');
}

function displayComments(post) {
  console.log(`-- Title: ${post.title} `);
  for (let i = 0; i < post.comments.length; i++) {
    console.log(`-- Comment ${i + 1}: ${post.comments[i]}`);
  }
  console.log("----------------------");
  console.log('');
}


function chooseAPost(posts) {
  // display each ID and title
  for (const post of posts) {
    console.log(`--- ${post.id}: ${post.title}`);
  }
  console.log('');
  // user inputs an ID number
  const postChoice = readlineSync.question(chalk.hex('#b2a1e1')("Choose a post: "));
  const post = API.read("posts", postChoice);

  // if the API can't find that post
  // run chooseAPost again
  if (post !== undefined) {
    return post;
  } else {
    console.log("Ooops we can't find that post!");
    return chooseAPost(posts);
  }
}

function vote() {
  console.log(chalk.hex('#93ecb7')("-----------------"));
  console.log(chalk.hex('#93ecb7').bold("----- VOTE ------"));
  console.log(chalk.hex('#93ecb7')("-----------------"));
  console.log('');

  const posts = API.read("posts");
  const post = chooseAPost(posts);
  console.log("");
  displayPostDetails(post);

  console.log("");
  console.log(chalk.hex('#b2a1e1')("Would you like to upvote or downvote it?"));

  //limit choice to 2 items
  const UpDownVote = ["Upvote", "Downvote"],
    index = readlineSync.keyInSelect(UpDownVote,(chalk.hex('#b2a1e1')("Key in your choice: ")));

  if (index === 0) {
    post.upvotes = post.upvotes + 1;
    API.update("posts", post);

  console.log("----------------------------------");
  console.log("----Your upvote was submitted!----");
  console.log("--------------------------------");
  console.log("");

} else if (index === 1) {
  post.downvotes = post.downvotes + 1;
  API.update("posts", post);
  console.log("------------------------------------");
  console.log("----Your downvote was submitted!----");
  console.log("------------------------------------");
  console.log("");
}
else {
  nextChoice();
}
  nextChoice();
}


function leaveComment() {
  console.log('');
  console.log(chalk.hex('#93ecb7')("-----------------"));
  console.log(chalk.hex('#93ecb7').bold("-LEAVE A COMMENT-"));
  console.log(chalk.hex('#93ecb7')("-----------------"));
  console.log('');

  const posts = API.read("posts");
  const post = chooseAPost(posts);
  displayPostDetails(post);
  console.log('');

  const comment = readlineSync.question(chalk.hex('#b2a1e1')("Please write your comment: "));
  console.log(" ");

  // add the new comment to selected post
  post.comments.push(comment);

  // update the post in the API
  API.update("posts", post);

  console.log("-----------------------------");
  console.log("Thanks for leaving a comment!");
  console.log("-----------------------------");

  nextChoice();
}



function deleteComment() {
  console.log(chalk.hex('#93ecb7')("--------------------"));
  console.log(chalk.hex('#93ecb7').bold("--DELETE A COMMENT--"));
  console.log(chalk.hex('#93ecb7')("--------------------"));
  console.log('');

  const posts = API.read("posts");
  const post = chooseAPost(posts);
  console.log("");
  displayComments(post);

  const comment = readlineSync.question(chalk.hex('#b2a1e1')("Which comment would you like to delete? "));
  console.log(" ");

  //ask user confirmation
  const choiceYN = readlineSync.keyInYN(chalk.hex('#e46874')(`Are you sure you want to delete it?`));

  if (choiceYN === true) {
    post.comments.splice(comment - 1, 1);

    API.update("posts", post);

    console.log("-----------------------------");
    console.log("The comment was successfully deleted!");
    console.log("-----------------------------");

   // if user doesn't key in Y, ask what to do next
  } else {
    console.log("");
    nextChoice();
  }

  nextChoice();
}



function createPost() {
  console.log(chalk.hex('#93ecb7')("-----------------"));
  console.log(chalk.hex('#93ecb7').bold("---CREATE A POST---"));
  console.log(chalk.hex('#93ecb7')("-----------------"));
  console.log(" ");
  console.log("---Fill in the details below---");
  console.log(" ");

  //ask user to input post details
  const newPostTitle = readlineSync.question(chalk.hex('#b2a1e1')("Title: "));
  const newPostCategory = readlineSync.question(chalk.hex('#b2a1e1')("Category: "));
  console.log(" ");

  //ask user confirmation
  const choiceYN = readlineSync.keyInYN(chalk.hex('#e46874')(`-- Are you sure you want to add this post? `));
  if (choiceYN === true) {
    let newPost = {
      title: newPostTitle,
      upvotes: 0,
      downvotes: 0,
      comments: [],
      category: newPostCategory,
    };

    API.create("posts", newPost);

    console.log("-----------------------------");
    console.log("Your post was successfully added!");
    console.log("-----------------------------");
    console.log("");

    // if user doesn't key in Y, ask what to do next
  } else {
    console.log("");
    nextChoice();
  }

  nextChoice()
}


function random() {
  const posts = API.read("posts");
  //get id from each post and store them in new array
  let newArray = [];
  posts.forEach((post) => newArray.push(post.id));

  //pick a random ID
  let randomId = newArray[Math.floor(Math.random() * newArray.length)];

  //match random ID to ID of existing posts to get post details
  for (const post of posts) {
    if (randomId === post.id) {
      console.log('');
      console.log(chalk.hex('#93ecb7')("----------------------------------"));
      console.log(chalk.hex('#93ecb7')("----------CHECK THIS OUT----------"));
      console.log(chalk.hex('#93ecb7')("- A random pick for you to enjoy -"));
      console.log(chalk.hex('#93ecb7')("----------------------------------"));
      console.log("");
      displayPostDetails(post);
    }
  }
  nextChoice();
}

function mostPopular() {
  const posts = API.read("posts");
  // get upvotes values from each post and store them in new array
  let newArray = [];
  posts.forEach((post) => newArray.push(post.upvotes));
  let maxUpvotes = Math.max(...newArray);

  // match new array values with post details
  for (const post of posts) {
    if (maxUpvotes === post.upvotes) {
      console.log('');
      console.log(chalk.hex('#93ecb7')("----------------------------------"));
      console.log(chalk.hex('#93ecb7')("---------MOST POPULAR POST--------"));
      console.log(chalk.hex('#93ecb7')("----------------------------------"));
      console.log("");
      displayPostDetails(post);
    }
  }
nextChoice();
}

function browseCat() {
  console.log('');
  console.log(chalk.hex("#93ecb7")("-----------------"));
  console.log(chalk.hex("#93ecb7").bold("---CATEGORIES---"));
  console.log(chalk.hex("#93ecb7")("-----------------"));
  const posts = API.read("posts");

  // get unique category values to new array
  let newArray = [];
  posts.forEach((post) => newArray.push(post.category));

  let filteredArray = newArray.filter(
    (el, index) => newArray.indexOf(el) === index
  );

  // ask user to key in category
  const chosenCategory = readlineSync.keyInSelect(
    filteredArray,
    chalk.hex("#b2a1e1")("Select a category: "),
    { cancel: "Exit" }
  );

  // match chosen category to post category value
  for (const post of posts) {
    if (chosenCategory === 0 && filteredArray[0] === post.category) {
      displayPostDetails(post);
      nextChoice();
    } else if (chosenCategory === 1 && filteredArray[1] === post.category) {
      displayPostDetails(post);
      nextChoice();
    } else if (chosenCategory === 2 && filteredArray[2] === post.category) {
      displayPostDetails(post);
      nextChoice();
    } else if (chosenCategory === 3 && filteredArray[3] === post.category) {
      displayPostDetails(post);
      nextChoice();
    } else if (chosenCategory === 4 && filteredArray[4] === post.category) {
      displayPostDetails(post);
      nextChoice();
    } else {
      nextChoice;
    }
  }
}

// Ask user next move - stay in app or exit //
function nextChoice() {
  let stayOrLeave = ["Back to Main Menu"];
  console.log('');
  console.log(chalk.hex('#93ecb7')("What would you like to do next?", ));
  const next = readlineSync.keyInSelect(stayOrLeave,(chalk.hex('#b2a1e1')("Key in your choice: ")),{cancel: 'Exit'});

  if (next === 0) {
    mainMenu();
  } else {
    console.log('');
    console.log(chalk.bgHex('#c22231').bold('           Goodbye!           '));
    console.log('');
    process.exit();
  }
}


const menu = [
  "View all posts",
  "View most popular post",
  "View post by category",
  "Vote for a post",
  "Create a post",
  "Leave a comment",
  "Delete a comment",
  "Surprise me!"
];


function mainMenu() {
  console.log('');
  console.log(chalk.bgHex('#7de8a9')("------------------"));
  console.log(chalk.bgHex('#7de8a9').black.bold("----- REDDIT -----"));
  console.log(chalk.bgHex('#7de8a9')("------------------"));
  console.log("------------------");

  const choice = readlineSync.keyInSelect(menu, chalk.hex('#b2a1e1')("Please choose an option "), {cancel: 'Exit'});

  if (choice === 0) {
    console.log(chalk.hex('#93ecb7')("-----------------"));
    console.log(chalk.hex('#93ecb7').bold("--- ALL POSTS ---"));
    console.log(chalk.hex('#93ecb7')("-----------------"));
    console.log('');
    // get all posts
    const posts = API.read("posts");
    displayPostsSummary(posts);
    //ask user what to do next
    nextChoice();

  } else if (choice === 1) {
    mostPopular();
  } else if (choice === 2) {
    browseCat();
  } else if (choice === 3) {
    vote();
  } else if (choice === 4) {
    createPost();
  } else if (choice === 5) {
    leaveComment();
  } else if (choice === 6) {
    deleteComment();
  } else if (choice === 7) {
    random();
    
  } //Exit program
    else{
    console.log('');
    console.log('------------------------');
    console.log(chalk.bgHex('#c22231').bold('        Goodbye!        '));
    console.log('------------------------');
    console.log('');
    process.exit();

  }

}

mainMenu();