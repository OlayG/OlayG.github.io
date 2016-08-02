(function(){
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var ground = [];
    var platformWidth = 50;
    var platformHeight = canvas.height + (canvas.width/3.3);
    var player = {};

    document.body.style.overflowX = "hidden"
    
    //Set canvas dimensions
    canvas.width = window.innerWidth * .91;
    canvas.height = window.innerHeight * .75;
    canvas.overflowX = "hidden";

        /**
         * Asset pre-loader object. Loads all images and sounds
         */
    var assetLoader = (function() {
        // images dictionary
    this.imgs = {
        "hills_1"        : "images/Hills_1.png",
        "hills_2"        : "images/Hills_2.png",
        "hills_3"        : "images/Hills_3.png",
        "hills_4"        : "images/Hills_4.png",
        "clouds"         : "images/Hills_Clouds.png",
        "sky"            : "images/Hills_Sky.png",
        "foreground"     : "images/foreground.png"
    }
    var assetsLoaded = 0;                                // how many assets have been loaded
    var numImgs      = Object.keys(this.imgs).length;    // total number of image assets
    this.totalAssest = numImgs;                          // total number of assets

    /**
     * Ensure all assets are loaded before using them
     * @param {number} dic  - Dictionary name ('imgs')
     * @param {number} name - Asset name in the dictionary
     */
    function assetLoaded(dic, name) {
        // don't count assets that have already loaded
        if (this[dic][name].status !== "loading" ) {
            return;
        } 
        this[dic][name].status = "loaded";
        assetsLoaded++;
        // finished callback
        if (assetsLoaded === this.totalAssest && typeof this.finished === "function") {
            this.finished();
        }   
    }

    /**
     * Create assets, set callback for asset loading, set asset source
     */
    this.downloadAll = function() {
        var _this = this;
        var src;

        // load images
        for (var img in this.imgs) {
            if (this.imgs.hasOwnProperty(img)) {
                src = this.imgs[img];

            // create a closure for event binding
            (function(_this, img) {
                _this.imgs[img] = new Image();
                _this.imgs[img].status = "loading";
                _this.imgs[img].name = img;
                _this.imgs[img].onload = function() { assetLoaded.call(_this, "imgs", img) };
                _this.imgs[img].src = src;
                })(_this, img);
            }
        }
    }
    return {
        imgs: this.imgs,
        totalAssest: this.totalAssest,
        downloadAll: this.downloadAll
    };
})();

assetLoader.finished = function() {
    startGame();
}

/**
 * Creates a Spritesheet
 * @param {string} - Path to the image.
 * @param {number} - Width (in px) of each frame.
 * @param {number} - Height (in px) of each frame.
 */
function SpriteSheet(path, frameWidth, frameHeight) {
    this.image = new Image();
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;

    // calculate the number of frames in a row after the image loads
    var self = this;
    this.image.onload = function() {
        self.framesPerRow = Math.floor((self.image.width) / (self.frameWidth));
    };

    this.image.src = path;
}

/**
 * Creates an animation from a spritesheet.
 * @param {SpriteSheet} - The spritesheet used to create the animation.
 * @param {number}      - Number of frames to wait for before transitioning the animation.
 * @param {array}       - Range or sequence of frame numbers for the animation.
 * @param {boolean}     - Repeat the animation once completed.
 */
function Animation(spritesheet, frameSpeed, startFrame, endFrame) {

    var animationSequence = [];  // array holding the order of the animation
    var currentFrame = 0;        // the current frame to draw
    var counter = 0;             // keep track of frame rate

    // start and end range for frames
    for (var frameNumber = startFrame; frameNumber <= endFrame; frameNumber++)
        animationSequence.push(frameNumber);

    /**
     * Update the animation
     */
    this.update = function() {

        // update to the next frame if it is time
        if (counter == (frameSpeed - 1))
            currentFrame = (currentFrame + 1) % animationSequence.length;

        // update the counter
        counter = (counter + 1) % frameSpeed;
    };

    /**
     * Draw the current frame
     * @param {integer} x - X position to draw
     * @param {integer} y - Y position to draw
     */
    this.draw = function(x, y) {
        // get the row and col of the frame
        var row = Math.floor(animationSequence[currentFrame] / spritesheet.framesPerRow);
        var col = Math.floor(animationSequence[currentFrame] % spritesheet.framesPerRow);

        ctx.drawImage(
        spritesheet.image,
        col * spritesheet.frameWidth, row * spritesheet.frameHeight,
        spritesheet.frameWidth, spritesheet.frameHeight,
        x, y,
        spritesheet.frameWidth, spritesheet.frameHeight);
    };
}



/**
 * Create a parallax background
 */
var background = (function() {
  var clouds  = {};
  var hills_1 = {};
  var hills_2 = {};
  var hills_3 = {};
  var hills_4 = {};
//   var foreground  = {};
  /**
   * Draw the backgrounds to the screen at different speeds
   */
  this.draw = function() {
    ctx.drawImage(assetLoader.imgs.sky, 0, 0, canvas.width, canvas.height);

    // Pan background
    clouds.x     -= clouds.speed;
    hills_1.x    -= hills_1.speed;
    hills_2.x    -= hills_2.speed;
    hills_3.x    -= hills_3.speed;
    hills_4.x    -= hills_4.speed;
    // foreground.x -= foreground.speed;   
    
    // draw images side by side to loop
    ctx.drawImage(assetLoader.imgs.clouds, clouds.x, clouds.y, canvas.width, canvas.height);
    ctx.drawImage(assetLoader.imgs.clouds, clouds.x + canvas.width, clouds.y, canvas.width, 
                  canvas.height);

    ctx.drawImage(assetLoader.imgs.hills_1, hills_1.x, hills_1.y, canvas.width, canvas.height);
    ctx.drawImage(assetLoader.imgs.hills_1, hills_1.x + canvas.width, hills_1.y, canvas.width,
                  canvas.height);
    
    ctx.drawImage(assetLoader.imgs.hills_2, hills_2.x, hills_2.y, canvas.width, canvas.height);
    ctx.drawImage(assetLoader.imgs.hills_2, hills_2.x + canvas.width, hills_2.y, canvas.width,
                  canvas.height);

    ctx.drawImage(assetLoader.imgs.hills_3, hills_3.x, hills_3.y, canvas.width, canvas.height);
    ctx.drawImage(assetLoader.imgs.hills_3, hills_3.x + canvas.width, hills_3.y, canvas.width,
                  canvas.height);

    ctx.drawImage(assetLoader.imgs.hills_4, hills_4.x, hills_4.y, canvas.width, canvas.height);
    ctx.drawImage(assetLoader.imgs.hills_4, hills_4.x + canvas.width, hills_4.y, canvas.width,
                  canvas.height);

    // ctx.drawImage(assetLoader.imgs.foreground, foreground.x, foreground.y + (canvas.width/3.3), canvas.width , canvas.height / 6);
    // ctx.drawImage(assetLoader.imgs.foreground, foreground.x + canvas.width, foreground.y + (canvas.width/3.3), canvas.width , 
    //               canvas.height / 6);

    
    // If the image scrolled off the screen, reset
    if (clouds.x + assetLoader.imgs.clouds.width <= 0)
      clouds.x = 0;
    if (hills_1.x + assetLoader.imgs.hills_1.width <= 0)
      hills_1.x = 0;
    if (hills_2.x + assetLoader.imgs.hills_2.width <= 0)
      hills_2.x = 0;
    if (hills_3.x + assetLoader.imgs.hills_3.width <= 0)
      hills_3.x = 0;
    if (hills_4.x + assetLoader.imgs.hills_4.width <= 0)
      hills_4.x = 0;
    // if (foreground.x + assetLoader.imgs.foreground.width <= 0)
    //   foreground.x = 0;
  };
  /**
   * Reset background to zero
   */
  this.reset = function()  {
    clouds.x = 0;
    clouds.y = 0;
    clouds.speed = 0.2;
    hills_1.x = 0;
    hills_1.y = 0;
    hills_1.speed = 0.4;
    hills_2.x = 0;
    hills_2.y = 0;
    hills_2.speed = 0.6;
    hills_3.x = 0;
    hills_3.y = 0;
    hills_3.speed = 0.8;
    hills_4.x = 0;
    hills_4.y = 0;
    hills_4.speed = 1.0;
    // foreground.x = 0;
    // foreground.y = 0;
    // foreground.speed = 1.2;
  }
  return {
    draw: this.draw,
    reset: this.reset
  };
})();
    /**
    * Game loop
    C:\Users\WeCanCodeIT\Desktop\Portfolio\images\New folder\playerRun.png
    */
    function animate(){
        requestAnimationFrame(animate);
        background.draw();


    }
 /**
   * Request Animation Polyfill
   */
  var requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function(callback, element){
              window.setTimeout(callback, 1000 / 60);
            };
  })();
 /**
   * Start the game - reset all variables and entities, spawn platforms and water.
   */
  function startGame() {
    background.reset();

    animate();
  }

  assetLoader.downloadAll();
})();