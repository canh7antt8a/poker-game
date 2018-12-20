
var PokerType = require("PokerType");

cc.Class({
    extends: cc.Component,

    properties: {
        timeTotal: 90,
        cardPairs: 10,
        timeLabel: cc.Label,
        container: cc.Node,
        cardPrefab: cc.Prefab,
    },

    onLoad () {
        if (this.timeTotal <= 0 || this.cardPairs > 52 || this.cardPairs <= 0) {
            cc.log("参数错误，无法开启游戏");
            return;
        }
        this.gameStart();
    },

    gameStart() {
        this.timeLeft = this.timeTotal;
        this.cardLeft = this.cardPairs * 2;
        this.cards = [];
        this.generateCards();
        this.clickable = true;
        this.updateTimeLabel();
        cc.director.getScheduler().schedule(this.updateTimeLabel, this, 1);
    },

    updateTimeLabel() {
        if (this.timeLeft <= 0) {
            this.gameOver(false);
        } else {
            this.timeLabel.string = `倒计时：${this.timeLeft}s`;
            this.timeLeft--;
        }
    },

    gameOver(success) {
        this.clickable = false;
        cc.director.getScheduler().unschedule(this.updateTimeLabel, this);
        cc.director.loadScene("End");
    },

    _shuffleCards(array) {
        var m = array.length, t, i;
        while (m) {
            i = Math.floor(Math.random() * m--);
            t = array[m];
            array[m] = array[i];
            array[i] = t;
        }
        return array;
    },

    generateCards() {
        for (let i = 0; i < this.cardPairs; i++) {
            let card1 = cc.instantiate(this.cardPrefab).getComponent('Poker');
            card1 && card1.initPoker(2 * i, PokerType[i], this);
            let card2 = cc.instantiate(this.cardPrefab).getComponent('Poker');
            card2 && card2.initPoker(2 * i + 1, PokerType[i], this);
            this.cards.push(card1);
            this.cards.push(card2);
        }
        this._shuffleCards(this.cards);
        this.cards.forEach(card => {
            this.container.addChild(card.node);
        });
    },

    onClickCard(card) {
        if (!this.firstCard) {
            this.firstCard = card;
            return;
        };
        if (!this.secondCard) {
            this.secondCard = card;
        };
        if (this.checkCardSame()) {
            this.cardLeft -= 2;
            this.firstCard = undefined;
            this.secondCard = undefined;
            this.checkAllFlipState();
        } else {
            this.clickable = false;
            this.scheduleOnce(() => {
                this.firstCard.flipBack();
                this.secondCard.flipBack();
                this.firstCard = undefined;
                this.secondCard = undefined;
                this.clickable = true;
            }, 1);
        }
    },

    isClickable() {
        return this.clickable;
    },

    checkCardSame() {
        if (!this.firstCard || !this.secondCard) return false;
        return this.firstCard.getType() === this.secondCard.getType();
    },

    checkAllFlipState() {
        if (this.cardLeft <= 0) {
            this.gameOver(true);
        }
    },

});
