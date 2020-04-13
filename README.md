# Booker App [![Build Status](https://travis-ci.com/seng350/seng350f19-project-2-2.svg?token=zwzWrYqjfNb3EPFHTfas&branch=master)](https://travis-ci.com/seng350/seng350f19-project-2-2)

This project is a user curated book library tool to help users keep track of and find new books. It is being completed for SENG350 - Fall 2019.

## Project Milestones

1. [This Document](#seng-350-project---fall-2019)
2. [Milestone 2](docs/Milestone2/Milestone.md)
3. [Milestone 3](#Design-Changes)
4. [Milestone 3.5](#milestone-3.5)
5. [Milestone 6 - A Retrospective](retro.md)

## Getting Started

### Quick Start

The app has been hosted on dockerhub, and can be quickly run with:

```
docker run --rm -d -p 3000:3000 --name=booker_app jasparke/booker-app:latest
```

Alternatively the image can be built from the project repository:

```
cd PROJECT_ROOT
docker build -t booker .
docker run --rm -d -p 3000:3000 --name=booker_app booker
```

### Cloning and Installing Dependencies

```
git clone https://github.com/seng350/seng350f19-project-2-2.git
npm install
npm run build
```

Additional setup is required to use a local Mongo Container. From the project root run:

```
docker-compose up
docker-compose build
```

This sets up the docker environment for mongo which stores its data in `./mongo_data`. An initialized mongo_data folder is available [here](https://drive.google.com/open?id=17OMD2SEgxqaIn6xZEO2sZCOwULOdjLsu) for development purposes.

### Starting the Development Server

A development server with auto-compiling and reloading on src updates can be started using:

```
npm run dev
```

### Starting and Stopping the MongoDB server

For development, the MongoDB server defined by docker-compose can be controlled using npm scripts:

```
npm run mongo:start
npm run mongo:stop
```

### Run Unit Tests

Tests contained in the `./test` directory as `*.test.ts` can be run with:

```
npm run test
```

## Design Changes

Added CatalogueModel as well as a (not yet implemented) CollectionsModel in order to extract logic out of the controllers such as creation and pagination

Catalogue GetBookData was found through eslint to be identical to ChangeViewables with page 1 requested, thus the GetBookData and ChangeViewables functions were combined into one function that defaults to page 1 if no page number was requested. However more parameters may needed to be added later for further browsing control

Implemented collageView in a way that allows for the data to be overridden easily while keeping the layout the same by a potential collectionsView, collectionView, and/or catalogueView. This was done as a precaution since it may be too complicated to structure the data in a way where all three structures are viewed with the same view.

## Milestone 3.5

Performance improvements to CatalogueModels to meet quality attribute around performance. Corrected all tests to function correctly with new database client and calls. Fixed bugs in Catalogue and Book models that was causing double insertions.

## Implemented User Stories

- Add New Books
- Browsing Catalogue
- User Authentication
- Book Ratings and Reviews

## Milestone 4

Features implemented in this milestone: Create Collections, Write comments/Book Discussion, Report inappropriate reviews and Admins allowed to delete inappropriate reviews. Updated and finalized Ratings and Reviews for each book.

## Implemented User Stories

- 1. Add new books
     Users can add new/non-existing books to the catalogue. Users can click on the Add Book tab at the top of the screen and enter book information such as Title, Author, Image Source, ISBN and Synopsis and click Submit. Once submitted, the book should be saved in the database and can be found in the Catalogue.
- 2. Rate books
     Users can rate books. To rate a book, users can go to the catalogue and select any book they want to rate. Once on a specific book's page, users can select between 1-5 stars and click on the Rate button. Based on all the user ratings, the average rating of the book will be updated(which is visible at the top of the screen). Users can also update their rating for a book and this will be reflected in the average rating.
- 3. Writing reviews
     Users can write reviews for books. Users can click on the Add Review tab. Here, users can enter the Book title, Review and Rating and click Submit. Once added, all the book reviews should be visible in the Reviews tab.
- 4. Browsing Catalogue
     Users can browse the catalogue for new books. Users can click on the Catalogue tab and go through all the books.
- 5. Create collections
     Users can create collections for their books like "Favourites" and "Want to Read". To create a collection, users should click on the Collections tab and type a name for their new collection here. Users can go to the catalogue, select any book, and then they get an option to add the book to the collection they've created. Users can view other people's collections(in this iteration) for inspiration but not update them.
- 6. Book Discussion/Write Comments
     Users can write comments for each book. For each book, users can write their comments and all the comments will be visible in descending order of their dates.
- 7. Report inappropriate reviews
     Users can report inappropriate reviews. In the review section, users can report reviews but clicking on the report button.
- 8. Admin Abilities
     Admins can view and delete reported reviews to maintain quality of content. Once an admin logs in, they have the permission to delete reviews when they click on the admin tab.

## QAS Testing
1. Catalogue performance test was integrated into the test suite using a variable that was set to true after the controller function that loads the catalogue was called as well as a timeout that called the expected assertion after 750ms regardless of if the controller function had finished.
2. Code coverage was tested by including a threshold of 75% in jest configuration for the models folder. This ensured the test suite would fail if code coverage was not met, even if all tests were passing.
3. Code passing all build tests was implemented by having travis CI run the test suite on opening a pull request and displaying/notifying of failure if the test suite fail.
## Final Design - Views, Controllers, and Models

A more thorough walkthrough and description of all implemented models, views, and controllers for our application is shown below.
![MVC Diagram](docs/Milestone2/assets/MVC%20M4.jpg)
This final design diagram outlines the interactions of different controllers with their respective views, as well as showing how a view can interact with a seperate controller when necessary.

## M4 - Final Design Implementation and Changes

Implemented the following models, views and controllers for the final design:

1. CollectionsModel - To allow users to view their own collections and get all collections.
2. CollectionModel - To allow users to add books to their own collections.This was updated to allow for user authentication so users can only update their own collections but view all collections.
3. CommentModel - To allow users to add comments for each book.
4. ReviewCollectionModel - To allow users to see all the reviews in one place. This is a new change after Milestone 2 since we needed to find a different way to save the reviews that were being added.
5. ReviewModel - To allow users to add reviews for books.
6. RatingModel - To allow users to view the Rating for each book and add their own ratings.
7. AdminModel - To maintain platform quality, admins are given permissions to get and delete all reported reviews.
8. 404 View - Implemented a view for users when they view non-existant pages.
9. CollectionsView - To view all the collections in the system.
10. Controller testing - Controllers were not tested heavily as using the MVC framework they should have as little logic as possible. Furthermore controllers often get indirectly tested while applying other changes such as styling.
11. model Ids - Various model Ids were changed from manually generated based on the data base collection count to using the auto generated mongoDb ids, this was to prevent race conditions and deletion concerns related that could have resulted in duplicate ids.

## M4 - Reports

Code coverage
![Code Coverage](docs/Code%20Coverage.PNG)

Static Analysis

![Static Analysis](docs/Static%20Analysis.PNG)

## Other Potential App Ideas

- Day Planner Application
- Game Leaderboard and Stat Tracker
- Chat/Forum Application

## About

Our randomly generated group name: **Extravagant Dragon Monkeys**

- Jason Parker - V00857251
- Jeremy Kormish - V00775548
- Purvika Dutt - V00849852
