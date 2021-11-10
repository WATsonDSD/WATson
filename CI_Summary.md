### Rules about pushing to master
Thou shalt:
- **Don't push to master!**
- **Don't merge to master without a PR!**
- **Assign a single person to review each PR!**, take a guess if you don't know who that should be.  
- **Review your PR's as soon as you can!**
- **Be as thorough as you can!**
- **Write more test cases then you think you need to!**
- **Make sure to write a test case for each bugfix!**

### Some explanation on CI

Here's my attempt on summarizing "the CI and QA stuff" copied from Slack.
***
About writing the tests themselves, you can read through [this](https://jestjs.io/docs/getting-started) guide. And I’ll try to clarify the rest here.

We have two important npm scripts:  
- `npm run test` uses Jest to run the tests found in `*.test.ts / *.test.tsx` files. (In an indirect manner, I myself don’t know how react-scripts test does this).
- `npm run lint` uses ESLint to check for syntax/styling issues. The styling rules are found in `.eslintrc`.  
-
You can run both of these scripts on your machine but keep in mind that these are scripts defined on `front-end/package.json`. Hence to run those you may need to `cd front-end`.  
ESLint and Jest are in the `front-end` npm package’s dependencies (in `front-end/package.json`) so they will be installed in `front-end/node_modules` once you run `npm install`, you don’t need to install any dependencies manually to run these.  

***

`.github/workflows/main.yml` specifies a workflow called `CI` , which builds the project and then runs both of these scripts when you create a PR to branch `main`. If any of these scripts “throw errors”, you will see a :x: next to your PR. If they both run fine, you will see a :white_check_mark:.

***

To make working with ESLint easier, I have made a couple changes to my local development environment and I strongly suggest everyone to do the same, it will be very annoying otherwise. Namely:  
- I’ve written a **pre-commit hook** that runs every time you try to commit something **to your local repository** so that you can keep your local copy ESLint compliant. This way, you don’t face any major surprises when you create a PR.
- I’ve installed the **ESLint VSCode Extension** to show ESLint errors as I edit the code. (This also enables you to do `CMD + Shit + P > ESLint: Fix all auto-fixable problems` any time.)
- I’ve changed my VSCode workspace settings to fix the auto-fixable problems every time I save a file.

How to do all three of those should be explained well in [the PR description](https://github.com/WATsonDSD/WATson/pull/4)
