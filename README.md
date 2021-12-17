# Steak Chat App

## Prerequisites:

-   Node.js LTS version

## Config local dev enviroment

-   Swap content of `frontend/src/.env.example` with `frontend/src/.env`

-   Before opening a pull request, please swap back

## Start local dev environment

Install npm dependencies:

```zsh
yarn
```

Then you can use following command to start dev environment for frontend:

```zsh
yarn start
```

Then you can go to:

-   Frontend

    -   https://localhost:3000/auth/signin - Signin Page
    -   https://localhost:3000/auth/signup - Signup Page
    -   https://localhost:3000/servers/1 - Example Chat Server
    -   Change between channels on sidebar to see its messages

-   Live Deploy at
    -   https://steak-chat-app.netlify.app/

## Repository Structure (top-level directories)

-   frontend
    -   All of the front-end code.

# Contributing

Please follow below guideline when contributing to this project

-   Conventional commit: https://www.conventionalcommits.org/en/v1.0.0/
