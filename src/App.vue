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
                :class="[
                    i == currentField ? 'field__item-active' : '',
                    'field__item',
                    `field__item-${i}`,
                ]"
                :ref="`field_${i}`"
                @click="clickHandler(i)"
                v-for="i in 4"
                :key="i"
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
import { expectation } from "./utils/promise";
import difficulty from "./utils/difficulty";

export default {
    name: "App",
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
        };
    },
    methods: {
        reset() {
            this.round = 0;
            this.currentField = 0;
            this.rounds = [];
            this.resetClicked();
            this.disabled = true;
            this.showEndGame = false;
        },
        resetClicked() {
            this.clicked = [];
        },
        async start() {
            const { reset, addNewRound, playFields } = this;
            reset();
            addNewRound();
            playFields();
            this.disabled = false;
        },
        pickDiff({ time }) {
            this.reset();
            this.currentDiffTimer = time;
        },
        endGame() {
            this.showEndGame = true;
            this.disabled = true;
        },
        addNewRound() {
            this.rounds.push(this.randomNum());
        },
        async clickHandler(id) {
            const {
                playSound,
                playFields,
                resetClicked,
                addNewRound,
                currentDiffTimer,
                endGame,
            } = this;

            this.clicked.push(id);
            playSound(id);

            if (this.clicked.length == this.rounds.length) {
                if (this.clicked.join("") !== this.rounds.join("")) {
                    endGame();
                    return;
                }
                this.round++;
                this.disabled = true;

                await expectation(currentDiffTimer);
                addNewRound();
                resetClicked();
                await playFields();

                this.disabled = false;
            }
        },
        async playFields() {
            const { rounds, playSound, playField } = this;

            for (const a of rounds) {
                playSound(a);
                this.currentField = a;
                await playField(a);
                this.currentField = 0;
            }
        },
        randomNum() {
            return Math.floor(1 + Math.random() * (4 - 1));
        },
        playSound(id) {
            const el = this.$refs[`sound_${id}`];
            el.pause();
            el.currentTime = 0;
            el.play();
        },
        async playField(id) {
            const { classList } = this.$refs[`sound_${id}`];
            classList.add("active");
            await expectation(this.currentDiffTimer);
            classList.remove("active");
        },
    },
};
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
            content: "";
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
