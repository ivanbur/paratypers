class Button extends Rectangle {
	constructor(objName, x, y, width, height, color, textColor, text, textSize, visible) {
		super(objName, x, y, width, height, color, visible);

		let testText = new Text('testText', 0, 0, textColor, text, textSize, false);
		let testWidth = testText.width;
		let testHeight = testText.height;
		testText = null;

		this.text = new Text('buttonText', this.x + (this.width - testWidth) / 2, this.y + ((this.height - testHeight) / 2) + testHeight - 5, textColor, text, textSize, this.visible);
	}

	drawObj() {
		if (this.visible) {
			super.drawObj();
			this.text.drawObj();
		}
	}
}