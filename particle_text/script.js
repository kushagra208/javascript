window.addEventListener('load' , function() {
    const canvas = document.getElementById('canvas');
    const c = canvas.getContext('2d' , {
        willReadFrequently: true
    });
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Particle {
        constructor(effect , x , y , color) {
            this.effect = effect;
            this.x = Math.random() * this.effect.canvasWidth;
            this.y = Math.random() * this.effect.canvasHeight;
            this.color = color;
            this.originX = x;
            this.originY = y;
            this.size = this.effect.gap - 2;
            this.dx = 0;
            this.dy = 0;
            this.vx = 0;
            this.vy = 0;
            this.force = 0;
            this.angle = 0;
            this.dis = 0;
            this.friction = Math.random() * 0.6 + 0.15;
            this.ease = Math.random() * 0.1 + 0.05;
        }
        draw() {
            this.effect.context.fillStyle = this.color;
            this.effect.context.fillRect(this.x , this.y , this.size , this.size);
        }
        update() {
            this.dx = this.effect.mouse.x - this.x;
            this.dy = this.effect.mouse.y - this.y;
            this.dis = this.dx * this.dx + this.dy * this.dy;
            this.force = - this.effect.mouse.radius / this.dis;

            if (this.dis < this.effect.mouse.radius) {
                this.angle = Math.atan2(this.dy , this.dx);
                this.vx += this.force * Math.cos(this.angle);
                this.vy += this.force * Math.sin(this.angle);
            }
            this.x += (this.vx *= this.friction) + (this.originX - this.x) * this.ease;
            this.y += (this.vy *= this.friction) + (this.originY - this.y) * this.ease;
        }
    }

    class Effect {
        constructor(context , canvas_width , canvas_height) {
            this.context = context;
            this.canvasWidth = canvas_width;
            this.canvasHeight = canvas_height;
            this.textX = this.canvasWidth/2;
            this.textY = this.canvasHeight/2;
            this.fontSize = 80;
            this.lineHeight = this.fontSize * 0.8;
            this.maxTextWidth = this.canvasWidth * 0.8;
            this.textInput = document.getElementById("textInput");
            this.textInput.addEventListener("keyup" , e => {
                if (e.key !== " "){
                    this.context.clearRect(0 , 0 , this.canvasWidth , this.canvasHeight);
                    this.wrapText(e.target.value);
            }
            });

            this.particles = [];
            this.gap = 4;
            this.mouse = {
                radius: 20000,
                x: 0,
                y: 0
            }

            window.addEventListener("mousemove" , e => {
                this.mouse.x = e.x;
                this.mouse.y = e.y;
            })
        }

        wrapText(text) {
            const gradient = this.context.createLinearGradient(0 , 0 , canvas.width , canvas.height);
            gradient.addColorStop(0.3 , "red");
            gradient.addColorStop(0.5 , "fuchsia");
            gradient.addColorStop(0.7 , "purple");
            this.context.fillStyle = gradient;
            this.context.textAlign = "center";
            this.context.textBaseline = "middle";
            this.context.lineWidth = 3;
            this.context.font = this.fontSize + 'px Helvetica';
            let linesArray = [];
            let words = text.split(' ');
            let linesCounter = 0;
            let line = '';

            for(let i = 0; i < words.length; i++){
                let testline = line + words[i] + ' ';
                if(this.context.measureText(testline).width > this.maxTextWidth) {
                    line = words[i] + " ";
                    linesCounter++;
                } else {
                    line = testline;
                }

                linesArray[linesCounter] = line;
            }
            let textHeight = this.lineHeight * linesCounter;
            this.textY = this.canvasHeight / 2 - textHeight/2;
            linesArray.forEach((el , index) => {
                this.context.fillText(el , this.textX , this.textY + (index * this.lineHeight));
            })
            this.convertToParticles();

        }
        convertToParticles() {
            this.particles = [];
            const pixels = this.context.getImageData(0 , 0 , this.canvasWidth , this.canvasHeight).data;
            this.context.clearRect(0 , 0 , this.canvasWidth , this.canvasHeight);
            for(let y = 0; y < this.canvasHeight; y += this.gap) {
                for(let x = 0; x < this.canvasWidth; x += this.gap) {
                    const i = (y * this.canvasWidth + x) * 4;
                    const alpha = pixels[i+3];
                    if (alpha > 0){
                        const red = pixels[i];
                        const green = pixels[i+1];
                        const blue = pixels[i+2];
                        const color = 'rgb(' + red + "," + green + "," + blue + ")";
                        this.particles.push(new Particle(this , x , y , color));
                    }

                }
            }

        }
        render() {
            this.particles.forEach(particle => {
                particle.update();
                particle.draw();
            })
        }
        resize(width , height){
            this.canvasWidth = width;
            this.canvasHeight = height;
            this.textX = this.canvasWidth/2;
            this.textY = this.canvasHeight/2;
            this.maxTextWidth = this.canvasWidth * 0.8;
        }
    }

    const effect = new Effect(c , canvas.width , canvas.height);
    effect.wrapText("hello");
    effect.render();
    function animate() {
        c.clearRect(0 , 0 , canvas.width , canvas.height);
        effect.render();
        requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener("resize" , function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        effect.resize(canvas.width , canvas.height);
        effect.wrapText(effect.textInput.value);
        console.log("resize")
    });

});