# To-Do List Application

A simple command-line to-do list application built with JavaScript and Node.js. I created this project to brush up on my JavaScript skills and refresh my understanding of object-oriented programming, classes, and user input handling.

## Features

- Add tasks with a title, description, due date, and status
- View all tasks in a numbered list
- View the details of individual tasks
- Edit existing tasks
- Delete tasks
- Reorganize tasks by moving them up, down, or to the top or bottom of the list
- Validate user input, including dates and task selections

Each task has a status of `New`, `Working on`, or `Finished`.

## Requirements

- [Node.js](https://nodejs.org/) (version 18 or later recommended)
- A terminal or command prompt

No additional packages are required.

## Setup and Installation

1. Download or clone this repository to your computer.
2. Make sure Node.js is installed. To check, open a terminal and run:

   ```bash
   node --version
   ```

   If a version number appears, Node.js is installed.

3. Open a terminal in the project folder containing `todo.mjs`.

## How to Run

Run the following command in your terminal:

```bash
node todo.mjs
```

The application will display a menu with options for managing your to-do list. Enter the number corresponding to the action you want to perform and follow the prompts.

Choose **Exit** when you are finished.

## Technologies Used

- JavaScript (ES modules)
- Node.js
- `readline/promises` for command-line input

## Notes

Tasks are stored in memory while the program is running. They are not saved to a file or database, so the list resets when the application is closed.

## AI Usage

The initial framework and structure of this project were written by me. AI tools were used to help add additional functionality, debug issues, and test the program. I reviewed the suggested changes and incorporated them into the final code.
