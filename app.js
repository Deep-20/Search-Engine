// Required Modules Imported
const fileSystem = require("fs/promises");
const cheerio = require('cheerio');
const filePath = require("path");
const cleaner = require("text-cleaner");
const { htmlToText } = require("html-to-text");
const { removeStopwords } = require("stopword");
const userInputInterface = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});
const TrieStructure = require("./trie");

// Specify the directory that contains the data files
const dataDirectory = filePath.resolve("data");

//List of stopwords
stopwords = ["a","about","above","after","again","against","all","am","an","and","any","are","aren't","as","at","be","because",
"been","before","being","below","between","both","but","by","can't","cannot","could","couldn't","did","didn't","do","does",
"doesn't","doing","don't","down","during","each","few","for","from","further","had","hadn't","has","hasn't","have","haven't",
"having","he","he'd","he'll","he's","her","here","here's","hers","herself","him","himself","his","how","how's","i","i'd",
"i'll","i'm","i've","if","in","into","is","isn't","it","it's","its","itself","let's","me","more","most","mustn't","my","myself",
"no","nor","not","of","off","on","once","only","or","other","ought","our","ours","ourselves","out","over","own","same",
"shan't","she","she'd","she'll","she's","should","shouldn't","so","some","such","than","that","that's","the","their","theirs",
"them","themselves","then","there","there's","these","they","they'd","they'll","they're","they've","this","those","through",
"to","too","under","until","up","very","was","wasn't","we","we'd","we'll","we're","we've","were","weren't","what","what's",
"when","when's","where","where's","which","while","who","who's","whom","why","why's","with","won't","would","wouldn't","you",
"you'd","you'll","you're","you've","your","yours","yourself","yourselves","I ","a ","about ","an ","are ","as ","at ","be ",
"by ","com ","for ","from","how","in ","is ","it ","of ","on ","or ","that","the ","this","to ","was ","what ","when","where",
"who ","will ","with","the","www"];

//Function to remove stopwords from the cleanData extarcted from files
function remove_stopwords(str) {
    res = []
    words = str.split(' ')
    for(i=0;i<words.length;i++) {
       word_clean = words[i].split(".").join("")
       if(!stopwords.includes(word_clean)) {
           res.push(word_clean)
       }
    }
    return(res.join(' '))
};

// Read and clean data from a file function
const readDataFromFile = async (file) => {
	// File data reading
	const data = await fileSystem.readFile(filePath.join(dataDirectory, file), "utf-8");
  
	// Use cheerio to parse the HTML and extract text content
	const $ = cheerio.load(data);
	const textContent = $('body').text();
  
	// Utilize a variety of text cleaning techniques to clean the data
	const cleanData = cleaner(htmlToText(textContent, { ignoreHref: true }))
	  .toLowerCase()
	  .removeApostrophes()
	  .removeChars({ exclude: "0123456789", replaceWith: " " })
	  .condense()
	  .valueOf();

	// Remove stop words, articles, prepositions, and pronouns
	// const filteredData = removeStopwords(cleanData, [
	//   // Add your list of stop words, articles, prepositions, and pronouns here
	//   // For example:
	//   "a", "an", "the", "and", "or", "in", "on", "of", "to", "for", "with", "he", "she", "it", "they", "that", "this"
	// ]);
	
	const filteredData = remove_stopwords(cleanData);
	// Noting that the file was successfully processed.
	console.log(`✔ ${file}`);
	return filteredData.split(/\s+/); // Split by any whitespace character
  };
  

// Data processing and reading functionality for each file in the path
const processFiles = async (files) => {
  await Promise.all(
    files.map(async (file, index) => {
      // Analyze and clean the file's contents
      const data = await readDataFromFile(file);
      // Place the file name and cleaned data in the files array
      files[index] = {
        file,
        data,
      };
    })
  );
  return files;
};

// Function that uses the command line to obtain user input
const getUserInput = async () =>
  new Promise((resolve) => {
    userInputInterface.question(
      "\n\nEnter the word you want to search (Enter ':q' to quit): ",
      resolve
    );
  });

// Main process that drives the program
const main = async () => {
	try {
	  console.log(`Reading files from: ${dataDirectory}`);
	  // Analyze the data in each file in the directory
	  let filesList = await fileSystem.readdir(dataDirectory);
	  filesList = await processFiles(filesList);
	  // Utilize the processed data from every file to create a trie data structure
	  const trieDataStructure = new TrieStructure(filesList);
	  // Ask the user for input repeatedly until they give up
	  let userProvidedInput = await getUserInput();
	  while (userProvidedInput !== ":q") {
		// Look for the user's input in the trie and show the outcomes
		const searchResults = await trieDataStructure.search(userProvidedInput);
		console.log("\nSearch Result: ");
		if (searchResults.length > 0) {
		  console.table(searchResults, ["fileName", "frequency"]);
		} else {
		  console.log("Not found");
		}
		// Ask the user for another input
		userProvidedInput = await getUserInput();
	  }
	  // When the program terminates, close the readline interface
	  userInputInterface.close();
	} catch (error) {
	  // Catching any errors occurred
	  console.error(error);
	}
  };

// Calling the function to initiate the program
main();


