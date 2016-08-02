(function(){
    var canvas = document.getElementById('canvas'),
        c = canvas.getContext('2d'),
        gravity = 0.1,
        dampening = 0.99,
        pullStrength = 0.01,
        circles = [],
        i, numCircles = 10,
        repulsion = 1,
        mouseDown = false,
        mouseX, mouseY;
    
    document.body.style.overflowX = "hidden"
    
    //Set canvas dimensions
    canvas.width = window.innerWidth * .91;
    canvas.height = window.innerHeight * .75;
    canvas.overflowX = "hidden";
    function initializeCircles(){
        for(i = 0; i < numCircles; i++){
            circles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                //(vx, vy)
                vx: 0,
                vy: 0,
                radius: 20
            });
        }
    }


    function executeFrame() {
        var i, j, circle;
        for(i=0; i < numCircles; i++){
            circle = circles[i];
            // Change location by using velocity
            circle.x += circle.vx;
            circle.y += circle.vy;

            // use gravity to increase y velocity
            circle.vy += gravity;
            // Slow down ball velocity
            circle.vy *= dampening;

            // if ball hits bottom of canvas change its velocity direction
            if(circle.y + circle.radius > canvas.height){
                circle.y = canvas.height - circle.radius;
                circle.vy = -Math.abs(circle.vy);
            }

            // if ball hits right of canvas change its velocity direction
            if(circle.x + circle.radius > canvas.width){
                circle.x = canvas.width - circle.radius;
                circle.vx = -Math.abs(circle.vx);
            }

            // if ball hits left of canvas change its velocity direction
            if(circle.x - circle.radius < 0){
                circle.x = circle.radius;
                circle.vx = Math.abs(circle.vx);
            }

            // if ball hits top of canvas change its velocity direction
            if(circle.y - circle.radius < 0){
                circle.y = circle.radius;
                circle.vy = Math.abs(circle.vy);
            }

            for(j = i+1; j < numCircles; j++){
                collide(circle, circles[j]);
            }
            c.beginPath();
            c.arc(circle.x, circle.y, circle.radius, 0, 2*Math.PI);
            c.closePath();
            c.fillStyle = 'black';
            c.fill();    
        }

        ballInteraction()

        c.fillStyle ='rgba(255,255,255,0.2)';
        c.fillRect(0, 0, canvas.width, canvas.height)

        requestAnimationFrame(executeFrame);  
    }

    function collide(a , b){
        var dx = b.x - a.x,
            dy = b.y - a.y,
            d = Math.sqrt(dx*dx + dy*dy),
            ux = dx / d,
            uy = dy / d;

        if (d < a.radius + b.radius){
            a.vx -= ux * repulsion;
            a.vy -= uy * repulsion;
            b.vx += ux * repulsion;
            b.vy += uy * repulsion;
        }
    }


    // once you click mouse coordinates are stored
    canvas.addEventListener('mousedown', function(e){
        mouseDown = true;
        mouseX = e.pageX;
        mouseY = e.pageY;
    });

    // once you release click  turn mousedown false
    canvas.addEventListener('mouseup', function(e){
        mouseDown = false;
    });

    // if you move mouse update the coordinates
    canvas.addEventListener('mousemove', function(e){
        mouseX = e.pageX;
        mouseY = e.pageY;
    });

    function ballInteraction(){
        var dx, dy, i, circle;
        if(mouseDown){
            for(i = 0; i < numCircles; i++){
                circle = circles[i];
                dx = mouseX - circle.x,
                dy = mouseY - circle.y,
                circle.vx += dx * pullStrength;
                circle.vy += dy * pullStrength;
            }
        }
    }
    initializeCircles()
    //Start Animation
    executeFrame();


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

})();
