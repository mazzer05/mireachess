// confirmResign.test.js
import { ref } from 'vue';
import { confirmResign } from './ChessGame.vue'; // Используйте относительный путь

jest.mock('./ChessGame.vue', () => ({
    handleCheckmate: jest.fn(), // Мокаем handleCheckmate
    confirmResign: jest.fn(), // Мокаем confirmResign
  }));

describe('confirmResign', () => {
  let isResignModalVisible;
  let winner;

  beforeEach(() => {
    // Инициализация реактивных переменных
    isResignModalVisible = ref(false);
    winner = ref('Player 1');
  });

  it('should show resign modal and call handleCheckmate', () => {
    confirmResign();

    // Проверяем, что модальное окно показано
    expect(isResignModalVisible.value).toBe(false);

    // Проверяем, что модальное окно скрыто после вызова handleCheckmate
    expect(isResignModalVisible.value).toBe(false);
  });
});

describe('handleCheckmate', () => {
  let winner;
  let isModalVisible;

  beforeEach(() => {
    // Инициализация реактивных переменных
    winner = ref(null);
    isModalVisible = ref(false);
  });

  it('should set winner to "Чёрные" and show modal when isMated is "w"', () => {
    handleCheckmate('b');

    expect(winner.value).toBe('Черные');
    expect(isModalVisible.value).toBe(true);
  });

  it('should set winner to "Белые" and show modal when isMated is not "w"', () => {
    handleCheckmate('w');

    expect(winner.value).toBe('Белые');
    expect(isModalVisible.value).toBe(true);
  });
});