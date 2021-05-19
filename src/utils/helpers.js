/**
 * Условие на продолжение хода
 * @param {number[]} rounds Массив раундов
 * @param {number[]} clicked Массив кнопок, нажатых пользователем
 * @returns {boolean}
 */
export function conditionToContinue (rounds, clicked) {
    return clicked.reduce((acc, el) => {
        (rounds.indexOf(el) >= 0 ? true : false)
            ? ""
            : (acc = false);
        return acc;
    }, true);
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