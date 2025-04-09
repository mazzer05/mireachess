<script setup>
import { ref, onMounted, onBeforeMount } from "vue";
import { TheChessboard } from "vue3-chessboard";
import "vue3-chessboard/style.css";
import axios from "axios";
import "./styles.css";
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const isGameStarted = ref(true); // Changed to true since we're now in the game route
const selectedDifficulty = ref(route.query.difficulty || "1");
const selectedColor = ref(route.query.color || "w");
const moveHistory = ref([]);
let boardAPI;
const isModalVisible = ref(false);
const isDrawModalVisible = ref(false);
const isResignModalVisible = ref(false);
const winner = ref('');
const boardConfigForWhite = {
  coordinates: true,
  orientation: "white",
};

//Сдаться
function confirmResign() {
  handleCheckmate(selectedColor.value === 'w' ? 'b' : 'w'); // Pass the opposite color as winner
  isResignModalVisible.value = false;
}

//Мат
function handleCheckmate(isMated) {
  const winnerColor = isMated === 'w' ? 'Чёрные' : 'Белые';
  winner.value = winnerColor;
  isModalVisible.value = true;
  setTimeout(() => {
    router.push('/');
  }, 2000);
}

//Ничья
function handleDraw() {
  isDrawModalVisible.value = true;
  setTimeout(() => {
    router.push('/');
  }, 2000);
}

onMounted(() => {
  const script = document.createElement("script");
  script.src = "https://telegram.org/js/telegram-web-app.js";
  script.async = true;
  document.body.appendChild(script);
  
  // Initialize the game with the selected color and difficulty
  startGame();
});

async function startGame() {
  let diff = 1;
  if (selectedDifficulty.value === "2") {
    diff = 10;
  } else if (selectedDifficulty.value === "3") {
    diff = 20;
  }
  console.log(diff);
  try {
    const response = await axios.post("http://localhost:8000/api/start", {
      diff: diff,
    });
    console.log(response.data);
  } catch (error) {
    console.error("Ошибка при отправке запроса: ", error);
  }

  // Set board orientation based on selected color
  if (selectedColor.value === "b") {
    boardAPI?.toggleOrientation();
    // Send initial move for black pieces
    sendMove(boardAPI?.getFen());
  }
}

function recordMove() {
  const lastMove = boardAPI?.getLastMove();
  moveHistory.value.push(lastMove.lan);
  console.log(moveHistory);
  if (lastMove.color === selectedColor.value) {
    sendMove(lastMove.after);
  }
}

function resetGame() {
  boardAPI?.resetBoard();
  moveHistory.value = [];
  isModalVisible.value = false; // Скрываем модальное окно при сбросе игры
  isDrawModalVisible.value = false; // Скрываем модальное окно ничьей
  
  // Reset board orientation based on selected color
  if (selectedColor.value === "b") {
    boardAPI?.toggleOrientation();
    // Send initial move for black pieces
    sendMove(boardAPI?.getFen());
  }
}

function undoLastMove() {
  if (moveHistory.value.length > 0) {
    // Undo bot's move
    boardAPI?.undoLastMove();
    moveHistory.value.pop();
    
    // If there are more moves, undo player's move too
    if (moveHistory.value.length > 0) {
      boardAPI?.undoLastMove();
      moveHistory.value.pop();
    }
  }
}

async function sendMove(fen) {
  console.log(boardAPI?.getLastMove());

  const prompt = { fen: fen };
  try {
    const response = await axios.post("http://localhost:8000/api/move", prompt);

    boardAPI?.move(response.data.best_move);
  } catch (error) {
    console.error("Ошибка при отправке запроса: ", error);
  }
}
async function showBestMove() {
  // Скрываем предыдущие стрелки перед показом новой
  boardAPI?.hideMoves(); 

  // Получаем текущее состояние доски в формате FEN
  const fen = boardAPI?.getFen(); 

  try {
    // Отправляем запрос на сервер для получения лучшего хода
    const response = await axios.post("http://localhost:8000/api/move", { fen: fen });
    const bestMove = response.data.best_move;

    if (bestMove) {
      const orig = bestMove.slice(0, 2); // Начальная позиция
      const dest = bestMove.slice(2, 4); // Конечная позиция
      boardAPI?.drawMove(orig, dest, 'green'); // Рисуем стрелку
    }
  } catch (error) {
    console.error("Ошибка при получении лучшего хода:", error);
  }
}

// let tg = window.Telegram.WebApp;
// let game = document.getElementById("game");

// game.addEventListener("click", () => {
//   document.getElementById("main").style.display == "none";
//   document.getElementById("menu").style.display == "block";
// });
</script>
<!-- // name: 'MyComponent',
  // mounted() {
  //   const script = document.createElement('script');
  //   script.src = "https://telegram.org/js/telegram-web-app.js";
  //   script.async = true;
  //   document.body.appendChild(script);
  // },
   -->

<template>
  <div id="main" class="game-container">
    <h1>MireaChess</h1>
    <div id="move-history">
      <div id="selectedOptions">
        <p>Выбранный цвет: {{ selectedColor === "w" ? "белые" : "чёрные" }}</p>
        <p>Уровень сложности: {{ selectedDifficulty }}</p>
      </div>
      <span v-if="moveHistory.length === 0">Сделайте первый ход!</span>
      <span v-else>
        <span v-for="(move, index) in moveHistory" :key="index">{{ index + 1 }}. {{ move }}<span v-if="index < moveHistory.length - 1">, </span></span>
      </span>
    </div>
    <div id="board">
      <TheChessboard
        @move="recordMove"
        :board-config="boardConfigForWhite"
        @board-created="(api) => (boardAPI = api)"
        @checkmate="handleCheckmate"
        @draw="handleDraw"
      />
    </div>
    <div id="status">
      <div v-if="moveHistory.length === 0">Ходят белые</div>
      <div v-else>Ходят {{ selectedColor === "w" ? "чёрные" : "белые" }}</div>
    </div>
    <div className="menu">
      <button @click="boardAPI?.toggleOrientation()">Повернуть доску</button>
      <button @click="resetGame()">Начать сначала</button>
      <button @click="undoLastMove">Ход назад</button>
      <button @click="showBestMove">Помочь с ходом</button>  
      <button @click="isResignModalVisible = true">Сдаться</button> 
    </div>

    <!-- Модальное окно для конца игры -->
    <div v-if="isModalVisible" class="modal-overlay">
      <div class="modal">
        <h2>{{ winner }} проиграли</h2>
        <p>Возвращаемся на главную страницу...</p>
      </div>
    </div>
    <!-- Модальное окно для ничьей -->
    <div v-if="isDrawModalVisible" class="modal-overlay">
      <div class="modal">
        <h2>Ничья!</h2>
        <p>Возвращаемся на главную страницу...</p>
      </div>
    </div>
    <!-- Модальное окно для подтверждения сдачи -->
    <div v-if="isResignModalVisible" class="modal-overlay">
      <div class="modal">
        <h2>Вы точно хотите сдаться?</h2>
        <button class="btn-resign" @click="confirmResign">Да</button>
        <button class="btn-new" @click="isResignModalVisible = false">Нет</button>
      </div>
    </div>
  </div>
</template>

