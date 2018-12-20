var PokerType = require("PokerType");

const DEFAULT_BACK = "poker/Green_back";

cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad () {
        this.button = this.getComponent(cc.Button);
    },

    initPoker(index, type, control) {
        if (this.type === type) return;
        this.index = index;
        this.type = type;
        this.control = control;
    },

    flip() {
        if (!this.control || !this.control.isClickable()) return;
        cc.loader.loadRes(this.type, cc.SpriteFrame, (err, spriteFrame) => {
            if (!cc.isValid(this.node)) return;
            var sprite = this.getComponent(cc.Sprite);
            if (!sprite) return;
            sprite.spriteFrame = spriteFrame;
            !!err && cc.log(err);
        });
        this.button.interactable = false;
        this.control && this.control.onClickCard(this);
    },
    
    flipBack() {
        cc.loader.loadRes(DEFAULT_BACK, cc.SpriteFrame, (err, spriteFrame) => {
            if (!cc.isValid(this.node)) return;
            var sprite = this.getComponent(cc.Sprite);
            if (!sprite) return;
            sprite.spriteFrame = spriteFrame;
            !!err && cc.log(err);
        });
        this.button.interactable = true;
    },

    getType() {
        return this.type;
    },

    onDestroy() {
        this.control = undefined;
    }

});
