// Input setup
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });

// Converts a YYYY-MM-DD string into a valid local date
function parseDate(dateString) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return null;
    }

    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day, 12);

    // Checks that the date actually exists
    if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ) {
        return null;
    }

    return date;
}

// Item class
class Item {
    constructor(title, description, dateDue, status) {
        this._title = title;
        this._description = description;
        this._dateCreated = new Date();
        this._dateDue = dateDue;
        this._status = status;
    }

    // Getters
    get title() {
        return this._title;
    }

    get description() {
        return this._description;
    }

    get dateCreated() {
        return this._dateCreated.toDateString();
    }

    get dateDue() {
        return this._dateDue.toDateString();
    }

    get status() {
        return this._status;
    }

    // Setters
    set title(newTitle) {
        this._title = newTitle;
    }

    set description(newDescription) {
        this._description = newDescription;
    }

    set dateDue(newDateDue) {
        this._dateDue = newDateDue;
    }

    set status(newStatus) {
        this._status = newStatus;
    }

    // Returns item information as a string
    toString() {
        return `Title: ${this.title}
Description: ${this.description}
Created: ${this.dateCreated}
Due: ${this.dateDue}
Status: ${this.status}`;
    }
}

// Main to-do list array
const items = [];

// Adds a new item
async function addItem() {
    console.log('\nAdd a New Item:\n');

    let title = '';

    while (!title) {
        title = (await rl.question('Title: ')).trim();

        if (!title) {
            console.log('Title cannot be empty.');
        }
    }

    const description = await rl.question('Description: ');

    let dateDue = null;

    while (dateDue === null) {
        const dateInput = await rl.question('Due date (YYYY-MM-DD): ');
        dateDue = parseDate(dateInput);

        if (dateDue === null) {
            console.log(
                'Invalid date. Please enter a real date in YYYY-MM-DD format.'
            );
        }
    }

    items.push(new Item(title, description, dateDue, 'New'));
    console.log('\nItem added!\n');
}

// Displays the list of item titles
function viewItems() {
    console.log('\nTo Do List:');

    if (items.length === 0) {
        console.log('No items yet.\n');
        return;
    }

    for (let i = 0; i < items.length; i++) {
        console.log(`${i + 1}. ${items[i].title}`);
    }

    console.log('');
}

// Displays the list and lets the user select an item
async function selectItem() {
    viewItems();

    if (items.length === 0) {
        return -1;
    }

    const number = Number(await rl.question('Choose an item number: '));

    if (
        !Number.isInteger(number) ||
        number < 1 ||
        number > items.length
    ) {
        console.log('Invalid item number.\n');
        return -1;
    }

    return number - 1;
}

// Edits an existing item
async function editItem() {
    const index = await selectItem();

    if (index === -1) return;

    const item = items[index];

    console.log('\nEdit Item (press Enter to skip):\n');

    const title = (await rl.question('New title: ')).trim();
    const description = await rl.question('New description: ');

    if (title) item.title = title;
    if (description.trim()) item.description = description;

    // Ask again until the date is valid or the user skips
    let date = await rl.question('New due date (YYYY-MM-DD): ');

    while (date.trim() !== '') {
        const newDate = parseDate(date.trim());

        if (newDate !== null) {
            item.dateDue = newDate;
            break;
        }

        console.log(
            'Invalid date. Please try again or press Enter to skip.'
        );

        date = await rl.question('New due date (YYYY-MM-DD): ');
    }

    // Update the status
    console.log('\n1. New\n2. Working on\n3. Finished');

    let status = await rl.question('New status: ');

    while (status !== '' && !['1', '2', '3'].includes(status)) {
        console.log(
            'Invalid status. Choose 1, 2, 3, or press Enter to skip.'
        );
        status = await rl.question('New status: ');
    }

    if (status === '1') item.status = 'New';
    if (status === '2') item.status = 'Working on';
    if (status === '3') item.status = 'Finished';

    console.log('\nItem updated!\n');
}

// Deletes an item
async function deleteItem() {
    const index = await selectItem();

    if (index === -1) return;

    items.splice(index, 1);
    console.log('\nItem deleted!\n');
}

// Moves an item within the list
async function moveItem() {
    const index = await selectItem();

    if (index === -1) return;

    console.log('\n1. Move to top');
    console.log('2. Move up');
    console.log('3. Move down');
    console.log('4. Move to bottom');

    const choice = await rl.question('Choose an option: ');

    if (!['1', '2', '3', '4'].includes(choice)) {
        console.log('\nInvalid option.\n');
        return;
    }

    if ((choice === '1' || choice === '2') && index === 0) {
        console.log('\nItem is already at the top.\n');
        return;
    }

    if (
        (choice === '3' || choice === '4') &&
        index === items.length - 1
    ) {
        console.log('\nItem is already at the bottom.\n');
        return;
    }

    const [item] = items.splice(index, 1);

    if (choice === '1') {
        items.unshift(item);
    } else if (choice === '2') {
        items.splice(index - 1, 0, item);
    } else if (choice === '3') {
        items.splice(index + 1, 0, item);
    } else if (choice === '4') {
        items.push(item);
    }

    console.log('\nItem moved!\n');
}

// Displays the menu and handles user input
async function main() {
    let choice = '';

    while (choice !== '7') {
        console.log('\n===== TO-DO LIST =====');
        console.log('1. View all items');
        console.log('2. Add item');
        console.log('3. View item details');
        console.log('4. Edit item');
        console.log('5. Delete item');
        console.log('6. Reorganize items');
        console.log('7. Exit');

        choice = await rl.question('Choose an option: ');

        if (choice === '1') {
            viewItems();
        } else if (choice === '2') {
            await addItem();
        } else if (choice === '3') {
            const index = await selectItem();

            if (index !== -1) {
                console.log('\nItem Details:\n');
                console.log(items[index].toString());
                console.log('');
            }
        } else if (choice === '4') {
            await editItem();
        } else if (choice === '5') {
            await deleteItem();
        } else if (choice === '6') {
            await moveItem();
        } else if (choice === '7') {
            console.log('\nGoodbye!');
        } else {
            console.log('\nInvalid option.\n');
        }
    }

    rl.close();
}

// Runs the program
main();
