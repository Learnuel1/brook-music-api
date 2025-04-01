# BROOK-MUSIC BACKEND API SERVER FOR DASHBOARD (USER, ARTIST, AND ADMIN)

This is the backend API Server for the BROOK-MUSIC User, Artist, and Admins dashboards.

## STACKS

## Main

1. Node
2. ExpressJS
3. MongoDB
4. ZOD

- Package Manager: `yarn`

## GET STARTED

1. Clone the repo and install dependencies using `npm install`
2. Duplicate the `.env.example.show` and rename one of them ot `.env`
3. Update the `.env with the appropriate values.
4. Use `yarn run dev` to run the server locally
5. **Always create a new branch** when working on a new task/feature you want to work on. Then **submit a pull request** when you're done with the task/feature. `<username>_<type>_<login-auth>` eg `learnuel_fix_auth`, `learnuel_feat_user-model` etc.
6. Follow the commit message convention bellow

## API DOCUMENTATION  
[text](https://documenter.getpostman.com/view/20542554/2sB2cRCj59)

## API BASE URL
[text](https://brook-music-api.onrender.com/api/v1)
## Commit Message Pattern Convention
You're to follow this convention when creating a commit message

```bash
    type(scope?): message
```

Example

```bash
    feat(model): added account model
    fix: update the account model paths
``` 

### Common types

- build
- chore
- ci
- docs
- feat
- fix
- perf
- refactor
- revert
- style
- test

## FOLDER STRUCTURE
```
brook-music/
|
src
├───config
│   └───database
├───controllers
├───logger
├───middlewares
├───models
├───routes
├───service
├───shared
│   ├───middleware
│   └───schema
├───utils
└───views
```