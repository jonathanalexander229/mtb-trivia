// App configuration
const cfg = "eyJhcGlLZXkiOiJBSXphU3lBbkdyYjNybWp6UGdsSWQ2YkJUUVhpczZVaVBXTXl4YzQiLCJhdXRoRG9tYWluIjoibXRiLXRyaXZpYS5maXJlYmFzZWFwcC5jb20iLCJwcm9qZWN0SWQiOiJtdGItdHJpdmlhIiwic3RvcmFnZUJ1Y2tldCI6Im10Yi10cml2aWEuZmlyZWJhc2VzdG9yYWdlLmFwcCIsIm1lc3NhZ2luZ1NlbmRlcklkIjoiODkyNTE0MjQ5MjEyIiwiYXBwSWQiOiIxOjg5MjUxNDI0OTIxMjp3ZWI6YjE3MTExMTA2MjkwNDMyNzcyYWE3OSIsIm1lYXN1cmVtZW50SWQiOiJHLTkxNkxRUks2QzcifQo=";
const appConfig = JSON.parse(atob(cfg));

// Initialize Firebase
firebase.initializeApp(appConfig);
const db = firebase.firestore();

// Global variables
let questionsDB = null;
let currentDifficulty = '';
let currentQuestionIndex = 0;
let score = 0;
let gameQuestions = [];
let answered = false;
let currentQuestionId = null;
let editMode = false;

// Default questions database (fallback)
const defaultQuestionsDB = {
    "version": "1.0",
    "questions": {
        "easy": [
            {
                "id": "easy_001",
                "category": "Parts",
                "question": "What does 'MTB' stand for?",
                "answers": ["Mountain Trail Bike", "Mountain Bike", "Multi-Terrain Bicycle", "Motor Trail Bike"],
                "correct": 1,
                "explanation": "MTB is the common abbreviation for Mountain Bike."
            },
            {
                "id": "easy_002",
                "category": "Manufacturers",
                "question": "Which company makes the 'Stumpjumper' mountain bike?",
                "answers": ["Giant", "Specialized", "Cannondale", "Scott"],
                "correct": 1,
                "explanation": "The Stumpjumper is Specialized's iconic mountain bike model."
            },
            {
                "id": "easy_003",
                "category": "Parts",
                "question": "What part of the bike do you use to stop?",
                "answers": ["Pedals", "Handlebars", "Brakes", "Seat"],
                "correct": 2,
                "explanation": "Brakes are used to slow down and stop the bicycle."
            },
            {
                "id": "easy_004",
                "category": "Accessories",
                "question": "What should you always wear when mountain biking for safety?",
                "answers": ["Sunglasses", "Helmet", "Gloves", "Knee pads"],
                "correct": 1,
                "explanation": "A helmet is essential safety equipment that protects your head."
            },
            {
                "id": "easy_005",
                "category": "Events",
                "question": "What is Crankworx?",
                "answers": ["A bike part", "A mountain bike festival", "A trail name", "A riding technique"],
                "correct": 1,
                "explanation": "Crankworx is the world's largest mountain bike festival series."
            }
        ],
        "medium": [
            {
                "id": "medium_001",
                "category": "Suspension",
                "question": "What does 'hardtail' mean in mountain biking?",
                "answers": ["Bike with front suspension only", "Bike with rear suspension only", "Bike with no suspension", "Bike with both front and rear suspension"],
                "correct": 0,
                "explanation": "A hardtail has front suspension but no rear suspension."
            },
            {
                "id": "medium_002",
                "category": "Parts",
                "question": "What is a 'derailleur' used for?",
                "answers": ["Braking", "Steering", "Changing gears", "Suspension"],
                "correct": 2,
                "explanation": "The derailleur moves the chain between different gears."
            },
            {
                "id": "medium_003",
                "category": "Riders",
                "question": "Who is considered one of the greatest downhill mountain bikers of all time?",
                "answers": ["Greg Minnaar", "Lance Armstrong", "Tony Hawk", "Usain Bolt"],
                "correct": 0,
                "explanation": "Greg Minnaar is a multiple-time Downhill World Champion."
            },
            {
                "id": "medium_004",
                "category": "Events",
                "question": "Where was Crankworx mountain bike festival first held?",
                "answers": ["Whistler, Canada", "Moab, USA", "Chamonix, France", "Rotorua, New Zealand"],
                "correct": 0,
                "explanation": "Crankworx began in Whistler, British Columbia in 2004."
            },
            {
                "id": "medium_005",
                "category": "Parts",
                "question": "What is a 'dropper post'?",
                "answers": ["A post that drops the bike", "An adjustable height seat post", "A brake component", "A gear shifter"],
                "correct": 1,
                "explanation": "A dropper post allows you to adjust saddle height while riding."
            }
        ],
        "hard": [
            {
                "id": "hard_001",
                "category": "Suspension",
                "question": "What is the difference between air and coil suspension?",
                "answers": ["Air is lighter, coil is more consistent", "Coil is lighter, air is heavier", "No difference", "Air is only for rear, coil for front"],
                "correct": 0,
                "explanation": "Air shocks are lighter and adjustable, while coil shocks provide more consistent performance."
            },
            {
                "id": "hard_002",
                "category": "History",
                "question": "Who designed the first Specialized Stumpjumper frame?",
                "answers": ["Mike Sinyard", "Tim Neenan", "Gary Fisher", "Tom Ritchey"],
                "correct": 1,
                "explanation": "Tim Neenan designed the original Stumpjumper frame for Specialized."
            },
            {
                "id": "hard_003",
                "category": "Records",
                "question": "What is the fastest recorded speed on a mountain bike?",
                "answers": ["138 mph", "141 mph", "156 mph", "164 mph"],
                "correct": 1,
                "explanation": "Eric Barone set the record at 141 mph in 2017 on a snowy ski slope."
            },
            {
                "id": "hard_004",
                "category": "Events",
                "question": "What is the 'Triple Crown of Slopestyle' at Crankworx?",
                "answers": ["Winning 3 events in a season", "Winning 3 years in a row", "3 different trick categories", "3 different locations"],
                "correct": 0,
                "explanation": "The Triple Crown requires winning all three Crankworx slopestyle events in one season."
            },
            {
                "id": "hard_005",
                "category": "Technology",
                "question": "What is Specialized's GENIE shock technology?",
                "answers": ["Electronic damping", "Dual air chambers with PSA spring", "Coil-over design", "Magnetic damping"],
                "correct": 1,
                "explanation": "GENIE features dual air chambers with a Progressive Spring Assistant (PSA)."
            }
        ]
    },
    "metadata": {
        "total_questions": 15,
        "questions_by_difficulty": {
            "easy": 5,
            "medium": 5,
            "hard": 5
        }
    }
};

// Initialize the game
document.addEventListener('DOMContentLoaded', function() {
    // Check for UCI DH secret parameter
    const params = new URLSearchParams(window.location.search);
    if (params.get('ucidh') === '1990') {
        editMode = true;
        showEditModeIndicator();
    }
    
    loadQuestionsFromFile();
});

function showEditModeIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'edit-mode-indicator';
    indicator.innerHTML = '🔧 UCI DH Edit Mode';
    document.body.appendChild(indicator);
}

async function loadQuestionsFromFile() {
    try {
        // Try to load from Firebase first
        const snapshot = await db.collection('questions').get();
        const firebaseQuestions = {easy: [], medium: [], hard: []};
        
        snapshot.forEach(doc => {
            const data = doc.data();
            if (firebaseQuestions[data.difficulty]) {
                firebaseQuestions[data.difficulty].push({
                    id: doc.id,  // Include the document ID
                    ...data
                });
            }
        });
        
        if (!snapshot.empty) {
            questionsDB = {
                version: "firebase",
                questions: firebaseQuestions,
                metadata: {
                    total_questions: snapshot.size,
                    questions_by_difficulty: {
                        easy: firebaseQuestions.easy.length,
                        medium: firebaseQuestions.medium.length,
                        hard: firebaseQuestions.hard.length
                    }
                }
            };
            showDBInfo();
            showDifficultySelector();
            return;
        }
    } catch (error) {
        console.warn('Could not load from Firebase:', error);
    }
    
    // Fallback to default questions
    console.log('Using default questions');
    loadDefaultQuestions();
}

function loadDefaultQuestions() {
    questionsDB = defaultQuestionsDB;
    showDBInfo();
    showDifficultySelector();
}

function validateQuestionsDB(db) {
    if (!db || !db.questions) return false;
    if (!db.questions.easy || !db.questions.medium || !db.questions.hard) return false;
    
    // Check if each difficulty has at least one question
    const difficulties = ['easy', 'medium', 'hard'];
    for (let difficulty of difficulties) {
        if (!Array.isArray(db.questions[difficulty]) || db.questions[difficulty].length === 0) {
            return false;
        }
        
        // Validate question structure
        for (let question of db.questions[difficulty]) {
            if (!question.question || !question.answers || !Array.isArray(question.answers) || 
                question.answers.length !== 4 || typeof question.correct !== 'number') {
                return false;
            }
        }
    }
    return true;
}

function showDBInfo() {
    const dbInfo = document.getElementById('dbInfo');
    const dbStats = document.getElementById('dbStats');
    
    const metadata = questionsDB.metadata || {};
    const totalQuestions = metadata.total_questions || 'Unknown';
    const version = questionsDB.version || '1.0';
    
    dbStats.innerHTML = `
        <p><strong>Version:</strong> ${version} | <strong>Total Questions:</strong> ${totalQuestions}</p>
        <p><strong>Easy:</strong> ${questionsDB.questions.easy.length} | 
           <strong>Medium:</strong> ${questionsDB.questions.medium.length} | 
           <strong>Hard:</strong> ${questionsDB.questions.hard.length}</p>
    `;
}

function showDifficultySelector() {
    document.getElementById('dbInfo').style.display = 'none';
    document.getElementById('difficultySelector').style.display = 'flex';
}

function selectDifficulty(difficulty) {
    if (!questionsDB || !questionsDB.questions[difficulty]) {
        alert('Questions not available for this difficulty');
        return;
    }

    currentDifficulty = difficulty;
    currentQuestionIndex = 0;
    score = 0;
    answered = false;
    
    // Update active button
    document.querySelectorAll('.difficulty-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.difficulty-btn.${difficulty}`).classList.add('active');
    
    // Get questions for this difficulty
    gameQuestions = [...questionsDB.questions[difficulty]];
    shuffleArray(gameQuestions);
    
    // Set question count based on difficulty
    const questionCounts = {
        easy: 5,
        medium: 10,
        hard: gameQuestions.length // Use all available hard questions
    };
    const maxQuestions = questionCounts[difficulty] || 10;
    gameQuestions = gameQuestions.slice(0, Math.min(maxQuestions, gameQuestions.length));
    
    // Show question section
    document.getElementById('questionSection').classList.add('active');
    document.getElementById('gameOver').classList.remove('show');
    
    loadQuestion();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function loadQuestion() {
    if (currentQuestionIndex >= gameQuestions.length) {
        endGame();
        return;
    }

    const question = gameQuestions[currentQuestionIndex];
    answered = false;
    currentQuestionId = question.id || null;
    
    document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
    document.getElementById('totalQuestions').textContent = gameQuestions.length;
    document.getElementById('currentScore').textContent = score;
    document.getElementById('categoryIndicator').textContent = question.category || 'General';
    const questionTextElement = document.getElementById('questionText');
    questionTextElement.textContent = question.question;
    
    // Enable editing if in edit mode
    if (editMode && currentQuestionId) {
        questionTextElement.contentEditable = true;
        questionTextElement.className = 'editable';
        questionTextElement.onblur = () => saveQuestionEdit();
        
        // Add save button if not already there
        if (!document.getElementById('saveQuestionBtn')) {
            const saveBtn = document.createElement('button');
            saveBtn.id = 'saveQuestionBtn';
            saveBtn.className = 'save-btn';
            saveBtn.textContent = 'Save';
            saveBtn.onclick = saveQuestionEdit;
            questionTextElement.parentNode.appendChild(saveBtn);
        }
    } else {
        questionTextElement.contentEditable = false;
        questionTextElement.className = '';
        const saveBtn = document.getElementById('saveQuestionBtn');
        if (saveBtn) saveBtn.remove();
    }
    
    document.getElementById('nextBtn').classList.remove('show');
    document.getElementById('explanation').classList.remove('show');
    document.getElementById('voteSection').classList.remove('show');
    
    // Reset vote buttons
    document.querySelectorAll('.vote-btn').forEach(btn => {
        btn.classList.remove('voted');
        btn.style.pointerEvents = 'auto';
    });
    
    // Reset vote button text
    const upvoteBtn = document.querySelector('.vote-btn.upvote');
    const downvoteBtn = document.querySelector('.vote-btn.downvote');
    if (upvoteBtn) upvoteBtn.innerHTML = '👍 Good Question';
    if (downvoteBtn) downvoteBtn.innerHTML = '👎 Poor Question';
    
    const answersGrid = document.getElementById('answersGrid');
    answersGrid.innerHTML = '';
    
    question.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.className = 'answer-btn';
        button.textContent = answer;
        
        if (editMode && currentQuestionId) {
            // Make answer editable
            button.contentEditable = true;
            button.classList.add('editable');
            button.onblur = () => saveAnswerEdit(index);
            button.onclick = (e) => {
                e.preventDefault(); // Prevent answer selection when editing
                button.focus();
            };
        } else {
            button.onclick = () => selectAnswer(index);
        }
        
        answersGrid.appendChild(button);
    });
    
    // In edit mode, show next button immediately since we're not "answering"
    if (editMode && currentQuestionId) {
        setTimeout(() => {
            document.getElementById('nextBtn').classList.add('show');
        }, 500);
    }
}

function selectAnswer(selectedIndex) {
    if (answered) return;
    
    answered = true;
    const question = gameQuestions[currentQuestionIndex];
    const buttons = document.querySelectorAll('.answer-btn');
    
    buttons[selectedIndex].classList.add(selectedIndex === question.correct ? 'correct' : 'incorrect');
    
    if (selectedIndex === question.correct) {
        score++;
        document.getElementById('currentScore').textContent = score;
    } else {
        buttons[question.correct].classList.add('correct');
    }
    
    // Disable all buttons
    buttons.forEach(btn => btn.style.pointerEvents = 'none');
    
    // Show explanation if available
    if (question.explanation) {
        const explanationDiv = document.getElementById('explanation');
        explanationDiv.textContent = question.explanation;
        explanationDiv.classList.add('show');
    }
    
    // Show vote section and next button after animation
    setTimeout(() => {
        // Only show vote section if not in edit mode and question has ID
        if (!editMode && currentQuestionId) {
            document.getElementById('voteSection').classList.add('show');
        }
        document.getElementById('nextBtn').classList.add('show');
    }, 1000);
}

async function voteQuestion(voteType) {
    console.log('Vote clicked:', voteType, 'Question ID:', currentQuestionId);
    
    if (!currentQuestionId) {
        console.warn('No question ID available for voting');
        alert('Cannot vote - no question ID');
        return;
    }
    
    try {
        const questionRef = db.collection('questions').doc(currentQuestionId);
        const doc = await questionRef.get();
        
        if (doc.exists) {
            const data = doc.data();
            const currentUpvotes = data.upvotes || 0;
            const currentDownvotes = data.downvotes || 0;
            
            const updateData = {};
            if (voteType === 'up') {
                updateData.upvotes = currentUpvotes + 1;
            } else {
                updateData.downvotes = currentDownvotes + 1;
            }
            
            await questionRef.update(updateData);
            
            // Mark vote buttons as voted
            document.querySelectorAll('.vote-btn').forEach(btn => {
                btn.classList.add('voted');
                btn.style.pointerEvents = 'none';
            });
            
            // Update button text to show vote was recorded
            const voteBtn = document.querySelector(`.vote-btn.${voteType}vote`);
            if (voteBtn) {
                voteBtn.innerHTML = voteType === 'up' ? '👍 Voted!' : '👎 Voted!';
            }
            
            console.log(`${voteType} vote recorded for question ${currentQuestionId}`);
        } else {
            console.warn('Question not found in database');
        }
    } catch (error) {
        console.error('Error voting on question:', error);
        alert('Error recording vote');
    }
}

async function saveQuestionEdit() {
    if (!currentQuestionId || !editMode) return;
    
    try {
        const newQuestionText = document.getElementById('questionText').textContent.trim();
        if (!newQuestionText) {
            alert('Question cannot be empty');
            return;
        }
        
        await db.collection('questions').doc(currentQuestionId).update({
            question: newQuestionText
        });
        
        // Update local data
        gameQuestions[currentQuestionIndex].question = newQuestionText;
        
        console.log('Question updated successfully');
        
        // Visual feedback
        const saveBtn = document.getElementById('saveQuestionBtn');
        if (saveBtn) {
            saveBtn.textContent = 'Saved!';
            saveBtn.style.background = '#4CAF50';
            setTimeout(() => {
                saveBtn.textContent = 'Save';
                saveBtn.style.background = '';
            }, 2000);
        }
        
    } catch (error) {
        console.error('Error updating question:', error);
        alert('Error saving question');
    }
}

async function saveAnswerEdit(answerIndex) {
    if (!currentQuestionId || !editMode) return;
    
    try {
        const answerButtons = document.querySelectorAll('.answer-btn');
        const newAnswerText = answerButtons[answerIndex].textContent.trim();
        
        if (!newAnswerText) {
            alert('Answer cannot be empty');
            answerButtons[answerIndex].textContent = gameQuestions[currentQuestionIndex].answers[answerIndex];
            return;
        }
        
        // Update the answers array
        const updatedAnswers = [...gameQuestions[currentQuestionIndex].answers];
        updatedAnswers[answerIndex] = newAnswerText;
        
        await db.collection('questions').doc(currentQuestionId).update({
            answers: updatedAnswers
        });
        
        // Update local data
        gameQuestions[currentQuestionIndex].answers[answerIndex] = newAnswerText;
        
        console.log(`Answer ${answerIndex + 1} updated successfully`);
        
        // Visual feedback
        answerButtons[answerIndex].style.background = 'rgba(76, 175, 80, 0.3)';
        setTimeout(() => {
            answerButtons[answerIndex].style.background = '';
        }, 2000);
        
    } catch (error) {
        console.error('Error updating answer:', error);
        alert('Error saving answer');
    }
}

function nextQuestion() {
    currentQuestionIndex++;
    loadQuestion();
}

function endGame() {
    document.getElementById('questionSection').classList.remove('active');
    document.getElementById('gameOver').classList.add('show');
    
    const percentage = Math.round((score / gameQuestions.length) * 100);
    document.getElementById('finalScore').textContent = `${score}/${gameQuestions.length} (${percentage}%)`;
    
    let message = '';
    if (percentage >= 90) {
        message = "🏆 Mountain Bike Master! You know your stuff!";
    } else if (percentage >= 70) {
        message = "🚵‍♂️ Solid rider! You've got good MTB knowledge!";
    } else if (percentage >= 50) {
        message = "⛰️ Getting there! Time for more trail experience!";
    } else {
        message = "🌱 Keep learning! Every expert was once a beginner!";
    }
    
    document.getElementById('scoreMessage').textContent = message;
}

function restartGame() {
    if (currentDifficulty) {
        selectDifficulty(currentDifficulty);
    } else {
        showDifficultySelector();
        document.getElementById('questionSection').classList.remove('active');
        document.getElementById('gameOver').classList.remove('show');
    }
}

function showDifficultySelector() {
    document.getElementById('questionSection').classList.remove('active');
    document.getElementById('gameOver').classList.remove('show');
    document.querySelectorAll('.difficulty-btn').forEach(btn => btn.classList.remove('active'));
    currentDifficulty = '';
}