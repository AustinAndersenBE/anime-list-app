# MyAnimeList

This project is a full-stack web application built using a combination of modern technologies and libraries. It is designed to provide a seamless user experience, with a focus on performance, security, and maintainability. 
It is deloyed on https://my-anime-list-z6is.onrender.com using Render.

Technologies/API Used
- React: A JavaScript library for building user interfaces.
- React Hook Form: A lightweight and efficient library for managing form states in React.
- Prisma: An open-source database toolkit used for database access, migrations, and administration.
- Passport.js: An authentication middleware for Node.js, used to authenticate requests.
- Node.js: A JavaScript runtime built on Chrome's V8 JavaScript engine, used for building the server-side of the application.
- Express: A minimal and flexible Node.js web application framework, providing a robust set of features for web and mobile applications.
- JWT (JSON Web Tokens): A compact, URL-safe means of representing claims to be transferred between two parties.
Project Structure
- Jikan Anime API

The project is structured into two main parts: the client-side, built with React and React Hook Form, and the server-side, built with Node.js, Express, and Prisma. Passport.js and JWT are used for handling authentication.

The client-side is organized into components, each representing a part of the user interface. The server-side is organized into routes, each handling a specific type of request.

# Features

- Users can create accounts and be authenticated via JWT in HTTP-only cookies.
- Can see Top Airing Anime via Jikan External API and filter the results by page and limit
- Once logged in, can search for anime to add to their favorites list
- Can sort their favorites list by submitting ratings from 0 to 10
- Can create posts about the anime in their favorites list
- Users can follow others users to see their favorites list and posts

# Standard user flow
- Logging in or Sign Up with the buttons
- Click on Airing Anime to see the top Airing Anime
- Search for Anime using the search bar to add to their Favorites list with the star icon
- In the favorites list users can click on the pencil icon to write posts about the anime
- Users can follow users by clicking on the Following button
- You can view a User's favorite list and their list of posts as well
