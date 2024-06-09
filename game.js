const config = {
    type: Phaser.AUTO,
    width: 1400, // Tamaño de la ventana del juego
    height: 2400, // Tamaño de la ventana del juego
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let plane;
let cursors;
let keys;
let speed = 0;
const maxSpeed = 200;
const acceleration = 10;
const deceleration = 5;

function preload() {
    this.load.image('map', 'map_small.jpg'); // Usar la imagen redimensionada
    this.load.image('plane', 'airplane.png');
}

function create() {
    // Crear un grupo de tiles para el mapa
    const mapWidth = 4096;
    const mapHeight = 2048;
    const tileCount = Math.ceil(config.width / mapWidth) + 1;

    for (let i = 0; i < tileCount; i++) {
        this.add.image(i * mapWidth, config.height / 2, 'map').setOrigin(0, 0.5);
    }

    // Ajustar el tamaño del mundo en el eje X de forma infinita
    this.cameras.main.setBounds(0, 0, Number.MAX_SAFE_INTEGER, config.height);
    this.physics.world.setBounds(0, 0, Number.MAX_SAFE_INTEGER, config.height);

    // Añadir la avioneta
    plane = this.physics.add.image(config.width / 2, config.height / 2, 'plane');
    plane.setOrigin(0.5, 0.5);
    plane.setDamping(true);
    plane.setDrag(0.9);
    plane.setMaxVelocity(maxSpeed);

    // Hacer que la cámara siga a la avioneta
    this.cameras.main.startFollow(plane);
    this.cameras.main.setZoom(2); // Ajusta el nivel de zoom según lo necesario

    cursors = this.input.keyboard.createCursorKeys();
    keys = this.input.keyboard.addKeys('A,D');
}

function update() {
    if (keys.A.isDown) {
        if (speed < maxSpeed) {
            speed += acceleration;
        }
    } else if (keys.D.isDown) {
        if (speed > 0) {
            speed -= deceleration;
        }
    } else {
        if (speed > 0) {
            speed -= deceleration;
        }
        if (speed < 0) {
            speed = 0;
        }
    }

    if (cursors.left.isDown) {
        plane.setAngularVelocity(-200);
    } else if (cursors.right.isDown) {
        plane.setAngularVelocity(200);
    } else {
        plane.setAngularVelocity(0);
    }

    this.physics.velocityFromRotation(plane.rotation, speed, plane.body.velocity);

    // Limitar el movimiento de la avioneta en el eje Y
    if (plane.y < 0) {
        plane.y = 0;
    } else if (plane.y > config.height) {
        plane.y = config.height;
    }
}
