<template>
    <div class="container">
        <div class="sounds">
            <audio src="./assets/sounds/sounds_1.mp3" ref="sound_1"></audio>
            <audio src="./assets/sounds/sounds_2.mp3" ref="sound_2"></audio>
            <audio src="./assets/sounds/sounds_3.mp3" ref="sound_3"></audio>
            <audio src="./assets/sounds/sounds_4.mp3" ref="sound_4"></audio>
        </div>
        <div class="field" :class="{ 'field-disabled': disabled }">
            <div
                v-for="i in 4"
                :key="i"
                class="field__item"
                :class="[
                    i == currentField ? 'field__item-active' : '',
                    `field__item-${i}`,
                ]"
                @click="clickHandler(i)"
            ></div>
        </div>
        <div class="info">
            <div @click="start()" class="info__item btn">start</div>
            <div class="info__item">{{ round }}</div>
            <div class="info__item" v-if="showEndGame">You're lost</div>
            <div
                @click="pickDiff(d)"
                v-for="d in difficulty"
                :key="d.name"
                class="info__item btn"
                :class="{ 'btn-active': d.time == currentDiffTimer }"
            >
                {{ d.name }}
            </div>
        </div>
    </div>
</template>

<script>
import difficulty from './utils/difficulty'
import { conditionToContinue, expectation, random } from './utils/helpers'
import Interval from './utils/interval'

export default {
    name: 'App',
    data() {
        return {
            round: 0,
            currentField: 0,
            rounds: [],
            clicked: [],
            disabled: true,
            showEndGame: false,
            currentDiffTimer: 1500,
            difficulty,
            interval: null,
        }
    },
    beforeMount() {
        this.interval = new Interval()
    },
    methods: {
        reset() {
            this.round = 0
            this.currentField = 0
            this.rounds = []
            this.resetClicked()
            this.disabled = true
            this.showEndGame = false
            this.interval.stop()
        },
        resetClicked() {
            this.clicked = []
        },
        async start() {
            const { reset, addNewRound, playFields } = this
            reset()
            addNewRound()
            playFields()
        },
        pickDiff({ time }) {
            this.reset()
            this.currentDiffTimer = time
        },
        endGame() {
            this.showEndGame = true
            this.disabled = true
        },
        addNewRound() {
            this.rounds.push(random(1, 4))
        },
        async clickHandler(id) {
            const {
                playSound,
                playFields,
                resetClicked,
                addNewRound,
                endGame,
            } = this

            this.clicked.push(id)
            playSound(id)

            if (!conditionToContinue(this.rounds, this.clicked)) {
                endGame()
                return
            }

            if (this.clicked.length == this.rounds.length) {
                this.round++
                addNewRound()
                resetClicked()
                playFields()
            }
        },
        async playFields() {
            const { rounds, playSound, activeField } = this
            this.disabled = true
            this.interval.start(this.currentDiffTimer, (s) => {
                const round = rounds[s]

                if (!round) {
                    this.interval.stop()
                    this.disabled = false
                    return
                }
                playSound(round)
                activeField(round)
            })
        },
        playSound(id) {
            const el = this.$refs[`sound_${id}`]
            el.pause()
            el.currentTime = 0
            el.play()
        },
        async activeField(id) {
            this.currentField = id
            await expectation(this.currentDiffTimer - 10)
            this.currentField = 0
        },
    },
}
</script>

<style lang="scss" scoped>
.sounds {
    display: none;
}
.container {
    display: flex;
    align-items: center;
    justify-content: center;
}
.btn {
    padding: 10px 20px;
    background: red;
    color: white;
    cursor: pointer;
    &-active,
    &:active {
        background: #000;
    }
}
.info {
    display: flex;
    flex-direction: column;
    padding-left: 20px;
    &__item {
        margin-top: 10px;
    }
}
.field {
    $w: 300px;
    $h: 300px;
    width: $w;
    height: $h;
    display: flex;
    flex-wrap: wrap;
    overflow: hidden;
    border-radius: $w;
    position: relative;
    &-disabled {
        &:after {
            content: '';
            position: absolute;
            top: 0px;
            right: 0px;
            bottom: 0px;
            left: 0px;
            background: rgba(0, 0, 0, 0.2);
            z-index: 10;
        }
    }
    &__item {
        width: 50%;
        cursor: pointer;
        box-sizing: border-box;
        &-1 {
            background: red;
            &:hover {
                background: rgb(216, 0, 0);
            }
        }
        &-2 {
            background: green;
            &:hover {
                background: rgb(0, 97, 0);
            }
        }
        &-3 {
            background: blue;
            &:hover {
                background: rgb(0, 0, 207);
            }
        }
        &-4 {
            background: purple;
            &:hover {
                background: rgb(87, 0, 87);
            }
        }
        &-active {
            border: 2px solid white;
        }
    }
}
</style>
