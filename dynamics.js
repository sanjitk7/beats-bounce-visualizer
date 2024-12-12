window.gravity = [0,-0.007, 0]
window.dragFactor = 0.06
window.timestep = 0.0007
window.elasticity = 0.6

function createInitialParticles(count/*, reInitForces*/){
    console.log("Initializing Particles")
    
    for (let i=0;i<window.particleCount;i++){
        let radius = Math.random() * (3 - 1) + 1
        let position = [7*Math.random()-5,7*Math.random()-5,7*Math.random()-5]
        let velocity = mul([Math.random()-0.5,Math.random()-0.5,Math.random()-0.5], radius)
        let color = [Math.random(), Math.random(), Math.random(),1.0]
        let actingForces = []

        let newParticle = {
            "radius": radius,
            "position":position,
            "velocity": velocity,
            "color": color,
            "otherForces": []
        }

        if (!once){
            once = true
            console.log("newParticle", newParticle)
        }
        
        window.particles.push(newParticle)
    }

}

function createInitialForces(){
    for (let k=0;k<window.particleCount;k++){
        // create physical forces acting on object
        let  actingForces = []
        let radius_squared = Math.pow(window.particles[k].radius,2)
        let radius_cubed = Math.pow(window.particles[k].radius,3)
        // force = mass * acceleration
        let mass = radius_cubed // assigned uniformly
        let fg = mul(window.gravity,mass)
        
        // drag = -cvr^2
        let fd = mul(window.particles[k].velocity, -window.dragFactor*radius_squared)
        actingForces.push(fg)
        actingForces.push(fd)

        window.particles[k].otherForces = actingForces

        // if (twice<5){
        //     // console.log("????",window.gravity)
        //     console.log("?!1?",actingForces)
        //     twice++
        // }
        // if (!once){
        //     once = true
        //     console.log("newParticle", newParticle)
        // }
    }
}


function eulersMethod(){
    // for each particle update position
    let newVelocity = 0
    
    // console.log("eulers method init forces:",window.particles[1].otherForces)

    if (temp2<5){
        temp2++
        console.log("Particle before force consumption", window.particles[4].velocity)
    }

    for (let i=0;i<window.particleCount;i++){
        let netforce = [0,0,0]
        let radius_cubed = Math.pow(window.particles[i].radius,3)
        let thisParticle = window.particles[i]
        thisParticle.position = add(thisParticle.velocity, thisParticle.position)
        for (let j=0;j<thisParticle.otherForces.length;j++){
            netforce = add(netforce, thisParticle.otherForces[j])
            
        }
        thisParticle.velocity = add(thisParticle.velocity, div(netforce, radius_cubed))
        
        // if (temp4<10){
        //     temp4++
        //     console.log("Particle vel", radius_cubed)
        // }
        // eulers rule approximation
        newVelocity = newVelocity + mag(thisParticle.velocity)
        thisParticle.otherForces = []

        window.particles[i] = thisParticle
    }

    // if (temp3<5){
    //     temp3++
    //     console.log("Particle after force consumption", window.particles[4].velocity)
    // }
    
}
