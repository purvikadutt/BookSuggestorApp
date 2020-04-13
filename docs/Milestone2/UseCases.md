# Milestone 2: Use Cases
An overview of the use cases relevant to the application. 

## Use Cases
As a User:
1. Add missing Book to the Catalogue
   1. User requests view of catalogue
   2. System loads books
   3. User determines book is missing
   4. User navigates to create book page
   5. User Fills out form
   6. User submits
   7. System performs form validation
   8. System stores new book in Database
   9.  Catalogue is updated
2. Create a new Collection
   1. User requests view of adding a collection
   2. System loads edit collection view with default values
   3. User renames collection
   4. User clicks create collection
   5. System performs validation
   6. System saves new collection to database
   7. UI informs user they can now go to a book page and select add to collection to add books 
3. Add Book to a Collection
   1. User requests view of a book
   2. System loads book info
   3. User selects option add to collection
   4. System loads available collections into a dropdown menu
   5. User selects collection from dropdown and clicks confirm
   6. System saves book to the selected collection
   7. System displays success message
4. Remove Book from a Collection
   1. User requests view of all my collections
   2. System loads all collections info
   3. User clicks edit collection button on corresponding collection
   4. System loads edit collection view
   5. User clicks delete button on corresponding book
   6. UI displays delete confirmation warning
   7. User selects yes
   8. System removes book from the collection
   9. System loads updated collection view
5. Delete a Collection
   1. User requests view of all my collections
   2. System loads all my collections info
   3. User clicks delete button on corresponding collection
   4. UI displays delete confirmation warning
   5. User selects yes
   6. System deletes the collection
   7. System loads updated all my collections info
6. Browse Collections
   1. User requests view of all collections (includes other users)
   2. System loads all collections info (first 20)
   3. User clicks next page button
   4. System loads all collections info (next 20)
7. View Details of a Book (Comments, Reviews, Ratings, Info)
   1. User requests view of catalogue
   2. System loads books
   3. User clicks on a book
   4. System loads book info
8. Comment on a Book
   1. User requests view of a book
   2. system loads the book
   3. User clicks add comment
   4. UI enables the comment field
   5. User types a comment
   6. User clicks submit
   7. System validates the comment
   8. System adds the comment to the book
   9. System loads updated book info
9.  Provide a Rating on a Book
    1. User requests view of a book
    2. system loads the book
    3. User selects rating value (1-5)
    4. User clicks submit rating
    5. System adds rating to the book
    6. System recalculates total rating
    7. System loads updated book info
10. Write a Review about a Book
    1. User requests view of a book
    2. system loads the book
    3. User clicks add review
    4. UI enables the review field
    5. User types a review
    6. User selects rating value
    7. User clicks submit
    8. System validates the review text
    9. System adds the review and rating to the book
    10. System loads updated book info
11. Browse the Catalogue for Books
    1. User requests view of catalogue
    2. System loads view of catalogue
12. Report a Comment
    1. User requests view of a book
    2. System loads the book
    3. User clicks report on a corresponding comment
    4. UI displays confirmaion popup
    5. User selects yes
    6. System adds report to the commen
    7. System displays success message
13. Report a Review
    1. User requests view of a book
    2. System loads the book
    3. User clicks report on a corresponding review
    4. UI displays confirmaion popup
    5. User selects yes
    6. System adds report to the review
    7. System displays success message
14. Register for the site
    1. User requests view of registration
    2. System loads registration page
    3. User fills out form
    4. System performs validation on form
    5. System adds user to database
    6. System logs user in
    7. System loads catalogue
15. Login to my account
    1. User requests view of login
    2. System loads view of login
    3. User fills out credentials
    4. System authenticates credentials
    5. System loads view of catalogue
16. Logout of my account
    1. User is logged in
    2. User clicks logout button
    3. System logs user out
    4. System loads view of login
    
As an Admin:
1. Review reported Comments for deletion
   1. Admin checks for flagged Comments
   2. If comment is inappropriate, admin deletes the comment.
   3. If comment is not inappropriate, admin unflags the comment. 
   4. Database is updated.
   5. Model is ready with changes.
2. Review reported Reviews for deletion
   1. Admin checks for reported reviews.
   2. If review is inappropriate, admin deletes the review.
   3. Database is updated.
   4. Model is updated with changes.
3. Change a User's name
   1. Admin requests user information.
   2. System loads user information. 
   3. Admin clicks edit user name. 
   4. Admin can enter new user name.
   5. Admin clicks save. 
   6. System saves the new information.
   7. Database is updated with this information. 
4. Delete a User
   1. Admin requests user information.
   2. System loads user information. 
   3. Admin clicks in the delete account button for the user.
   4. UI displays delete confirmation warning. 
   5. Admin selects yes. 
   6. System deletes the user. 
   7. Database is updated.
5. Register a new User
   1. Admin queries database for all users.
   2. Admin clicks on register new User.
   3. Admin enters information for new user. 
   4. Admin saves user information.
   5. New user is saved in the database. 
6. Update a Book
   1. Admin requests book information.
   2. System loads book information. 
   3. Admin clicks edit book information. 
   4. Admin enters new information and clicks save. 
   5. System saves the new information.
   6. Database is updated with this information. 
