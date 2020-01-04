const { getRandomWordSync, getRandomWord } = require('word-maker');
const fs = require('fs');
const axios = require('axios');
const baseUrl = "http://dummy.restapiexample.com";

//Please call the function for each question
questionOne();


//1 Print numbers from 1 to 100 to the console, but for each number also print a random word using the function

function questionOne() {
    let content = '';
    let dataSet = [];
    for (let i = 1; i <= 100; i++) {

        let word = getRandomWordSync();
        console.log(i + ": " + word);
        content = content + "\n" + i + ": " + word;
        let data = {
            number: i,
            word: word
        }
        dataSet.push(data);
    }


    // For BackEnd
    // write to a new file named questionOneOutput.txt
    fs.writeFile('questionOneOutput.txt', content, (err) => {
        // throws an error, you could also catch it here
        if (err) throw err;
        // success case, the file was saved
        console.log('Output saved!');
    });


    //For Frontend
    axios.post(`${baseUrl}/api/v1/create`, {
        dataSet: dataSet
    }).then((res) => {
        console.log(res.status)
    }).catch((error) => {
        console.error(error)
    })


}


//2 Modify your code to be a "Fizz Buzz" program. That is, print the numbers as in the previous step, but for multiples of three, print "Fizz" (instead of the random word), for multiples of five, print "Buzz" and for numbers which are both multiples of three and five, print "FizzBuzz".


function questionTwo() {

    // function to calculate if it is multiples
    function isMultiples(value, multipleNumber) {
        return value % multipleNumber === 0;
    }

    // returns the word based on the mutiples
    function fizzBuzzWord(n) {


        // the broadest scenario is if the number is multiples of 3 & 5
        // number divisible by 3 and 5 will 
        // always be divisible by 15, print therefor we can use 15 instead of 3 and 5 also
        if (isMultiples(n, 3) && isMultiples(n, 5)) {
            return 'FizzBuzz';
        }

        // it is possible to have a "else if", but the code is simpler and more legible this way

        if (isMultiples(n, 3)) {
            return 'Fizz';
        }

        if (isMultiples(n, 5)) {
            return 'Buzz';
        }

        // does not meet any conditions. returns default value
        return getRandomWordSync();
    }
    let content = '';
    let dataSet = [];

    for (let i = 1; i <= 100; i++) {
        let word = fizzBuzzWord(i)
        console.log(i + ": " + word);
        content = content + "\n" + i + ": " + word;
        let data = {
            number: i,
            word: word
        }
        dataSet.push(data);
    }

    // For BackEnd
    // write to a new file named questionTwoOutput.txt
    fs.writeFile('questionTwoOutput.txt', content, (err) => {
        // throws an error, you could also catch it here
        if (err) throw err;
        // success case, the file was saved
        console.log('Output saved!');
    });

    //For Frontend
    axios.post(`${baseUrl}/api/v1/create`, {
        dataSet: dataSet
    }).then((res) => {
        console.log(res.status)
    }).catch((error) => {
        console.error(error)
    })
}


//3 Create a version of steps 1 and 2 using the asynchronous function, getRandomWord. This function returns a Promise, which resolves to a random word string.

function questionThree() {
    const promises = [];

    //  function to calculate if it is multiples
    function isMultiples(value, multipleNumber) {
        return value % multipleNumber === 0;
    }

    // returns the word based on the mutiples
    async function fizzBuzzWord(n) {
        const startTime = Date.now();

        function getExecutionTime() {
            return Date.now() - startTime;
        }

        // returns the final object enhanced with executionTime and index values
        function composeObject(word) {

            return { number: n, word: word, executionTime: getExecutionTime() };
        }

        /*
        I consider that it is more readable to have conditionals that break down the different cases from the      broadest to the simplest, returning as the last scenario the default value.
        */

        // the broadest scenario is if the number is multiples of 3 & 5
        if (isMultiples(n, 3) && isMultiples(n, 5)) {
            return composeObject('FizzBuzz');
        }

        // it is possible to have a "else if", but the code is simpler and more legible this way

        if (isMultiples(n, 3)) {
            return composeObject('Fizz');
        }

        if (isMultiples(n, 5)) {
            return composeObject('Buzz');
        }

        // does not meet any conditions. returns default value
        return composeObject(await getRandomWord({ slow: true }));
    }

    const startTime = Date.now();

    for (let i = 1; i <= 100; i++) {
        promises.push(fizzBuzzWord(i));
    }
    let content = '';
    Promise.all(promises).then(data => {
        printWords(data);
        const totalExecutionTime = Date.now() - startTime;
        console.log("");
        console.log("Total time execution: " + totalExecutionTime + "ms");
        content = content + "\n\nTotal time execution: " + totalExecutionTime + "ms";

        // For BackEnd
        // write to a new file named questionThreeOutput.txt
        fs.writeFile('questionThreeOutput.txt', content, (err) => {
            // throws an error, you could also catch it here
            if (err) throw err;
            // success case, the file was saved
            console.log('Output saved!');
        });

        //For Frontend
        axios.post(`${baseUrl}/api/v1/create`, {
            dataSet: data
        }).then((res) => {
            console.log(res.status)
        }).catch((error) => {
            console.error(error)
        })
    });

    function printWords(dataSet) {

        for (let i = 0; i < dataSet.length; i++) {
            console.log(dataSet[i].number + ": " + dataSet[i].word + ", ExecutionTime: " + dataSet[i].executionTime)
            content = content + "\n" + dataSet[i].number + ": " + dataSet[i].word + ", ExecutionTime: " + dataSet[i].executionTime;
        }

    }
}



//4 Add error handling to both the synchronous and asynchronous solutions (calling getRandomWord({ withErrors: true }) will intermitently throw an error instead of returning a random word). When an error is caught, the programm should print "It shouldn't break anything!" instead of the random word, "Fizz", "Buzz" or "FizzBuzz"


function questionFour() {

    const promises = [];

    // utilitarian function to calculate if it is multiples
    function isMultiples(value, multipleNumber) {
        return value % multipleNumber === 0;
    }

    // returns the word based on the mutiples
    async function fizzBuzzWord(n) {
        const startTime = Date.now();

        function getExecutionTime() {
            return Date.now() - startTime;
        }

        // returns the final object enhanced with executionTime and index values
        function composeObject(word) {
            return { number: n, word: word, executionTime: getExecutionTime() };
        }

        try {
            /*
          I consider that it is more readable to have conditionals that break down the different cases from the      broadest to the simplest, returning as the last scenario the default value.
          */

            // generate the ramdon word first to catch the error
            const randomWord = await getRandomWord({ slow: true, withErrors: true });

            // the broadest scenario is if the number is multiples of 3 & 5
            if (isMultiples(n, 3) && isMultiples(n, 5)) {
                return composeObject('FizzBuzz');
            }

            // it is possible to have a "else if", but the code is simpler and more legible this way

            if (isMultiples(n, 3)) {
                return composeObject('Fizz');
            }

            if (isMultiples(n, 5)) {
                return composeObject('Buzz');
            }

            // does not meet any conditions. returns default value
            // use the random word
            return composeObject(randomWord);
        } catch (error) {
            //catch the error and return the message
            return composeObject(error);
        }
    }

    const startTime = Date.now();

    for (let i = 1; i < 101; i++) {
        promises.push(fizzBuzzWord(i));
    }
    let content = '';
    Promise.all(promises).then(data => {
        printWords(data);
        const totalExecutionTime = Date.now() - startTime;
        console.log("");
        console.log("Total time execution: " + totalExecutionTime + "ms");
        content = content + "\n\nTotal time execution: " + totalExecutionTime + "ms";
        // For BackEnd
        // write to a new file named questionFourOutput.txt
        fs.writeFile('questionFourOutput.txt', content, (err) => {
            // throws an error, you could also catch it here
            if (err) throw err;
            // success case, the file was saved
            console.log('Output saved!');
        });

        //For Frontend
        axios.post(`${baseUrl}/api/v1/create`, {
            dataSet: data
        }).then((res) => {
            console.log(res.status)
        }).catch((error) => {
            console.error(error)
        })
    });

    function printWords(dataSet) {
        for (let i = 0; i < dataSet.length; i++) {
            console.log(dataSet[i].number + ": " + dataSet[i].word + ", ExecutionTime: " + dataSet[i].executionTime);
            content = content + "\n" + dataSet[i].number + ": " + dataSet[i].word + ", ExecutionTime: " + dataSet[i].executionTime;
        }


    }
}





