class Image extends Obj {
    constructor(objName, x, y, width, height, imageId, visible) {
        super(objName, x, y, color(0, 0, 0), visible);
        this.width = width;
        this.height = height;
        this.imageId = imageId;
    }
  
    drawObj() {
        document.getElementById('mycanvas').children[0].getContext('2d').drawImage(document.getElementById(this.imageId), this.x, this.y, this.width, this.height);
    }
}