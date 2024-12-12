// Code from Lecture Example 

const IlliniBlue = new Float32Array([0.075, 0.16, 0.292, 1])
const IlliniOrange = new Float32Array([1, 0.373, 0.02, 1])
const IdentityMatrix = new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1])

/**
 * Given the source code of a vertex and fragment shader, compiles them,
 * and returns the linked program.
 */

function compileAndLinkGLSL(which_gl, vs_source, fs_source) {
    let vs = which_gl.createShader(which_gl.VERTEX_SHADER)
    which_gl.shaderSource(vs, vs_source)
    gl.compileShader(vs)
    if (!which_gl.getShaderParameter(vs, which_gl.COMPILE_STATUS)) {
        console.error(which_gl.getShaderInfoLog(vs))
        throw Error("Vertex shader compilation failed")
    }

    let fs = which_gl.createShader(which_gl.FRAGMENT_SHADER)
    which_gl.shaderSource(fs, fs_source)
    which_gl.compileShader(fs)
    if (!which_gl.getShaderParameter(fs, which_gl.COMPILE_STATUS)) {
        console.error(which_gl.getShaderInfoLog(fs))
        throw Error("Fragment shader compilation failed")
    }

    let program = which_gl.createProgram()
    which_gl.attachShader(program, vs)
    which_gl.attachShader(program, fs)
    which_gl.linkProgram(program)
    if (!which_gl.getProgramParameter(program, which_gl.LINK_STATUS)) {
        console.error(which_gl.getProgramInfoLog(program))
        throw Error("Linking failed")
    }
    
    return program
}

/**
 * Sends per-vertex data to the GPU and connects it to a VS input
 * 
 * @param data    a 2D array of per-vertex data (e.g. [[x,y,z,w],[x,y,z,w],...])
 * @param program a compiled and linked GLSL program
 * @param vsIn    the name of the vertex shader's `in` attribute
 * @param mode    (optional) gl.STATIC_DRAW, gl.DYNAMIC_DRAW, etc
 * 
 * @returns the ID of the buffer in GPU memory; useful for changing data later
 */
function supplyDataBuffer(data, program, vsIn, mode) {
    if (mode === undefined) mode = gl.STATIC_DRAW
    
    let buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    let f32 = new Float32Array(data.flat())
    gl.bufferData(gl.ARRAY_BUFFER, f32, mode)
    
    let loc = gl.getAttribLocation(program, vsIn)
    gl.vertexAttribPointer(loc, data[0].length, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(loc)
    
    return buf;
}


function setupGeomery(geom) {
    var triangleArray = gl.createVertexArray()
    gl.bindVertexArray(triangleArray)

    for(let name in geom.attributes) {
        // console.log("creating geom buffer for attribute: ",name)
        let data = geom.attributes[name]
        supplyDataBuffer(data, program, name)
    }

    var indices = new Uint16Array(geom.triangles.flat())
    var indexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

    return {
        mode: gl.TRIANGLES,
        count: indices.length,
        type: gl.UNSIGNED_SHORT,
        vao: triangleArray
    }
}