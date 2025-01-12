// Establecer la fecha límite para el contador
const targetDate = new Date('2025-01-12T18:38:00').getTime();

// Elementos de la interfaz
const countdownElement = document.getElementById("countdown");
const overlay = document.getElementById("overlay");
const content = document.getElementById("content");


document.addEventListener("DOMContentLoaded", function () {
    const showTextButton = document.getElementById('showTextButton');
    const icing = document.querySelector(".icing");
    const candleCountDisplay = document.getElementById("candleCount");
    const messageDiv = document.getElementById("message");
    const blowMessageDiv = document.getElementById("blowMessage");
    const felicitacionMessageDiv = document.getElementById("felicitacion");

    let candles = [];
    let audioContext;
    let analyser;
    let microphone;
    let audio = new Audio('audio.mp3');

const interval = setInterval(function () {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
        clearInterval(interval);
        document.getElementById("countdown").innerHTML = "¡Es hora de celebrar! 🎉";
        
        // animación suave para la transición
        overlay.style.animation = "fadeOut 1s forwards";
        setTimeout(() => {
            overlay.style.display = "none";
            
            // Mostrar el regalo con una animación más suave
            const giftContainer = document.getElementById('gift-container');
            giftContainer.style.display = 'flex';
            giftContainer.style.animation = 'fadeIn 1s forwards';
            
            // Ocultar otros elementos
            document.querySelector('.cake').style.display = 'none';
            document.querySelector('.candle-count-display').style.display = 'none';
            document.querySelector('.info').style.display = 'none';
        }, 1000);
    } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Formato del contador
        countdownElement.innerHTML = `
            <div class="countdown-segment">
                <span class="count">${days}</span>
                <span class="label">días</span>
            </div>
            <div class="countdown-segment">
                <span class="count">${hours}</span>
                <span class="label">horas</span>
            </div>
            <div class="countdown-segment">
                <span class="count">${minutes}</span>
                <span class="label">minutos</span>
            </div>
            <div class="countdown-segment">
                <span class="count">${seconds}</span>
                <span class="label">segundos</span>
            </div>
        `;
    }
}, 1000);
    function updateCandleCount() {
        const activeCandles = candles.filter(
            (candle) => !candle.classList.contains("out")
        ).length;
        candleCountDisplay.textContent = activeCandles;
    }

    function addCandle(left, top) {
        const candle = document.createElement("div");
        candle.className = "candle";
        candle.style.position = "absolute";
        candle.style.left = left + "px";
        candle.style.top = top + "px";

        const flame = document.createElement("div");
        flame.className = "flame";
        candle.appendChild(flame);

        icing.appendChild(candle);
        candles.push(candle);
        updateCandleCount();

        if (candles.length === 1) {
            messageDiv.style.opacity = "0";
            setTimeout(() => {
                messageDiv.style.display = "none";
                blowMessageDiv.style.display = "block";
                setTimeout(() => {
                    blowMessageDiv.style.opacity = "1";
                }, 10);
            }, 500);
        }
    }

    icing.addEventListener("click", function (event) {
        const rect = icing.getBoundingClientRect();
        const left = event.clientX - rect.left;
        const top = event.clientY - rect.top;
        addCandle(left, top);
    });

    function isBlowing() {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
        }
        let average = sum / bufferLength;

        return average > 50;
    }

    function blowOutCandles() {
        let blownOut = 0;

        if (candles.length > 0 && candles.some((candle) => !candle.classList.contains("out"))) {
            if (isBlowing()) {
                candles.forEach((candle) => {
                    if (!candle.classList.contains("out") && Math.random() > 0.5) {
                        candle.classList.add("out");
                        blownOut++;
                    }
                });
            }

            if (blownOut > 0) {
                updateCandleCount();
            }

            if (candles.every((candle) => candle.classList.contains("out"))) {
                setTimeout(function () {
                    triggerConfetti();
                    endlessConfetti();
                }, 200);
                audio.play();
                felicitacionMessageDiv.style.display = "block";
                felicitacionMessageDiv.style.opacity = "1";
            }
        }
    }

    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then(function (stream) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                analyser = audioContext.createAnalyser();
                microphone = audioContext.createMediaStreamSource(stream);
                microphone.connect(analyser);
                analyser.fftSize = 256;
                setInterval(blowOutCandles, 200);
            })
            .catch(function (err) {
                console.log("Sin acceso al micrófono: " + err);
            });
    } else {
        console.log("Error");
    }
});

document.querySelector('.gift').addEventListener('click', function() {
    this.classList.add('open');
    
    setTimeout(() => {
        document.getElementById('gift-container').style.display = 'none';
        document.querySelector('.cake').style.display = 'block';
        document.querySelector('.candle-count-display').style.display = 'block';
        document.querySelector('.info').style.display = 'block';
        
        document.querySelector('.cake').style.animation = 'appear 1s forwards';
        document.querySelector('.candle-count-display').style.animation = 'appear 1s forwards';
    }, 1000);
});

function triggerConfetti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
}

function endlessConfetti() {
    setInterval(function () {
        confetti({
            particleCount: 200,
            spread: 90,
            origin: { y: 0 }
        });
    }, 1000);
}
