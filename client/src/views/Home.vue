<template>
  <div class="home">
    <h1>Welcome to MireaChess</h1>
    <div class="start-options">
      <h4>
        Choose your color:
        <select v-model="selectedColor">
          <option value="w">White</option>
          <option value="b">Black</option>
        </select>
      </h4>
      <h4>
        Bot difficulty:
        <select v-model="selectedDifficulty">
          <option value="1">Easy</option>
          <option value="2">Medium</option>
          <option value="3">Hard</option>
        </select>
      </h4>
      <button @click="startGame" class="start-button">Start Game</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import '../components/styles.css'

const router = useRouter()
const selectedColor = ref('w')
const selectedDifficulty = ref('1')

const startGame = () => {
  router.push({
    path: '/game',
    query: {
      color: selectedColor.value,
      difficulty: selectedDifficulty.value
    }
  })
}
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.start-options {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
}

.start-button {
  padding: 10px 20px;
  font-size: 1.2em;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.start-button:hover {
  background-color: #45a049;
}

select {
  padding: 5px;
  margin-left: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
</style> 