const fs = require('fs');
const http = require('http');
const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder;

const decoder = new StringDecoder('utf-8');
const PORT = process.env.PORT || 3000;

function requestHandler(req, res){
    const parsedUrl = url.parse(req.url, true);
    let dataValue = '';
    if(req.method === 'GET'){
        if(req.method === 'GET' && parsedUrl.pathname === '/notes/'){
            try {
                const noteValue = fs.readFileSync(`./notes/${parsedUrl.query.notetitle}`);
                res.writeHead( 200, {  ContentType: 'text/plain'});
                res.end(noteValue);
                return;
            } catch (error) {
                res.writeHead( 500, {  ContentType: 'text/plain'});
                res.end('An error occured');
                return;
            }
        }
        // all notes
        if(req.method === 'GET' && parsedUrl.path === '/notes'){
            let noteSummarry = ``;
            fs.readdir('./notes', { encoding: 'utf-8'}, (err, filenames) => {
                if(err){
                    res.writeHead( 500, {  ContentType: 'text/plain'});
                    res.end('An error occured');
                    return;
                }
               
                filenames.forEach((file, index) => {
                    let filedata = fs.readFileSync(`./notes/${file}`, {encoding: 'utf-8'})
                    noteSummarry += `(${index + 1}) ${filedata}\n`;
                })
                res.writeHead( 200, {  ContentType: 'text/plain'});
                res.end(noteSummarry);
                return;
            })
        }

    }else{
    
        req.on('data', (data) =>{
            dataValue += decoder.write(data);
        });

        req.on('end', ()=> {
            dataValue += decoder.end();

            // payload data
            const {title, note} = JSON.parse(dataValue);

            // add note route
            if(req.method === 'POST' && parsedUrl.path === '/notes'){
                fs.mkdir('./notes', (err) => {
                    // if there is an error, then directory exists
                    if(err){
                    
                    }
                    
                    // check if note with same title exists
                    fs.readFile(`./notes/${title}`, { encoding: 'utf-8' }, (err, val) => {
                        if(err){
                            // if err then file does not exist
                            fs.writeFile(`./notes/${title}`, note, (err, val) => {
                                if(err){
                                    res.writeHead( 500, {  ContentType: 'text/plain'});
                                    res.end('An error occurred');
                                    return;
                                }
                                res.writeHead( 200, {  ContentType: 'text/plain'});
                                res.end('Note added successfully');
                                return;
                                
                            });
                        }else{
                            res.writeHead( 500, {  ContentType: 'text/plain'});
                            res.end('Note with this title already exists');
                            return;
                        }
                    })

                })
            }
            // update note route
            if(req.method === 'PUT' && parsedUrl.path === '/notes'){
                fs.writeFile(`./notes/${title}`, note, (err) => {
                    if(err){
                        res.writeHead( 500, {  ContentType: 'text/plain'});
                        res.end('An error occured, please check your note title');
                        return;
                    }
                    res.writeHead( 500, {  ContentType: 'text/plain'});
                    res.end('Note updated successfully');
                    return;                    

                })
            }
    
            // delete note route
            if(req.method === 'DELETE' && parsedUrl.pathname === '/notes/'){
                fs.unlink(`./notes/${parsedUrl.query.notetitle}`, (err) => {
                    if(err){
                        res.writeHead( 500, {  ContentType: 'text/plain'});
                        res.end('An error occured, no file found');
                        return;
                    }else{
                        res.writeHead( 200, {  ContentType: 'text/plain'});
                        res.end('Note deleted succesfully');

                        // try to delete folder if its the last note
                        fs.rmdir('./notes', (err) => {
                            if(err){
                                return;
                            }
                            return;
                        })
                        return;
                    }
                })
            }

            // catch all route
            if(req.path){
                res.writeHead( 500, {  ContentType: 'text/plain'});
                res.end('file not found');
                return;
            }
        
        });

    }
    
}


//create server
const server = http.createServer(requestHandler);
server.listen(PORT, () => {
    console.log('server runnig on port 3000');
})