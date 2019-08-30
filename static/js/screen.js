class Screen {
	constructor(screenName, visible) {
		this.name = screenName;
		this.visible = visible || true;
		this.list = [];
	}

	drawScreen() {
		if (this.visible) {
			for (let obj of this.list) {
				obj.drawObj();
			}
		}
	}

	addObj(obj) {
		this.list.push(obj);
	}

	removeObj(obj) {
		this.list.filter(x => x != obj);
	}
}