class Obj {
	constructor(objName, x, y, color, visible) {
		this.name = objName;
		this.x = x;
		this.y = y;
		this.color = color;
        
        if (visible == undefined) {
            visible = true;
        }
		this.visible = visible;
	}

	drawObj(){
		if (this.visible) {
			fill(this.color);
			noStroke();
		}
	}

	mouseOn(x, y) {
		return false;
	}

	clicked() {
	}
}