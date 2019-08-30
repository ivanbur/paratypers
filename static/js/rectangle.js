class Rectangle extends Obj {
    constructor(objName, x, y, width, height, color, visible) {
        super(objName, x, y, color, visible);
        this.width = width;
        this.height = height;
    }
  
    drawObj() {
        if (this.visible) {
            fill(this.color);
            noStroke();
            rect(this.x, this.y, this.width, this.height);
        }
    }
  
    mouseOn(x, y) {
        if (x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height && this.visible) {
			return true;
		}

		return false;
    }
}