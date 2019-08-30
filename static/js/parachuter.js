class Parachuter {
    constructor(x, y, width, height, word, visible) {
        this.word = word;
        this.frameAmount = 0;
        this.saved = false;
        this.speed = word.length / 2;
        this.image = new Image('paraImage', x, y, width, height, 'noChute', visible);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.completedLetters = 0;

        this.textComplete;
        this.textIncomplete;
        
        this.updateText();
    }
  
    drawObj() {
        this.frameAmount++;
        this.image.drawObj();
        this.updateText();
        this.textComplete.drawObj();
        this.textIncomplete.drawObj();
    }

    updateText() {
        let testWord = new Text('testText', 0, 0, color(100, 0, 0), this.word, false);

        let complete = '';
        let incomplete = '';
        let wordArray = this.word.split('');

        for (let i = 0; i < wordArray.length; i++) {
            if (i < this.completedLetters) {
                complete += wordArray[i];
            } else {
                incomplete += wordArray[i];
            }
        }

        this.textComplete = new Text('paraTextComplete', this.x + (this.width / 2) - (testWord.width / 2), this.y - 30, color(0, 100, 0), complete, 32);
        this.textIncomplete = new Text('paraTextIncomplete', this.textComplete.x + this.textComplete.width, this.y - 30, color(100, 0, 0), incomplete, 32);
    }
  
    completed() {
        this.image.imageId = 'chute';
        score += this.word.length * (4000 / this.frameAmount);
        updateGameText();
        this.saved = true;
        numSaved++;
    }
  
    move() {
        if (this.saved) {
          this.x -= 3;
          this.y += 1;
        } else {
          this.x -= 0.1;
          this.y += this.speed;
        }
      
        this.image.x = this.x;
        this.image.y = this.y;

        this.drawObj();
    }

    mouseOn(x, y) {
        if (x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height && this.visible) {
            return true;
        }

        return false;
    }
}
