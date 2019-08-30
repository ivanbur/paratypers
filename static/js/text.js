class Text extends Obj {
	constructor(objName, x, y, color, text, textSize, visible) {
        if (visible == undefined) {
            visible = true;
        }
		super(objName, x, y, color, visible);
		this.text = text || '';
		this.textSize = textSize || 32;
        this.scalar = 0.8;
        
        this.height = textAscent() * this.scalar;
        this.width = textWidth(this.text);
	}

	drawObj() {
		fill(this.color);
		textSize(this.textSize);
        this.updateHeightWidth();
		text(this.text, this.x, this.y);
	}

	mouseOn(x, y) {
		if (x > this.x && x < this.x + this.width && y < this.y && y > this.y - this.height && this.visible) {
			return true;
		}

		return false;
	}
  
    updateHeightWidth() {
        this.height = textAscent() * this.scalar;
        this.width = textWidth(this.text);
    }
}