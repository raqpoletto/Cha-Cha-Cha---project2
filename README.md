# Project Name



<br>



## Description

A central location for any salsa dancer to learn and practice their sick moves 💃🏻🕺🏻


<br>

## User Stories

- **404** - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault
- **500** - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault
- **sign up** - As a user I want to sign up on the web page and enter my salsa level so I can more easily find videos for me
- **login** - As a user I want to be able to log in on the web page so that I can get back to my account
- **logout** - As a user I want to be able to log out from the web page so that I can make sure no one will access my account
- **landing page** - As a user I want to be able to access the landing page where I can see a "salsa video of the day", and access the other parts of the web page
- **videos** - As a user, I want to navigate to the "videos" page to see all beginner, intermediate, and advanced media. 
- **upload** - As a user, I want to have a form where I can upload my own videos to the website
- **search** - As a user, I want to be able to search for a video by title, duration, and level
- **your favorites** - As a user I want to be able to "favorite" a video and view it at a later time.
- **edit user** - As a user I want to be able to edit my profile.
- **(BONUS) Events** - As a user, I want to be able to view and create salsa events on the web page so that I can practice my cha-cha-chaaa



<br>



## Server Routes (Back-end):



| **Method** | **Route**                          | **Description**                                              | Request  - Body                                          |
| ---------- | ---------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------- |
| `GET`      | `/`                                | Main page route.  Renders home `index` view. This is the landing page                |                                                          |
| `GET`      | `/login`                           | Renders `login` form view.                                   |                                                          |
| `POST`     | `/login`                           | Sends Login form data to the server.                         | { email, password }                                      |
| `GET`      | `/signup`                          | Renders `signup` form view.                                  |                                                          |
| `POST`     | `/signup`                          | Sends Sign Up info to the server and creates user in the DB. | {  email, password , level }                                    |
| `GET`      | `/edit-profile`            | Private route. Renders `edit-profile` form view.             |                                                          |
| `PUT`      | `/edit-profile`            | Private route. Sends edit-profile info to server and updates user in DB. | { email, password, name , level, picture , bio } |
| `GET`      | `/videos`               | Private route. Renders the page with all beginner, intermediate, and advanced videos                  |                                                          |
| `GET`      | `/videos/upload`               | Private route. Renders a page with a form                  |                                                          |
| `POST`      | `/videos/upload`               | Private route. Sends the form for users to upload a video                  |  { title , level , description , uploadVideo}                                                        |
| `PUT`      | `/videos/:videoID/edit`               | Private route. Allows a user to edit a video that they have uploaded                  |                                                          |
| `DELETE`      | `/videos/delete/:videoID`               | Private route. Allows a user to delete a video that they have uploaded                  |                                                          |
| `GET`      | `/videos/search`               | Private route. Render a page where users can search for salsa videos by title, duration, and level (dropdown list)                  |                                                          |
| `POST`      | `/videos/search`               | Private route. Sends the form to the web page and returns the search results                  |    { title , duration , level }                                                      |
| `GET`     | `/favorites/`              | Private route. Renders a page with the list of your favorite videos     |                                  |
| `POST`     | `/favorites/:videoId`              | Private route. Sends the "favorited" videos from the `/videos` page to the `/favorites` page     |                                  |
| `DELETE`     | `/favorites/:videoId`              | Private route. Removes a given video from the users' "favorites" list      |                                  |







## Models

User model

```javascript
{
  name: String,
  email: String,
  password: String,
  picture: String,
  level: [enum: Beginner, Intermediate, Advanced],
  favorites: [videoID],
}

```

Video model

```javascript
{
  title: String,
  level: [enum: Beginner, Intermediate, Advanced],
  description: String,
  duration: enum(Short(0-1.5 minutes), Medium (1.5 - 3 minutes), Long(3-10minutes), Very Long(10+ minutes)),
  video: String
}

```




<br>

## API's


<br>


## Packages



<br>



## Backlog

[See the Trello board.](--insert trello link--)



<br>



## Links



### Git

The url to your repository and to your deployed project

[Repository Link]()

[Deploy Link](https://project2i.herokuapp.com/)



<br>



### Slides

The url to your presentation slides

[Slides Link](--insertlinkhere--)

### Contributors
FirstName LastName - [`<github-username>`](--insert github link here--) - [`<linkedin-profile-link>`](--insert linkedin profile link here--)

FirstName LastName - [`<github-username>`](--insert github link here--) - [`<linkedin-profile-link>`](--insert linkedin profile link here--)
