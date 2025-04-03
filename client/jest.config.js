export const testEnvironment = 'jest-environment-jsdom';
export const moduleNameMapper = {
    '^vue3-chessboard$': '../node_modules/vue3-chessboard/dist/vue3-chessboard.umd.js',
};
export const transform = {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
};
export const transformIgnorePatterns = [
    '/node_modules/(?!(vue3-chessboard)/)',
];
export const moduleFileExtensions = ['vue', 'js', 'jsx', 'ts', 'tsx', 'json'];
export const testMatch = ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'];
