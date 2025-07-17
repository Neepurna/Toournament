export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  round: number;
  category: string;
  explanation?: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Round 1: Easy (Difficulty 1)
  {
    id: 1,
    question: "What is the chemical symbol for water?",
    options: ["O₂", "CO₂", "H₂O", "NaCl"],
    correctAnswer: 2,
    difficulty: 1,
    round: 1,
    category: "Science"
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1,
    difficulty: 1,
    round: 1,
    category: "Science"
  },
  {
    id: 3,
    question: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Michelangelo", "Leonardo da Vinci"],
    correctAnswer: 3,
    difficulty: 1,
    round: 1,
    category: "Art"
  },
  {
    id: 4,
    question: "What is the capital city of Japan?",
    options: ["Beijing", "Seoul", "Tokyo", "Bangkok"],
    correctAnswer: 2,
    difficulty: 1,
    round: 1,
    category: "Geography"
  },
  {
    id: 5,
    question: "In which sport would you perform a slam dunk?",
    options: ["Baseball", "Basketball", "Soccer", "Tennis"],
    correctAnswer: 1,
    difficulty: 1,
    round: 1,
    category: "Sports"
  },
  {
    id: 6,
    question: "How many continents are there in the world?",
    options: ["5", "6", "7", "8"],
    correctAnswer: 2,
    difficulty: 1,
    round: 1,
    category: "Geography"
  },
  {
    id: 7,
    question: "Who wrote the \"Harry Potter\" series of books?",
    options: ["J.R.R. Tolkien", "George R.R. Martin", "J.K. Rowling", "C.S. Lewis"],
    correctAnswer: 2,
    difficulty: 1,
    round: 1,
    category: "Literature"
  },
  {
    id: 8,
    question: "What is the main character's name in the \"Star Wars\" original trilogy?",
    options: ["Han Solo", "Luke Skywalker", "Darth Vader", "Obi-Wan Kenobi"],
    correctAnswer: 1,
    difficulty: 1,
    round: 1,
    category: "Entertainment"
  },
  {
    id: 9,
    question: "Which country is famous for its pyramids?",
    options: ["Greece", "Rome", "Mexico", "Egypt"],
    correctAnswer: 3,
    difficulty: 1,
    round: 1,
    category: "History"
  },
  {
    id: 10,
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    correctAnswer: 3,
    difficulty: 1,
    round: 1,
    category: "Geography"
  },
  
  // Round 2: Medium (Difficulty 2)
  {
    id: 21,
    question: "Which element has the chemical symbol 'Au'?",
    options: ["Silver", "Aluminum", "Gold", "Argon"],
    correctAnswer: 2,
    difficulty: 2,
    round: 2,
    category: "Science"
  },
  {
    id: 22,
    question: "Who wrote the famous novel \"1984\"?",
    options: ["Aldous Huxley", "George Orwell", "Ray Bradbury", "Philip K. Dick"],
    correctAnswer: 1,
    difficulty: 2,
    round: 2,
    category: "Literature"
  },
  {
    id: 23,
    question: "The ancient city of Rome was built on how many hills?",
    options: ["Five", "Seven", "Nine", "Twelve"],
    correctAnswer: 1,
    difficulty: 2,
    round: 2,
    category: "History"
  },
  {
    id: 24,
    question: "What is the powerhouse of the cell?",
    options: ["Nucleus", "Ribosome", "Cytoplasm", "Mitochondrion"],
    correctAnswer: 3,
    difficulty: 2,
    round: 2,
    category: "Science"
  },
  {
    id: 25,
    question: "Which artist is famous for co-founding the Cubist movement?",
    options: ["Salvador Dalí", "Claude Monet", "Pablo Picasso", "Rembrandt"],
    correctAnswer: 2,
    difficulty: 2,
    round: 2,
    category: "Art"
  },
  {
    id: 26,
    question: "In Greek mythology, who was the god of the sea?",
    options: ["Zeus", "Hades", "Poseidon", "Apollo"],
    correctAnswer: 2,
    difficulty: 2,
    round: 2,
    category: "Mythology"
  },
  {
    id: 27,
    question: "What is the longest river in the world?",
    options: ["Amazon", "Nile", "Yangtze", "Mississippi"],
    correctAnswer: 1,
    difficulty: 2,
    round: 2,
    category: "Geography"
  },
  {
    id: 28,
    question: "Which movie won the first-ever Academy Award for Best Picture in 1929?",
    options: ["The Jazz Singer", "Metropolis", "Wings", "The Circus"],
    correctAnswer: 2,
    difficulty: 2,
    round: 2,
    category: "Entertainment"
  },
  {
    id: 29,
    question: "The assassination of which Archduke triggered the start of World War I?",
    options: ["Franz Ferdinand", "Otto von Bismarck", "Wilhelm II", "Nicholas II"],
    correctAnswer: 0,
    difficulty: 2,
    round: 2,
    category: "History"
  },
  {
    id: 30,
    question: "What is the term for a word that is spelled the same forwards and backwards?",
    options: ["Anagram", "Palindrome", "Onomatopoeia", "Antonym"],
    correctAnswer: 1,
    difficulty: 2,
    round: 2,
    category: "Language"
  },

  // Round 3: Hard (Difficulty 3)
  {
    id: 41,
    question: "Who is credited with formulating the laws of planetary motion?",
    options: ["Galileo Galilei", "Nicolaus Copernicus", "Johannes Kepler", "Isaac Newton"],
    correctAnswer: 2,
    difficulty: 3,
    round: 3,
    category: "Science"
  },
  {
    id: 42,
    question: "The \"War of Jenkins' Ear\" was a conflict between which two 18th-century powers?",
    options: ["France and Prussia", "Great Britain and Spain", "Russia and the Ottoman Empire", "Netherlands and Portugal"],
    correctAnswer: 1,
    difficulty: 3,
    round: 3,
    category: "History"
  },
  {
    id: 43,
    question: "In chemistry, what is the name for the process where a solid turns directly into a gas?",
    options: ["Evaporation", "Condensation", "Deposition", "Sublimation"],
    correctAnswer: 3,
    difficulty: 3,
    round: 3,
    category: "Science"
  },
  {
    id: 44,
    question: "Which philosopher wrote the seminal work \"Critique of Pure Reason\"?",
    options: ["René Descartes", "John Locke", "Immanuel Kant", "David Hume"],
    correctAnswer: 2,
    difficulty: 3,
    round: 3,
    category: "Philosophy"
  },
  {
    id: 45,
    question: "The ancient wonder, the Mausoleum at Halicarnassus, was located in which modern-day country?",
    options: ["Greece", "Egypt", "Italy", "Turkey"],
    correctAnswer: 3,
    difficulty: 3,
    round: 3,
    category: "History"
  },

  // Round 4: Expert (Difficulty 4)
  {
    id: 61,
    question: "What is the only letter of the alphabet that does not appear in the name of any element on the periodic table?",
    options: ["Q", "X", "J", "Z"],
    correctAnswer: 2,
    difficulty: 4,
    round: 4,
    category: "Science"
  },
  {
    id: 62,
    question: "The 1494 Treaty of Tordesillas divided the \"New World\" between which two colonial powers?",
    options: ["England and France", "Spain and Portugal", "Netherlands and Spain", "Portugal and France"],
    correctAnswer: 1,
    difficulty: 4,
    round: 4,
    category: "History"
  },
  {
    id: 63,
    question: "In Dante's \"Inferno,\" who is the ferryman that transports souls across the river Acheron?",
    options: ["Phlegyas", "Minos", "Cerberus", "Charon"],
    correctAnswer: 3,
    difficulty: 4,
    round: 4,
    category: "Literature"
  },
  {
    id: 64,
    question: "The \"Wow! signal,\" a strong narrowband radio signal detected in 1977, appeared to originate from which constellation?",
    options: ["Orion", "Cygnus", "Sagittarius", "Ursa Major"],
    correctAnswer: 2,
    difficulty: 4,
    round: 4,
    category: "Science"
  },
  {
    id: 65,
    question: "Which composer's Symphony No. 8 is nicknamed the \"Symphony of a Thousand\"?",
    options: ["Ludwig van Beethoven", "Gustav Mahler", "Anton Bruckner", "Richard Wagner"],
    correctAnswer: 1,
    difficulty: 4,
    round: 4,
    category: "Music"
  },

  // Round 5: Genius (Difficulty 5)
  {
    id: 81,
    question: "Andrew Wiles's 1994 proof of which long-standing mathematical problem is considered one of the greatest achievements of modern mathematics?",
    options: ["The Riemann Hypothesis", "The Poincaré Conjecture", "Goldbach's Conjecture", "Fermat's Last Theorem"],
    correctAnswer: 3,
    difficulty: 5,
    round: 5,
    category: "Mathematics"
  },
  {
    id: 82,
    question: "The \"Edict of Milan,\" which granted religious tolerance throughout the Roman Empire, was issued in 313 AD by Emperor Constantine I and which co-emperor?",
    options: ["Maxentius", "Licinius", "Diocletian", "Galerius"],
    correctAnswer: 1,
    difficulty: 5,
    round: 5,
    category: "History"
  },
  {
    id: 83,
    question: "In Hermann Hesse's novel \"The Glass Bead Game,\" what is the official title held by the protagonist, Joseph Knecht?",
    options: ["Ludi Magister Primus", "Pater Gnosus", "Magister Ludi", "Rector Scholae"],
    correctAnswer: 2,
    difficulty: 5,
    round: 5,
    category: "Literature"
  },
  {
    id: 84,
    question: "What is the common name for the chemical pigment ferric ferrocyanide (Fe₄[Fe(CN)₆]₃)?",
    options: ["Veridian Green", "Cadmium Yellow", "Prussian Blue", "Cobalt Violet"],
    correctAnswer: 2,
    difficulty: 5,
    round: 5,
    category: "Science"
  },
  {
    id: 85,
    question: "The Tunguska event of 1908, a massive explosion over Siberia, is most widely hypothesized to have been caused by what?",
    options: ["A volcanic eruption", "A natural gas explosion", "The air burst of a meteoroid or comet fragment", "An early test of a Tesla weapon"],
    correctAnswer: 2,
    difficulty: 5,
    round: 5,
    category: "Science"
  }
];

export const DIFFICULTY_SETTINGS = {
  1: { timeLimit: 30, pointsBase: 100, color: '#4CAF50' },
  2: { timeLimit: 25, pointsBase: 200, color: '#FF9800' },
  3: { timeLimit: 20, pointsBase: 400, color: '#F44336' },
  4: { timeLimit: 15, pointsBase: 800, color: '#9C27B0' },
  5: { timeLimit: 10, pointsBase: 1600, color: '#E91E63' }
};

export const GAME_SETTINGS = {
  TIME_BONUS_CORRECT: 5, // seconds added for correct answer
  TIME_PENALTY_WRONG: 0, // seconds lost for wrong answer
  INITIAL_TIME: 60, // starting time in seconds
  MAX_TIME: 120, // maximum time allowed
  STREAK_BONUS_MULTIPLIER: 1.5, // multiplier for consecutive correct answers
  DIFFICULTY_INCREASE_INTERVAL: 5 // increase difficulty every N questions
};
