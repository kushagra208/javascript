const canvas = document.getElementById("canvas");

const c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


let particleArray = [];

const mouse = {
    x:null,
    y: null,
    radius: 150
}

window.addEventListener("mousemove" , function(e) {
    mouse.x = e.x;
    mouse.y = e.y;
} )

c.fillStyle = "white";
c.font = "20px Verdana";
c.fillText('Kushagra' , 25 , 40);

const textCoordinates = c.getImageData(0 , 0 , canvas.width , canvas.height);

class Particle {
    constructor(x , y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 0.5 + 1.5;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1;
    }
    draw() {
        c.fillStyle = 'white';
        c.beginPath();
        c.arc(this.x , this.y , this.size , 0 , 2 * Math.PI);
        c.closePath();
        c.fill();
    }
    update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let dis = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / dis;
        let forceDirectionY = dy / dis;
        let maxDistance = mouse.radius;
        let force = (maxDistance - dis) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;
        if(dis < mouse.radius){
            this.x -= directionX;
            this.y -= directionY;
        } else {
            if(this.x !== this.baseX){
                let sx = this.x - this.baseX;
                this.x -= sx / 10;
            }
            if(this.y !== this.baseY){
                let sy = this.y - this.baseY;
                this.y -= sy / 10;
            }
        }
    }
}

function init() {
    particleArray = [];
    for(let y = 0; y < textCoordinates.height; y++ ){
        for (let x = 0; x < textCoordinates.width; x++) {
            if (textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 128){
                let positionX = x;
                let positionY = y;
                particleArray.push(new Particle(positionX * 10 , positionY * 10));
            }
        }
    }
}

init();

function animate() {
    c.clearRect( 0 , 0 , canvas.width , canvas.height);

    for( let i = 0; i < particleArray.length; i++) {
        particleArray[i].draw();
        particleArray[i].update();
    }
    connect();
    requestAnimationFrame(animate);
    window.addEventListener("resize" , () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
    })

}

animate();

function connect() {
    for (let a = 0; a < particleArray.length; a++) {
        for (let b = a; b < particleArray.length; b++) {
            let dx = particleArray[a].x - particleArray[b].x;
            let dy = particleArray[a].y - particleArray[b].y;
            let dis = Math.sqrt( dx * dx + dy * dy);
            
            if(dis < 20) {
                c.strokeStyle = "white";
                c.lineWidth = 0.5;
                c.beginPath();
                c.moveTo(particleArray[a].x , particleArray[a].y);
                c.lineTo(particleArray[b].x , particleArray[b].y);
                c.stroke();
            }
        }
    }
}