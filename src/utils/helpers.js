/**
 * Условие на продолжение хода
 * @param {number[]} rounds Массив раундов
 * @param {number[]} clicked Массив кнопок, нажатых пользователем
 * @returns {boolean}
 */
export function conditionToContinue(rounds, clicked) {
    return clicked.reduce((acc, el, i) => {
        el !== rounds[i] ? (acc = false) : ''
        return acc
    }, true)
}

/**
 * Промис для async\await
 * @param {number} ms Значение в милисекундах
 * @returns {Promise}
 */
export function expectation(ms) {
    return new Promise((res) => {
        setTimeout(() => res(), ms)
    })
}

/**
 *
 * @param {number} min минимальное значение
 * @param {number} max максимальное значение
 * @returns {number}
 */
export function random(min, max) {
    return Math.floor(min + Math.random() * (max - min))
}
