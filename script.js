// Mapping domain codes to full trait names
const domainNames = {
    N: 'Neuroticism',
    E: 'Extraversion',
    O: 'Openness',
    A: 'Agreeableness',
    C: 'Conscientiousness'
};

let currentQuestionIndex = 0;
let userResponses = {}; // Store user responses to calculate results at the end
let questions = []; // To hold questions after fetching

// Load and display questions one at a time
async function fetchQuestions() {
    try {
        const response = await fetch('questions.json');
        questions = await response.json();
        showQuestion(currentQuestionIndex);
    } catch (error) {
        console.error("Error loading questions:", error);
    }
}

// Display one question at a time
function showQuestion(index) {
    const form = document.getElementById('personalityTest');
    form.innerHTML = ''; // Clear previous question

    if (index < questions.length) {
        const question = questions[index];
        const section = document.createElement('div');
        section.classList.add('trait-section');

        // Add question text without domain
        const label = document.createElement('label');
        label.classList.add('question');
        label.innerText = `${question.text}`;
        section.appendChild(label);

        // Array of labels for each radio button
        const labels = [
            "Sehr unzutreffend",
            "Unzutreffend",
            "Weder zutreffend noch unzutreffend",
            "Zutreffend",
            "Sehr zutreffend"
        ];

        // Create a container for radio buttons and their labels
        const optionsContainer = document.createElement('div');
        optionsContainer.classList.add('options-container');

        // Create radio buttons and labels
        labels.forEach((labelText, value) => {
            const optionWrapper = document.createElement('div');
            optionWrapper.classList.add('option-wrapper');

            const input = document.createElement('input');
            input.type = 'radio';
            input.name = `question${index}`;
            input.value = value + 1; // Values 1 to 5

            // Move to the next question when an option is selected
            input.addEventListener('change', () => {
                userResponses[`question${index}`] = parseInt(input.value); // Save response
                currentQuestionIndex++;
                showQuestion(currentQuestionIndex); // Show next question
            });

            // Create the label for the radio button
            const label = document.createElement('span');
            label.classList.add('option-label');
            label.innerText = labelText;

            // Add input and label to the wrapper, then add the wrapper to optionsContainer
            optionWrapper.appendChild(input);
            optionWrapper.appendChild(label);
            optionsContainer.appendChild(optionWrapper);
        });

        section.appendChild(optionsContainer); // Add options to section
        form.appendChild(section);

        // Add a container for the buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('buttons-container');

        // Add "Back" button if not on the first question
        if (index > 0) {
            const backButton = document.createElement('button');
            backButton.innerText = 'Back';
            backButton.onclick = () => {
                currentQuestionIndex--;
                showQuestion(currentQuestionIndex); // Show previous question
            };
            buttonContainer.appendChild(backButton);
        }

        // Add "See Results" button
        const resultsButton = document.createElement('button');
        resultsButton.innerText = 'See Results';
        resultsButton.onclick = showResults;
        buttonContainer.appendChild(resultsButton);

        // Append the button container to the form
        form.appendChild(buttonContainer);

    } else {
        showResults(); // Show results when all questions are answered
    }
}

// Function to calculate closest professions from direct score input
function calculateClosestProfessionsFromInput() {
    // Get values from the form
    const manualScoresForm = document.getElementById('manualScoresForm');
    const userScores = {
        N: parseInt(manualScoresForm.elements['N'].value),
        E: parseInt(manualScoresForm.elements['E'].value),
        O: parseInt(manualScoresForm.elements['O'].value),
        A: parseInt(manualScoresForm.elements['A'].value),
        C: parseInt(manualScoresForm.elements['C'].value)
    };

    console.log("User Scores from manual input:", userScores); // Debugging line

    findClosestProfessions(userScores);
}

// Display final results, including inverted scoring for "minus" questions
function showResults() {
    const form = document.getElementById('personalityTest');
    form.innerHTML = ''; // Clear questions

    const scores = { N: 0, E: 0, O: 0, A: 0, C: 0 };
    const questionCounts = { N: 0, E: 0, O: 0, A: 0, C: 0 }; // Track the number of questions per trait
    const maxScore = 5; // Assuming a 1-5 scale for each question

    // Calculate raw scores and count questions per trait
    Object.keys(userResponses).forEach(questionKey => {
        const questionIndex = parseInt(questionKey.replace('question', ''));
        const question = questions[questionIndex];
        let responseValue = userResponses[questionKey];

        // Invert score if question is "minus" keyed
        if (question.keyed === 'minus') {
            responseValue = maxScore + 1 - responseValue;
        }

        // Add to the score and increment question count for the trait
        scores[question.domain] += responseValue;
        questionCounts[question.domain]++;
    });

    // Normalize scores to a 0-100 scale
    Object.keys(scores).forEach(domain => {
        const maxTraitScore = questionCounts[domain] * maxScore; // Max possible score for the trait
        scores[domain] = (scores[domain] / maxTraitScore) * 100; // Normalize to 0-100
    });

    // Display normalized scores
    const result = document.getElementById('result');
    result.style.display = 'block';

    Object.keys(scores).forEach(domain => {
        document.getElementById(domain).innerText = `${domainNames[domain]}: ${scores[domain].toFixed(1)}`;
    });

    // Find and display closest professions
    findClosestProfessions(scores);
}

// Find the 10 closest professions to user scores
async function findClosestProfessions(userScores) {
    try {
        // Load and parse the CSV file with PapaParse
        const response = await fetch('profession_scores.csv');
        const csvData = await response.text();
        const professions = Papa.parse(csvData, {
            header: true, // Use first row as header
            skipEmptyLines: true // Ignore empty rows
        }).data;

        // Calculate distances for each profession
        professions.forEach(profession => {
            profession.distance = calculateDistance(userScores, {
                N: parseFloat(profession.Neuroticism),
                E: parseFloat(profession.Extraversion),
                O: parseFloat(profession.Openness),
                A: parseFloat(profession.Agreeableness),
                C: parseFloat(profession.Conscientiousness)
            });
        });

        // Sort by distance and select the top 10 closest professions
        professions.sort((a, b) => a.distance - b.distance);
        const closestProfessions = professions.slice(0, 10);

        // Display the closest professions
        displayClosestProfessions(closestProfessions);
    } catch (error) {
        console.error("Error loading professions data:", error);
    }
}

// Helper function to calculate Euclidean distance
function calculateDistance(userScores, professionScores) {
    let sumOfSquares = 0;
    for (let trait in userScores) {
        sumOfSquares += Math.pow(userScores[trait] - professionScores[trait], 2);
    }
    return Math.sqrt(sumOfSquares);
}

// Display closest professions
function displayClosestProfessions(closestProfessions) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '<h3>Top 10 Matching Professions:</h3>';
    closestProfessions.forEach(profession => {
        const professionElem = document.createElement('p');
        professionElem.innerText = `${profession.ISCO_4d_name} - Distance: ${profession.distance.toFixed(2)}`;
        resultDiv.appendChild(professionElem);
    });
    resultDiv.style.display = 'block';
}

// Start the quiz on page load
window.onload = fetchQuestions;
