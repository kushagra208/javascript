window.onload = function () {
    class Stars {
        constructor(x , y) {
            this.color = 'rgba(255,255,255,1)';
            this.radius = Math.random() + 0.5;
            this.speed = Math.random() * 0.4 + 0.1;
            this.fps = 60;
            this.numStars = 0;
            this.xPos = x;
            this.yPos = y;
        }
        draw() {
            c.fillStyle = this.color;
            c.beginPath();
            c.arc(((this.xPos/2)*window_width)+window_width/2 , ((-1*this.yPos/2)*window_height)+window_height/2 , this.radius , 0 , 2 * Math.PI , false);
            c.fill();
        }
    }

    
    
    let canvas = document.getElementById("canvas"),
    c = canvas.getContext("2d");
    
    window_width = (canvas.width = window.innerWidth);
    window_height = (canvas.height = window.innerHeight-10);
    

    let stars = [];
    
    window.onclick = function(e) {
        var star = new Stars(2*((e.clientX - window_width/2)/window_width) , -2*((e.clientY - window_height/2)/window_height));
        stars.push(star);
        console.log(stars);
    }
    
    function animate(){
        if(stars.length > 10){
            
        }
        for(let i = 0; i < stars.length ; i++){
            stars[i].draw();
        }
    
    }

    function loop() {
        window.requestAnimFrame(loop);
        c.clearRect(0,0,window_width , window_height);
        animate();
    }

    window.addEventListener("resize", function () {
        (window_width = canvas.width = window.innerWidth),
        (window_height = canvas.height = window.innerHeight-10);
    });


    loop();
    setInterval(loop , 1000/60);
}