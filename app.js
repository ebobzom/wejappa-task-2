const fs = require('fs');

function documentation(){
    const log = `
    PLEASE  USE THESE INSTRUCTION FOR ALL QUERIES:
        (*) All strings should be with a double quote

        (1) For adding of note: node app.js add <your note title or as a word or string> <your note as a string>

        (2) For updating of note: node app.js update <your previous note title as a word or string> <your note as a string>

        (3) For deleting of note: node app.js delete <your note title>

        (4) For getting of all notes: node app.js get list

        (5) For getting of one note: node app.js getNotes <your note title>
    `
    console.log(log);
}

let command = "";
let value = "";
let title = "";

function parseArguments(arr){
    if(arr.length === 3){
        command = arr[2];
    }
    else if(arr.length === 4){
        command = arr[2];
        value = arr[3];
    }
    else if( arr.length === 5 ){
        command = arr[2];
        title = arr[3];
        value= arr[4];
        
    } else{
        documentation();
    }
    return {
        command, value, title
    }
}

let commandObj = parseArguments(process.argv);
const userCommand = commandObj.command.toLowerCase();
console.log('user command', userCommand)
if( userCommand === 'add'){
    try {
        const note = {
            title: commandObj.title.toLowerCase(),
            note: commandObj.value
        }
        const store = fs.readFileSync('./notes/notes.txt');
        const storeToJSON = JSON.parse(store);
        const storeTitles = storeToJSON.notes.map((obj) => obj.title);

        if(storeTitles.includes(title)){
            console.log('Note with same title already exists, please change the title');
            return;
        }else{
            storeToJSON.notes.push(note);
            fs.writeFileSync('./notes/notes.txt', JSON.stringify(storeToJSON));
            console.log('Note added successfully');
            return; 
        }
          
    } catch (error) {
        console.log(error.message)
    }

    // code for first attempt
    fs.mkdirSync('notes');
    const note = {
        title: commandObj.title.toLowerCase(),
        note: commandObj.value
    }
    const mainDB = {
        notes: []
    }
    fs.writeFileSync('./notes/notes.txt', JSON.stringify(mainDB));
    const store = fs.readFileSync('./notes/notes.txt');
    const storeToJSON = JSON.parse(store);
    storeToJSON.notes.push(note);
    fs.writeFileSync('./notes/notes.txt', JSON.stringify(storeToJSON));
    console.log('Note added successfully');
    return;

}
else if (userCommand === 'update'){
    const store = fs.readFileSync('./notes/notes.txt');
    const storeToJSON = JSON.parse(store);
    const updatedStore = storeToJSON.note.map((obj) => {
        if(obj.title === commandObj.title.toLowerCase()){
            return {
                title: obj.title,
                note: commandObj.value
            }
        }else{
            return obj;
        }
    });

    fs.writeFileSync('./notes/notes.txt', JSON.stringify({ notes: updatedStore }));
    console.log('Note updated successfully');
    return;
} else if(userCommand === 'delete'){
    const store = fs.readFileSync('./notes/notes.txt');
    const storeToJSON = JSON.parse(store);
    const newStore = storeToJSON.filter((obj) => obj.title != commandObj.value);

    fs.writeFileSync('./notes/notes.txt', JSON.stringify(newStore));
    console.log('Note deleted successfully');
    return;
} else if( userCommand === 'getnotes'){
    const store = fs.readFileSync('./notes/notes.txt');
    const storeToJSON = JSON.parse(store);
    let output = `
        All Notes Bellow
    `;
    storeToJSON.notes.forEach((obj, i) => {
        output += `
            (${i + 1})
            title: ${obj.title}
            note: ${obj.note}

        `
    });
    console.log(output);
}
