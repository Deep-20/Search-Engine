### Search Engine

## INTRODUCTION

The project aimed to build a search engine for a small website. The goal was to develop a program that takes a collection of files, reads their contents, and creates an index of words excluding common stop words. The program should then rank these words based on how often they appear in each file. Users can use the search engine to look for specific terms and get a list of web pages ranked by relevance.

## Search Engine

This is a NodeJS tool that looks for a particular word on a webpage and tells you how many times it shows up. The search results are organized by the number of times the word appears, and the page with the most occurrences comes first in the list.

## Static Data (Input Files)

Currently, the project works with fixed HTML files as its data source. However, it's possible to upgrade the project to fetch these files dynamically using an endpoint. This means the project could be expanded to get HTML documents from a remote server or a database instead of just using files saved locally. This enhancement would make the project more adaptable and capable of handling a wider range of input data. With this modification, the project could efficiently process and analyze HTML documents from various sources in an automated way. The files are stored in the data directory.

## ALGORITHMS AND DATA STRUCTURES

For this project, a specific way of organizing and storing data is used, and it's called a Trie. It's created using JavaScript, and the actual implementation can be found in the file named trie.js. To simplify, think of it like a special map in JavaScript that helps organize and manage the data in a certain structured way. If you were to look at this map as a JavaScript object, it would have a particular arrangement.

```javascript
{
  a: {
    results: {},
  },
  t: {
    h: {
      e: {
        results: {
          "Mayon.html": 8,
          "Dukono.html": 3,
        },
      },
      results: {},
    },
    results: {},
  },
}
```

In this structure, each part of the object has a 'results' section that shows information about how many times a particular word, formed by combining the keys up to that point, appears. For instance, at the key 'e', the word formed is 'the'. The 'results' section indicates that this word has occurred eight times, with three instances in the 'Mayon.html' file and five in the 'Dukono.html' file.

## Creating the Trie

The Trie is set up when the application begins, and it includes information for all the files found in the data directory. The text in each file undergoes cleaning, and here's how it's done:

--> Eliminate all HTML tags.
--> Convert all text to lowercase.
--> Exclude all apostrophes (').
--> Get rid of all stop words.
--> Remove all non-alphanumeric characters.
--> Streamline the file by eliminating extra spaces, including tabs (\t) and new lines (\n).

Following the cleaning process, the Trie is updated by adding the list of words obtained from the cleaned text of each file.

1. Take one word at a time.
2. Go through each letter of the word, starting from the beginning.
3. Check if the key already exists in the Map. If it does, move to the value Map associated with that key and continue going through the letters. If it doesn't exist, create a new key with the current letter and set its value as a Map that includes a 'results' key (initialized as an empty Map).
4. Repeat step 3 until you reach the end of the word. At this point, update the 'results' Map of the final key in the Trie.

   --> If the filename of the current file is already present in the 'results' Map, increase its value by 1.
   --> Otherwise, add a new key with the current file's name and set its value as 1.
5. Remove all the stopwords

## Searching the Trie

Getting the results for a word is much like how we built the Trie. We take the word the user inputs, make it lowercase, and go through it letter by letter. For each letter, we check if there's a corresponding key in the Map, moving to the value Map for every match. If there's no match at any point, we return an empty result set. If we find a match for every letter and reach the last one, we retrieve the 'results' Map at that key. Finally, we display the results as a table with file names sorted in descending order based on the number of occurrences.

## How to run

This is a NodeJS project, so before you start, ensure that you have NodeJS set up. You can find the necessary steps at (https://nodejs.org/en/).

1. Install dependencies by executing the following command from the main directory

```
npm install
```

Executing this command will install all the necessary packages for running this project. You can find the list of dependencies in package.json

2. To launch the application, enter the following command from the main directory:

```
npm start
```

To end the search and exit the application, you can type :q.

## Sample Output

```
> npm start

> search-engine@1.0.0 start
> node app.js

Reading files from: ./data
✔ Dukono.html
✔ MountAgung.html
✔ Krakatoa.html
✔ MountErebus.html
✔ Mayon.html
✔ MountEtna.html
✔ MountShishaldin.html
✔ Semeru.html
✔ MountTambora.html
✔ MountStHelens.html


Enter the word you want to search (Enter ':q' to quit): The

Search Result: 
Not found


Enter the word you want to search (Enter ':q' to quit): no

Search Result: 
Not found


Enter the word you want to search (Enter ':q' to quit): Lava

Search Result: 
┌─────────┬────────────────────────┬───────────┐
│ (index) │        fileName        │ frequency │
├─────────┼────────────────────────┼───────────┤
│    0    │    'MountEtna.html'    │    39     │
│    1    │      'Mayon.html'      │    37     │
│    2    │  'MountStHelens.html'  │    26     │
│    3    │   'MountErebus.html'   │    16     │
│    4    │  'MountTambora.html'   │    13     │
│    5    │   'MountAgung.html'    │     6     │
│    6    │ 'MountShishaldin.html' │     6     │
│    7    │    'Krakatoa.html'     │     5     │
│    8    │     'Dukono.html'      │     2     │
│    9    │     'Semeru.html'      │     2     │
└─────────┴────────────────────────┴───────────┘


Enter the word you want to search (Enter ':q' to quit): volcano

Search Result: 
┌─────────┬────────────────────────┬───────────┐
│ (index) │        fileName        │ frequency │
├─────────┼────────────────────────┼───────────┤
│    0    │      'Mayon.html'      │    113    │
│    1    │  'MountStHelens.html'  │    38     │
│    2    │    'MountEtna.html'    │    35     │
│    3    │ 'MountShishaldin.html' │    34     │
│    4    │   'MountAgung.html'    │    30     │
│    5    │   'MountErebus.html'   │    28     │
│    6    │  'MountTambora.html'   │    18     │
│    7    │    'Krakatoa.html'     │    17     │
│    8    │     'Semeru.html'      │    16     │
│    9    │     'Dukono.html'      │     3     │
└─────────┴────────────────────────┴───────────┘


Enter the word you want to search (Enter ':q' to quit): :q

```
