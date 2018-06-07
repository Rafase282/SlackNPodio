# Contributor's Guide

This guide is based off [freeCodeCamp's](https://github.com/freeCodeCamp/freeCodeCamp/blob/staging/CONTRIBUTING.md)

We welcome pull requests from any developers. Follow these steps to contribute:

1. Find an issue that needs assistance by searching for the [Help Wanted](https://github.com/Rafase282/SlackNPodio/issues/labels/help%20wanted) tag.

2. Let us know you are working on it by posting a comment on the issue.

3. Follow the instructions in this guide to start working on the issue.

Remember to feel free to ask for help in our [Dev](https://join.slack.com/t/slacknpodio/shared_invite/enQtMzA3NzczNTA5Nzk0LWM5MzliZjkzZDFhOGI3YWVhZTY1NjkzYzIyODVmNGJlOGZjYTJjY2I0ZTMyMzUwMGMzYzFhODVjM2YyNTUyYjY) Slack channel.

Working on your first Pull Request? You can learn how from this *free* series [How to Contribute to an Open Source Project on GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github)

###### If you've found a bug that is not on the board, [follow these steps](README.md#found-a-bug).

--------------------------------------------------------------------------------
## Quick Reference

|command|description|
|---|---|
| `npm run test` |  runs all JS tests in the system |
| `npm run dev` | runs a local version using nodemon`) |
| `npm run lint` | runs a linter`) |

## Table of Contents

### [Setup](#setup)
- [Prerequisites](#prerequisites)
- [Forking the Project](#forking-the-project)
- [Create a Branch](#create-a-branch)
- [Set Up Linting](#set-up-linting)
- [Set Up MailHog](#set-up-mailhog)
- [Set Up SlackNPodio](#set-up-SlackNPodio)

### [Make Changes](#make-changes)
- [Unpack and Repack](#unpack-and-repack)
- [Challenge Template](#challenge-template)
- [Run The Test Suite](#run-the-test-suite)

### Submit
- [Creating a Pull Request](#creating-a-pull-request)
- [Common Steps](#common-steps)
- [How We Review and Merge Pull Requests](#how-we-review-and-merge-pull-requests)
- [How We Close Stale Issues](#how-we-close-stale-issues)
- [Next Steps](#next-steps)
- [Other Resources](#other-resources)

## Setup
### Prerequisites

| Prerequisite                                | Version |
| ------------------------------------------- | ------- |
| [Node.js](http://nodejs.org)                | `~ ^8.9.3`  |
| npm (comes with Node)                       | `~ ^5`  |

> _Updating to the latest releases is recommended_.

If Node.js or MongoDB is already installed on your machine, run the following commands to validate the versions:

```shell
node -v
npm -v
```

If your versions are lower than the prerequisite versions, you should update.

### Forking the Project

#### Setting Up Your System

1. Install [Git](https://git-scm.com/) or your favorite Git client.
2. (Optional) [Setup an SSH Key](https://help.github.com/articles/generating-an-ssh-key/) for GitHub.

#### Forking SlackNPodio

1. Go to the top level SlackNPodio repository: <https://github.com/Rafase282/SlackNPodio>
2. Click the "Fork" Button in the upper right hand corner of the interface ([More Details Here](https://help.github.com/articles/fork-a-repo/))
3. After the repository (repo) has been forked, you will be taken to your copy of the SlackNPodio repo at <https://github.com/yourUsername/SlackNPodio>

#### Cloning Your Fork

1. Open a Terminal / Command Line / Bash Shell in your projects directory (_i.e.: `/yourprojectdirectory/`_)
2. Clone your fork of SlackNPodio

```shell
$ git clone https://github.com/yourUsername/SlackNPodio.git
```

**(make sure to replace `yourUsername` with your GitHub username)**

This will download the entire SlackNPodio repo to your projects directory.

#### Setup Your Upstream

1. Change directory to the new SlackNPodio directory (`cd SlackNPodio`)
2. Add a remote to the official SlackNPodio repo:

```shell
$ git remote add upstream https://github.com/Rafase282/SlackNPodio.git
```

Congratulations, you now have a local copy of the SlackNPodio repo!

#### Maintaining Your Fork

Now that you have a copy of your fork, there is work you will need to do to keep it current.

##### Rebasing from Upstream

Do this prior to every time you create a branch for a PR:

1. Make sure you are on the `staging` branch

```shell
$ git status
On branch staging
Your branch is up-to-date with 'origin/staging'.
```
If your aren't on `staging`, resolve outstanding files / commits and checkout the `staging` branch

```shell
$ git checkout staging
```

2. Do a pull with rebase against `upstream`

```shell
$ git pull --rebase upstream staging
```

This will pull down all of the changes to the official staging branch, without making an additional commit in your local repo.

3. (_Optional_) Force push your updated staging branch to your GitHub fork

```shell
$ git push origin staging --force
```

This will overwrite the staging branch of your fork.

### Create a Branch

Before you start working, you will need to create a separate branch specific to the issue / feature you're working on. You will push your work to this branch.

#### Naming Your Branch

Name the branch something like `fix/xxx` or `feature/xxx` where `xxx` is a short description of the changes or feature you are attempting to add. For example `fix/email-login` would be a branch where you fix something specific to email login.

#### Adding Your Branch

To create a branch on your local machine (and switch to this branch):

```shell
$ git checkout -b [name_of_your_new_branch]
```

and to push to GitHub:

```shell
$ git push origin [name_of_your_new_branch]
```

**If you need more help with branching, take a look at [this](https://github.com/Kunena/Kunena-Forum/wiki/Create-a-new-branch-with-git-and-manage-branches).**

### Set Up Linting

You should have [ESLint running in your editor](http://eslint.org/docs/user-guide/integrations.html), and it will highlight anything doesn't conform to [freeCodeCamp's JavaScript Style Guide](http://forum.freecodecamp.org/t/free-code-camp-javascript-style-guide/19121) (you can find a summary of those rules [here](https://github.com/freeCodeCamp/freeCodeCamp/blob/staging/.eslintrc)).

> Please do not ignore any linting errors, as they are meant to **help** you and to ensure a clean and simple code base.

### Set Up SlackNPodio

Once you have SlackNPodio cloned, before you start the application, you first need to install all of the dependencies:

```bash
# Install NPM dependencies
npm install
```

Then you need to add the private environment variables (API Keys):

```bash
# Create a copy of the "sample.env" and name it as ".env".
# Populate it with the necessary API keys and secrets:

# macOS / Linux
cp sample.env .env

# Windows
copy sample.env .env
```
Then edit the `.env` file and modify the API keys only for services that you will use.

### Make Changes

This bit is up to you!

#### How to find the code in the SlackNPodio codebase to fix/edit

The best way to find out any code you wish to change/add or remove is using
the GitHub search bar at the top of the repository page. For example, you could
search for a challenge name and the results will display all the files along
with line numbers. Then you can proceed to the files and verify this is the area
that you were looking forward to edit. Always feel free to reach out to the chat
room when you are not certain of any thing specific in the code.

### Run The Test Suite

When you're ready to share your code, run the test suite:

```shell
$ npm test
```

and ensure all tests pass.

### Creating a Pull Request

#### What is a Pull Request?

A pull request (PR) is a method of submitting proposed changes to the SlackNPodio
repo (or any repo, for that matter). You will make changes to copies of the
files which make up SlackNPodio in a personal fork, then apply to have them
accepted by SlackNPodio proper.


#### Important: ALWAYS EDIT ON A BRANCH

Take away only one thing from this document: Never, **EVER**
make edits to the `staging` branch. ALWAYS make a new branch BEFORE you edit
files. This is critical, because if your PR is not accepted, your copy of
staging will be forever sullied and the only way to fix it is to delete your
fork and re-fork.

#### Methods

There are two methods of creating a pull request for SlackNPodio:

-   Editing files on a local clone (recommended)
-   Editing files via the GitHub Interface

##### Method 1: Editing via your Local Fork _(Recommended)_

This is the recommended method. Read about [How to Setup and Maintain a Local
Instance of SlackNPodio](#maintaining-your-fork).

1.  Perform the maintenance step of rebasing `staging`.
2.  Ensure you are on the `staging` branch using `git status`:

        $ git status
        On branch staging
        Your branch is up-to-date with 'origin/staging'.

        nothing to commit, working directory clean

3.  If you are not on staging or your working directory is not clean, resolve
    any outstanding files/commits and checkout staging `git checkout staging`

4.  Create a branch off of `staging` with git: `git checkout -B
    branch/name-here` **Note:** Branch naming is important. Use a name like
    `fix/short-fix-description` or `feature/short-feature-description`.

5.  Edit your file(s) locally with the editor of your choice. To edit challenges, you may want to use `unpack` and `repack` -- see [Unpack and Repack](#unpack-and-repack) for instructions.

4.  Check your `git status` to see unstaged files.

5.  Add your edited files: `git add path/to/filename.ext` You can also do: `git
    add .` to add all unstaged files. Take care, though, because you can
    accidentally add files you don't want added. Review your `git status` first.

6.  Commit your edits: We have a [tool](https://commitizen.github.io/cz-cli/)
    that helps you to make standard commit messages. Execute `npm run commit`
    and follow the steps.

7.  [Squash your commits](http://forum.freecodecamp.org/t/how-to-squash-multiple-commits-into-one-with-git/13231) if there are more than one.

8.  If you would want to add/remove changes to previous commit, add the files as in Step 5 earlier,
    and use `git commit --amend` or `git commit --amend --no-edit` (for keeping the same commit message).

9.  Push your commits to your GitHub Fork: `git push origin branch/name-here`

10.  Go to [Common Steps](#common-steps)

##### Method 2: Editing via the GitHub Interface

Note: Editing via the GitHub Interface is not recommended, since it is not
possible to update your fork via GitHub's interface without deleting and
recreating your fork.

Read the [Wiki
article](http://forum.freecodecamp.org/t/how-to-make-a-pull-request-on-free-code-camp/19114)
for further information

### Common Steps

1.  Once the edits have been committed, you will be prompted to create a pull
    request on your fork's GitHub Page.

2.  By default, all pull requests should be against the SlackNPodio main repo, `staging`
    branch.
    **Make sure that your Base Fork is set to Rafase282/SlackNPodio when raising a Pull Request.**

3.  Submit a [pull
    request](http://forum.freecodecamp.org/t/how-to-contribute-via-a-pull-request/19368)
    from your branch to SlackNPodio's `staging` branch.


4.  In the body of your PR include a more detailed summary of the changes you
    made and why.

    -   If the PR is meant to fix an existing bug/issue then, at the end of
        your PR's description, append the keyword `closes` and #xxxx (where xxxx
        is the issue number). Example: `closes #1337`. This tells GitHub to
        close the existing issue, if the PR is merged.

5.  Indicate if you have tested on a local copy of the site or not.


### How We Review and Merge Pull Requests

SlackNPodio development team routinely go through open pull requests in a process called [Quality Assurance](https://en.wikipedia.org/wiki/Quality_assurance) (QA).

1. If an Issue Moderator QA's a pull request and confirms that the new code does what it is supposed without seeming to introduce any new bugs, they will comment "LGTM" which means "Looks good to me."

2. Another Issue Moderator will QA the same pull request. Once they have also confirmed that the new code does what it is supposed to without seeming to introduce any new bugs, they will merge the pull request.


### How We Close Stale Issues

We will close any issues or pull requests that have been inactive for more than 15 days, except those that match the following criteria:
- bugs that are confirmed
- pull requests that are waiting on other pull requests to be merged
- features that are a part of a GitHub project

### Next Steps

#### If your PR is accepted

Once your PR is accepted, you may delete the branch you created to submit it.
This keeps your working fork clean.

You can do this with a press of a button on the GitHub PR interface. You can
delete the local copy of the branch with: `git branch -D branch/to-delete-name`

#### If your PR is rejected

Don't despair! You should receive solid feedback from the Issue Moderators as to
why it was rejected and what changes are needed.

Many Pull Requests, especially first Pull Requests, require correction or
updating. If you have used the GitHub interface to create your PR, you will need
to close your PR, create a new branch, and re-submit.

If you have a local copy of the repo, you can make the requested changes and
amend your commit with: `git commit --amend` This will update your existing
commit. When you push it to your fork you will need to do a force push to
overwrite your old commit: `git push --force`

Be sure to post in the PR conversation that you have made the requested changes.
