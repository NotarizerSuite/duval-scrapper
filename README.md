# duval-scrapper
This project got 4 folders, each folder does something in the scrapping process. 

## Calling the API:
The `core` folder holds all the util function for calling the duval api and gather html pages which contain data.
We can call a process which runs on all the duval site by running the index.ts file in the `src` dir.
There is a shortcut: `npm start`.
-----

## Parsing the HTML:
To turn the resulted gigabytes long `result.json` file that we got from running the api into meaningfull data that is saved in a mongo data base we can use the `html` folder.
It contains a parser that can parse the data.
The db utills are in the `database` folder.
To run it you need to run the `main.ts` file in the folder.
The shortcut is: `npm run parse`
-----

## Running a demo server:
The server contains a text box that lets the user search the db using a basic regex.
If the user tries to find the name `JOHN` every `JOHN` in the server will show up.
It may take a couple of seconds to find the results if the search is really wide.
To run the server: `npm run server`
-----

![Alt text](src\basicServer\Site demo.png)

> To run the project you gotta have mongoDB and Node js.

> To install all the depedencies run: `npm i`.


