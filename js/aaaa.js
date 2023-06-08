window.addEventListener('load', initScene)

const skyImages = [
  'textures/skyy.jpeg',
  'textures/sky.jpg',
  'textures/milkyway.bmp'
];

const meteorImages = [
  'textures/iuna.bmp',
  'textures/meteor.jpeg'
];




const meteors = [
    { x: 0, y: 0, z: -30 },
    { x: 0, y: 0, z: 30 },
    { x: 30, y: 0, z: 0 },
    { x: -30, y: 0, z: 0 },
    { x: 20, y: 0, z: 20 },
    { x: 20, y: 0, z: -20 },
    { x: -20, y: 0, z: -20 },
    { x: -20, y: 0, z: 20 }
]

let meteor, score = 0, timeLeft = 60

function initScene() {
    let orbits = document.querySelectorAll('.orbit')

    orbits.forEach(orbit => {
        meteors.forEach(pos => {
            meteor = document.createElement('a-entity')
            meteor.setAttribute('geometry', { primitive: 'sphere', radius: Math.random() * 3 + 0.5 })
            meteor.setAttribute('material', { shader: 'flat', src: '#meteor' })
            meteor.setAttribute('class', 'meteor')
            meteor.object3D.position.set(pos.x, pos.y, pos.z)

            meteor.setAttribute('animation', {
                property: 'position',
                to: `${pos.x + (Math.random() * 10 - 5)} ${pos.y + (Math.random() * 10 - 5)} ${pos.z + (Math.random() * 10 - 5)}`,
                dur: 35000,
                easing: 'linear',
                loop: true
            });

            meteor.setAttribute('shootable', '')

            orbit.appendChild(meteor)
        })
    })

    setInterval(() => {
        orbits.forEach(orbit => {
            meteors.forEach(pos => {
                meteor = document.createElement('a-entity')
                meteor.setAttribute('geometry', { primitive: 'sphere', radius: Math.random() * 3 + 0.5 })
                meteor.setAttribute('material', { shader: 'flat', src: '#meteor' })
                meteor.setAttribute('class', 'meteor')
                meteor.object3D.position.set(pos.x, pos.y, pos.z)

                meteor.setAttribute('animation', {
                    property: 'position',
                    to: `${pos.x + (Math.random() * 10 - 5)} ${pos.y + (Math.random() * 10 - 5)} ${pos.z + (Math.random() * 10 - 5)}`,
                    dur: 35000,
                    easing: 'linear',
                    loop: true
                });

                meteor.setAttribute('shootable', '')

                orbit.appendChild(meteor)
            })
        })
    }, 35000)

    updateTimer()
}


function createMenuOptions() {
  const menu = document.querySelector('#menu');
  const yOffset = 0.2;

  skyImages.forEach((src, index) => {
    const option = document.createElement('a-text');
    option.setAttribute('value', `Fondo ${index + 1}`);
    option.setAttribute('color', 'white');
    option.setAttribute('position', `-0.8 ${yOffset - index * 0.2} -0.1`);
    option.setAttribute('width', '2');
    option.setAttribute('menu-interaction', '');
    menu.appendChild(option);
  });

  meteorImages.forEach((src, index) => {
    const option = document.createElement('a-text');
    option.setAttribute('value', `Meteorito ${index + 1}`);
    option.setAttribute('color', 'white');
    option.setAttribute('position', `0.2 ${yOffset - index * 0.2} -0.1`);
    option.setAttribute('width', '2');
    option.setAttribute('menu-interaction', '');
    menu.appendChild(option);
  });
}

createMenuOptions();

AFRAME.registerComponent('menu-toggle', {
  init: function () {
    this.el.addEventListener('triggerdown', () => {
      const menu = document.querySelector('#menu');
      const isVisible = menu.getAttribute('visible');
      menu.setAttribute('visible', !isVisible);
    });
  }
});
AFRAME.registerComponent('menu-interaction', {
  init: function () {
    this.el.addEventListener('raycaster-intersected', (event) => {
      const raycasterEl = event.detail.el;
      raycasterEl.addEventListener('triggerdown', () => {
        const menuOption = this.el.getAttribute('value');
        const skyIndex = skyImages.findIndex(src => menuOption === `Fondo ${src}`);
        const meteorIndex = meteorImages.findIndex(src => menuOption === `Meteorito ${src}`);

        if (skyIndex !== -1) {
          document.querySelector('a-sky').setAttribute('src', skyImages[skyIndex]);
        } else if (meteorIndex !== -1) {
          const meteors = document.querySelectorAll('.meteor');
          meteors.forEach(meteor => {
            meteor.setAttribute('material', { shader: 'flat', src: meteorImages[meteorIndex] });
          });
        }
      });
    });
    this.el.addEventListener('raycaster-intersected-cleared', (event) => {
      const raycasterEl = event.detail.el;
      raycasterEl.removeEventListener('triggerdown');
    });
  }
});


function updateTimer() {
    const timerElement = document.querySelector('#timer');
    timerElement.setAttribute('value', `Tiempo restante: ${timeLeft} segundos`);
    if (timeLeft <= 0) {
        gameOver();
    } else {
        timeLeft--;
        setTimeout(updateTimer, 1000);
    }
}

function gameOver() {
    // Detener la generación de meteoritos y mostrar un mensaje de fin de juego
    playGameOverSound();
    alert(`Fin del juego. Has cazado ${score} meteoritos.`);
    location.reload();
}
/* suena demasiado
function playExplosionSound() {
    const explosionSound = document.querySelector('#explosion');
    explosionSound.currentTime = 0;
    explosionSound.play();
}
*/
AFRAME.registerComponent('shootable', {
    init: function () {
        this.el.addEventListener('raycaster-intersected', (event) => {
            const raycasterEl = event.detail.el;
            raycasterEl.addEventListener('triggerdown', () => {
               // playExplosionSound();
                this.el.parentNode.removeChild(this.el);
                document.querySelector('[text]').setAttribute('value', `${++score} meteoritos cazados`);
            });
        });

        this.el.addEventListener('raycaster-intersected-cleared', (event) => {
            const raycasterEl = event.detail.el;
            raycasterEl.removeEventListener('triggerdown');
        });
    }
});

