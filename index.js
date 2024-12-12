const SomeGray = new Float32Array([0.09, 0.09, 0.09, 1])
const backColor = new Float32Array([0.15, 0.2, 0.18, 1])
window.once = false
window.twice = 0
window.temp1 = 0
window.temp2 = 0
window.temp3 = 0
window.temp4 = 0
window.reset = false
window.particles = []
window.particleCount = 50

// Audio related globals
let audioCtx, analyser, dataArray;
let beatDetected = false;
let beatThreshold = 28; 
let source;

async function setupAudio() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    dataArray = new Uint8Array(analyser.frequencyBinCount);

    const response = await fetch('data/graphics-testing.mp3'); 
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

    source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(analyser);
    analyser.connect(audioCtx.destination);

    // console.log(audioBuffer);
}

function updateAudioData() {
    analyser.getByteFrequencyData(dataArray);
    // console.log("dataArray from frequData",dataArray)
}

function detectBeat() {
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
    }
    let average = sum / dataArray.length;
    beatDetected = (average > beatThreshold);
    
    // console.log("beatThreshhold", beatThreshold)
    // console.log("beatDetected", beatDetected)
    // console.log("sum", sum)
    // console.log("avg", average)
    // console.log("dataArray", dataArray)
}

// SINGLE GEOMETRY APPROACH - render spheres
function draw(milliseconds) {
    gl.clearColor(...backColor)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.useProgram(program)
    gl.bindVertexArray(geom.vao)

    let lightdir = normalize([1,1,2])
    let halfway = normalize(add(lightdir, [0,0,0]))

    gl.uniform3fv(gl.getUniformLocation(program, 'lightdir'), lightdir)
    gl.uniform3fv(gl.getUniformLocation(program, 'halfway'), halfway)
    gl.uniform3fv(gl.getUniformLocation(program, 'lightcolor'), [1,1,1])

    for (let i=0; i<window.particleCount; i++){
        const thisParticle = window.particles[i]
        let m1 = m4trans(thisParticle.position[0], thisParticle.position[1], thisParticle.position[2])
        let scaleFactorByRadius = 0.3 * thisParticle.radius
        let m2 = m4mul(m1, m4scale(scaleFactorByRadius, scaleFactorByRadius, scaleFactorByRadius))
        
        gl.uniformMatrix4fv(gl.getUniformLocation(program, 'mv'), false, m4mul(v,m2))
        gl.uniformMatrix4fv(gl.getUniformLocation(program, 'p'), false, p)
        gl.uniform4fv(gl.getUniformLocation(program, 'sphere_color'), thisParticle.color)
        gl.drawElements(geom.mode, geom.count, geom.type, 0)
    }
}

function timeStep(milliseconds) {
    // console.log("Timestep!")
    if (audioCtx && analyser && dataArray) {
        // console.log("Timestep! 1")
        // console.log()
        updateAudioData();
        detectBeat();
    }

    window.v = m4mul(
        m4view([1,9,0], [0,0,0], [0,1,1]),
        m4rotX(Math.PI/2),
        m4trans(0,0,2)
    )
    window.m = m4mul(m4trans(0,0,0))

    createInitialForces()

    if (beatDetected) {
        for (let i = 0; i < window.particleCount; i++) {
            let thisParticle = window.particles[i];
            thisParticle.otherForces.push([0, 5, 0]); 
        }
    }

    eulersMethod()
    checkInvisibleBoxCollision()
    draw()

    requestAnimationFrame(timeStep)
}

async function setup(event) {
    window.gl = document.querySelector('canvas').getContext('webgl2', {
        antialias: false, depth:true, preserveDrawingBuffer:true
    })

    let vs = await fetch('shaders/vertex-shader.glsl').then(res => res.text())
    let fs = await fetch('shaders/fragment-shader.glsl').then(res => res.text())

    window.program = compileAndLinkGLSL(gl, vs, fs)
    gl.enable(gl.DEPTH_TEST)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    createInitialParticles(window.particleCount)

    window.geom = setupGeomery(sphere_geom)

    fillScreen()
    window.addEventListener('resize', fillScreen)

    await setupAudio();
    requestAnimationFrame(timeStep)
}

window.addEventListener('load', setup)

// document.getElementById('playAudioButton').addEventListener('click', async () => {
//     if (audioCtx.state === 'suspended') {
//         await audioCtx.resume();
//     } else {
//         source.start(0);
//       }
// });


let isPlaying = false;

document.getElementById('playAudioButton').addEventListener('click', async () => {
    // If audioCtx is not running yet (suspended), and we haven't started playback
    if (!isPlaying) {
        if (audioCtx.state === 'suspended') {
            await audioCtx.resume(); 
        }
        // Start the buffer from the beginning if not started
        source.start(0);
        isPlaying = true;
        document.getElementById('playAudioButton').textContent = "Pause Audio";
    } else {
        // If currently playing, toggle pause/play by suspending/resuming the audio context
        if (audioCtx.state === 'running') {
            await audioCtx.suspend();
            document.getElementById('playAudioButton').textContent = "Play Audio";
        } else if (audioCtx.state === 'suspended') {
            await audioCtx.resume();
            document.getElementById('playAudioButton').textContent = "Pause Audio";
        }
        // Since we are toggling between suspend/resume, isPlaying remains true after first start.
    }
});
