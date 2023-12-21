// Creates a new Trie node with an empty map for results
const createNode = () => {
	const newNode = new Map();
	newNode.set("results", new Map());
	newNode.set("count", 0); // Add a count property for word occurrences
	return newNode;
  };
  
  // Implementation of the Trie data structure
  class Trie {
	// The root node of the Trie is initialized when a new instance is created
	#root = createNode();
  
	// Constructor populates the Trie with data from provided files
	constructor(files) {
	  this.#buildTrie(files);
	}
  
	// Builds the Trie by processing text data from each file
	#buildTrie = (files) => {
	  // Processes a single word and updates the Trie accordingly
	  const processWord = (fileName, word) => {
		let currentNode = this.#root;
  
		word.split("").forEach((char) => {
		  if (!currentNode.has(char)) {
			currentNode.set(char, createNode());
		  }
  
		  currentNode = currentNode.get(char);
		});
  
		// Increment the count for the complete word
		currentNode.set("count", (currentNode.get("count") || 0) + 1);
  
		// Update results for the current file in the current node
		if (currentNode.get("results").has(fileName)) {
		  const frequency = currentNode.get("results").get(fileName);
		  currentNode.get("results").set(fileName, frequency + 1);
		} else {
		  currentNode.get("results").set(fileName, 1);
		}
	  };
  
	  // Processes a single file and calls processWord on each word
	  const processTextFile = (fileName, fileData) => {
		fileData.forEach((word) => {
		  processWord(fileName, word);
		});
	  };
  
	  // Iterates over each file and calls processTextFile on each file
	  files.forEach((file) => {
		processTextFile(file.file, file.data);
	  });
	};
  
	// Searches the Trie for the provided text
	search = (text, resultsLimit = Infinity) => {
	  // Converts a Map of search results to an array and sorts it
	  const convertAndSortResults = (resultMap) => {
		const resultArray = [];
		resultMap.forEach((frequency, fileName) => {
		  resultArray.push({
			fileName,
			frequency,
			wordCount: this.#root.get("count"), // Include word count in the result
		  });
		});
		return resultArray.sort((a, b) => b.frequency - a.frequency);
	  };
  
	  // Starts the search at the root node
	  let currentNode = this.#root;
  
	  // Normalizes the search text by removing whitespace and converting to lowercase
	  text = text
		.split("")
		.map((char) => char.trim().toLowerCase())
		.filter((char) => char !== "")
		.join("");
  
	  // Iterates over each character in the search text
	  for (const letter of text.toLowerCase()) {
		// If the character is not in the Trie, returns an empty array
		if (!currentNode.has(letter)) {
		  return convertAndSortResults(new Map());
		}
  
		// Moves to the next node in the Trie
		currentNode = currentNode.get(letter);
	  }
  
	  // Gets the search results from the current node
	  const results = currentNode.get("results");
  
	  // If there are no search results, returns an empty array
	  if (results.size === 0) {
		return [];
	  }
  
	  // Converts the search results to an array, sorts it, and returns the first resultsLimit elements
	  return convertAndSortResults(results).slice(0, resultsLimit);
	};
  }
  
  module.exports = Trie;
  