# Project Setup
## 1. Clone the repository
### GitKraken
I honestly think using [GitKraken](https://www.gitkraken.com) is the most intuitive way of working with git.  
Pushing buttons may not be as fast as typing commands but unless you know your way really well around git, GitKraken's UI is just irreplacable.  
As a bonus, it handles the authentication for you by using GitHub's OAuth.
### Command Line
Starting this august, GitHub has discontinued password authentication. Since then, cloning by SSH is the simpler way to go.  
You'll need to create an SSH key and add it to your GitHub account. [Here](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/checking-for-existing-ssh-keys) is a guide by GitHub on how to do that.  
Then, you need can clone the repository by executing `git clone git@github.com:WATsonDSD/WATson.git` on your shell.
## 2. Install node and npm
Everyone probably already has npm installed but [here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) is the official guide anyway.
## Install the dependencies
The project contains an **npm package** in the subdirectory `front-end` which lists all of its dependencies. All you need to do is navigate to `front-end` and run `npm install`.  

Now we're ready to run the project.  

### A word on the repository structure 
The git repository contains two subfolders, `back-end` and `front-end`. These are meant to be separate npm packages.  
`back-end` is empty for now and probably will be for a while. We'll implement most of it in CouchDB. Instructions on setting up CouchDB will be added here as soon as we start using it.  
For now, what we refer to as "the project" is all inside `front-end`, except for the git-related configurations. Hence, when you run npm scripts, you should run them with `front-end` as the working directory.

## 3. Run the project
Navigate to `front-end` and run `npm start`. This will compile everything and start serving on `localhost:3000`.

# Development Environment
The project setup doesn't restrict you to any development environment at all! You can code with whatever tool you choose.  
However, since the most of the team uses VSCode, it may be easier to get help on problems you may face in VSCode.

Also, I've written [a short guide](https://github.com/WATsonDSD/WATson/pull/4) about how to set-up your environment to get along with ESLint.  
You don't _need_ to do that setup but life will be much easier if you do.

