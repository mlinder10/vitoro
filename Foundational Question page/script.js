// Global variables
let currentQuestionIndex = 0;
let questions = [];
let caseData = null;

// DOM elements
const caseVignette = document.getElementById('case-vignette');
const diagnosisSection = document.getElementById('diagnosis-section');
const questionSection = document.getElementById('question-section');
const revealedTopic = document.getElementById('revealed-topic');
const topicDisplay = document.getElementById('topic-display');
const submitDiagnosisBtn = document.getElementById('submit-diagnosis');
const diagnosisInput = document.getElementById('diagnosis-input');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadCaseData();
    setupEventListeners();
});

// Load case data from questions.json
// NOTE: Needs to be changed to fetch from db instead of local file
async function loadCaseData() {
    try {
        const response = await fetch('questions.json');
        caseData = await response.json();
        questions = caseData.questions;
        
        // Display the case vignette
        displayCaseVignette();
    } catch (error) {
        console.error('Error loading case data:', error);
        // Fallback to hardcoded data if fetch fails
        caseData = {
            topic: "Lupus Nephritis",
            base_case_vignette: {
                vignette: "A 22-year-old African American woman presents to the clinic with a 2-week history of fatigue, joint pain, and swelling in her ankles. She reports intermittent low-grade fevers and a photosensitive rash over her cheeks. On examination, her blood pressure is 145/92 mmHg, and there is periorbital edema. Laboratory studies reveal hematuria and proteinuria on urinalysis, elevated serum creatinine, and decreased complement C3 and C4 levels. Anti-double-stranded DNA antibodies are positive. A renal biopsy shows granular immune complex deposits along the glomerular basement membrane on immunofluorescence."
            },
            questions: [
                {
                    axis: "Pathophysiology / Disease Mechanism",
                    question: "Which of the following best describes the primary mechanism responsible for this patient's renal findings?",
                    choices: [
                        "A. Deposition of circulating immune complexes in the glomeruli",
                        "B. Direct cytotoxic T cell-mediated destruction of podocytes",
                        "C. Antibody-mediated activation of acetylcholine receptors",
                        "D. Formation of anti-neutrophil cytoplasmic antibodies (ANCAs)",
                        "E. Amyloid light chain deposition in the mesangium"
                    ],
                    correct_answer: "A. Deposition of circulating immune complexes in the glomeruli",
                    explanations: {
                        "A": "Correct. Lupus nephritis is caused by the deposition of circulating immune complexes (primarily containing anti-dsDNA antibodies) in the glomeruli, leading to complement activation, inflammation, and glomerular injury.",
                        "B": "Incorrect. Direct cytotoxic T cell-mediated destruction is characteristic of certain types of glomerulonephritis (e.g., minimal change disease) but not lupus nephritis.",
                        "C": "Incorrect. Antibody-mediated activation of acetylcholine receptors is seen in myasthenia gravis, not glomerular disease.",
                        "D": "Incorrect. ANCAs are associated with vasculitides such as granulomatosis with polyangiitis, not lupus nephritis.",
                        "E": "Incorrect. Amyloid light chain deposition causes amyloidosis, which can cause nephrotic syndrome but is not the mechanism in lupus nephritis."
                    }
                }
            ]
        };
        questions = caseData.questions;
        displayCaseVignette();
    }
}

// Display the case vignette
function displayCaseVignette() {
    if (caseData && caseData.base_case_vignette) {
        caseVignette.textContent = caseData.base_case_vignette.vignette;
    }
}

// Setup event listeners
function setupEventListeners() {
    submitDiagnosisBtn.addEventListener('click', handleDiagnosisSubmission);
}

// Handle diagnosis submission
function handleDiagnosisSubmission() {
    const diagnosis = diagnosisInput.value.trim();
    
    if (!diagnosis) {
        alert('Please enter a diagnosis before submitting.');
        return;
    }
    
    // Reveal the correct topic
    revealTopic();
    
    // Load all questions (hidden initially)
    loadAllQuestions();
    
    // Show the first question
    showQuestion(0);
    
    // Disable the diagnosis input and submit button
    diagnosisInput.disabled = true;
    submitDiagnosisBtn.disabled = true;
    submitDiagnosisBtn.textContent = 'Diagnosis Submitted';
    submitDiagnosisBtn.style.opacity = '0.6';
}

// Reveal the correct topic
function revealTopic() {
    if (caseData && caseData.topic) {
        topicDisplay.textContent = caseData.topic;
        revealedTopic.classList.remove('hidden');
        revealedTopic.classList.add('fade-in-up');
    }
}

// Load all questions at once (hidden initially)
function loadAllQuestions() {
    // Clear any existing questions
    questionSection.innerHTML = `
        <!-- Progress Bar -->
        <div class="progress-container">
            <div class="progress-bar">
                <div class="progress-fill" id="progress-fill"></div>
            </div>
            <div class="progress-text" id="progress-text">Question 1 of ${questions.length}</div>
        </div>
    `;
    
    // Create all question containers
    questions.forEach((question, index) => {
        const questionContainer = createQuestionContainer(question, index);
        questionContainer.classList.add('hidden'); // Hide initially
        questionSection.appendChild(questionContainer);
    });
    
    // Show the question section
    questionSection.classList.remove('hidden');
}

// Show a specific question
function showQuestion(questionIndex) {
    if (questionIndex >= questions.length) {
        // All questions completed
        showCompletionMessage();
        return;
    }
    
    // Get the question container that was already created
    const questionContainer = document.querySelector(`[data-question-index="${questionIndex}"]`);
    
    // Show this question
    questionContainer.classList.remove('hidden');
    
    // Update progress bar
    updateProgressBar(questionIndex + 1, questions.length);
    
    // Scroll to the question
    questionContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Create a question container with all elements
function createQuestionContainer(question, questionIndex) {
    const questionContainer = document.createElement('div');
    questionContainer.className = 'individual-question-container';
    questionContainer.dataset.questionIndex = questionIndex;
    
    // Progress indicator for this question
    const progressDiv = document.createElement('div');
    progressDiv.className = 'question-progress';
    const isFinalBoss = questionIndex >= questions.length;
    progressDiv.innerHTML = `
        <div class="question-number">${isFinalBoss ? 'FINAL BOSS' : `Question ${questionIndex + 1} of ${questions.length}`}</div>
        <div class="question-axis">${question.axis}</div>
    `;
    
    // Question text
    const questionTextDiv = document.createElement('p');
    questionTextDiv.className = 'question-text';
    questionTextDiv.textContent = question.question;
    
    // Choices container
    const choicesContainer = document.createElement('div');
    choicesContainer.className = 'choices-container';
    
    // Create choice options
    question.choices.forEach((choice, index) => {
        const choiceDiv = document.createElement('div');
        choiceDiv.className = 'choice-option';
        choiceDiv.dataset.choice = choice;
        choiceDiv.dataset.correct = choice === question.correct_answer;
        
        const choiceText = document.createElement('div');
        choiceText.className = 'choice-text';
        choiceText.textContent = choice;
        
        const explanation = document.createElement('div');
        explanation.className = 'explanation';
        explanation.textContent = question.explanations[choice.charAt(0)];
        
        choiceDiv.appendChild(choiceText);
        choiceDiv.appendChild(explanation);
        
        // Add click event listener
        choiceDiv.addEventListener('click', () => handleChoiceSelection(choiceDiv, question, questionContainer));
        
        choicesContainer.appendChild(choiceDiv);
    });
    
    // Next question button for this specific question
    const nextQuestionContainer = document.createElement('div');
    nextQuestionContainer.className = 'next-question-container hidden';
    
    // Check if this is the last question
    if (questionIndex === questions.length - 1) {
        // Last question - show completion button
        nextQuestionContainer.innerHTML = `
            <button class="btn btn-success next-question-btn" data-question-index="${questionIndex}">
                Complete Case
            </button>
        `;
    } else {
        // Not the last question - show next question button
        nextQuestionContainer.innerHTML = `
            <button class="btn btn-secondary next-question-btn" data-question-index="${questionIndex}">
                Show next foundational question
            </button>
        `;
    }
    
    // Add event listener to the next question button
    const nextBtn = nextQuestionContainer.querySelector('.next-question-btn');
    nextBtn.addEventListener('click', () => {
        if (questionIndex === questions.length - 1) {
            // Last question - show completion
            showCompletionMessage();
        } else {
            // Show next question
            showNextQuestion(questionIndex + 1);
        }
    });
    
    // Assemble the question container
    questionContainer.appendChild(progressDiv);
    questionContainer.appendChild(questionTextDiv);
    questionContainer.appendChild(choicesContainer);
    questionContainer.appendChild(nextQuestionContainer);
    
    return questionContainer;
}

// Update progress bar
function updateProgressBar(currentQuestion, totalQuestions) {
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    const percentage = (currentQuestion / totalQuestions) * 100;
    progressFill.style.width = `${percentage}%`;
    progressText.textContent = `Question ${currentQuestion} of ${totalQuestions}`;
}



// Handle choice selection
function handleChoiceSelection(selectedChoice, question, questionContainer) {
    // Get all choices for this specific question
    const allChoices = questionContainer.querySelectorAll('.choice-option');
    
    // Disable all choices to prevent multiple selections
    allChoices.forEach(choice => {
        choice.style.pointerEvents = 'none';
    });
    
    // Mark the selected choice
    selectedChoice.classList.add('selected');
    
    // Check if the answer is correct
    const isCorrect = selectedChoice.dataset.correct === 'true';
    
    // Apply correct/incorrect styling to all choices
    allChoices.forEach(choice => {
        if (choice.dataset.correct === 'true') {
            choice.classList.add('correct');
        } else {
            choice.classList.add('incorrect');
        }
        
        // Show explanations for all choices
        choice.classList.add('show-explanation');
    });
    
    // Show next question button for this specific question
    const nextQuestionContainer = questionContainer.querySelector('.next-question-container');
    nextQuestionContainer.classList.remove('hidden');
    nextQuestionContainer.classList.add('fade-in-up');
}

// Show next question
function showNextQuestion(nextQuestionIndex) {
    currentQuestionIndex = nextQuestionIndex;
    
    // Show the next question (this function is only called for non-last questions)
    showQuestion(currentQuestionIndex);
}

// Show completion message
function showCompletionMessage() {
    const completionDiv = document.createElement('div');
    completionDiv.className = 'completion-message';
    completionDiv.innerHTML = `
        <div style="text-align: center; padding: 28px;">
            <h2 style="margin-bottom: 12px;">🎉 Case Complete!</h2>
            <p style="font-size: 1.05rem; color: #6c757d; margin-bottom: 18px;">
                You have successfully completed all ${questions.length} foundational questions for this case.
            </p>
            <div style="background: #f8f9fa; color: #2c3e50; padding: 16px; border-radius: 10px;">
                <h3 style="margin-bottom: 10px;">Case Summary</h3>
                <p><strong>Diagnosis:</strong> ${caseData.topic}</p>
                <p><strong>Questions Completed:</strong> ${questions.length}</p>
                <p><strong>Topics Covered:</strong> ${questions.map(q => q.axis).join(', ')}</p>
            </div>
            <div class="completion-actions">
                <button id="show-integration-btn" class="btn btn-primary btn-pill" style="margin-top: 18px;">Show Integration Question</button>
                <div class="descriptor-text">Test your ability to integrate this topic with a FINAL BOSS question</div>
            </div>
        </div>
    `;

    questionSection.appendChild(completionDiv);
    completionDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Wire up integration button
    const integrationBtn = completionDiv.querySelector('#show-integration-btn');
    integrationBtn.addEventListener('click', () => {
        showIntegrationQuestion();
        integrationBtn.disabled = true;
    });
}

// Show follow-up integration question
function showIntegrationQuestion() {
    const integration = caseData.follow_up_integration;
    if (!integration || !integration.variation_question) return;

    const q = integration.variation_question;
    const question = {
        axis: 'Integration Question',
        question: q.question,
        choices: q.choices,
        correct_answer: q.correct_answer,
        explanations: q.explanations
    };

    const questionContainer = createQuestionContainer(question, questions.length); // index after last
    questionSection.appendChild(questionContainer);
    questionContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Replace the next button inside this container to say Next topic (placeholder)
    const nextContainer = questionContainer.querySelector('.next-question-container');
    nextContainer.innerHTML = `
        <button class="btn btn-secondary btn-pill" id="next-topic-btn">Next topic</button>
    `;
    const nextTopicBtn = nextContainer.querySelector('#next-topic-btn');
    nextTopicBtn.addEventListener('click', () => {
        // Placeholder nonfunctional action
        nextTopicBtn.disabled = true;
    });
}

// Add some additional utility functions for better user experience
function addLoadingState() {
    submitDiagnosisBtn.textContent = 'Submitting...';
    submitDiagnosisBtn.disabled = true;
}

function removeLoadingState() {
    submitDiagnosisBtn.textContent = 'Submit Diagnosis';
    submitDiagnosisBtn.disabled = false;
}

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.ctrlKey) {
        // Ctrl+Enter to submit diagnosis
        if (!diagnosisInput.disabled) {
            handleDiagnosisSubmission();
        }
    }
});

// Add smooth scrolling for better UX
function scrollToElement(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}
