
// checking future timestep in eulers update and changing direction of velocity 
function checkInvisibleBoxCollision(){
    console.log("INVISIBLE BOX COLLISION")

    for (let k=0;k<window.particleCount;k++){
        let thisParticle = window.particles[k]
        let checkNextPositionBeforeUpdate = add(thisParticle.velocity, thisParticle.position)
        let nextX = checkNextPositionBeforeUpdate[0]
        let nextY = checkNextPositionBeforeUpdate[1]
        let nextZ = checkNextPositionBeforeUpdate[2]

        // change velocity direction to opposite direction with a elasticty coeifficient 
        if (nextX > 5){
            let collision_direction = [-1,0,0]
            let sd = dot(thisParticle.velocity, collision_direction)
            let fixingFactor = -(1+window.elasticity)*sd
            let bounceVelocity = mul(collision_direction, fixingFactor)
            thisParticle.velocity = add(thisParticle.velocity, bounceVelocity)
            window.particles[k] = thisParticle
        }
        if (nextX < -5){
            let collision_direction = [1,0,0]
            let sd = dot(thisParticle.velocity, collision_direction)
            let fixingFactor = -(1+window.elasticity)*sd
            let bounceVelocity = mul(collision_direction, fixingFactor)
            thisParticle.velocity = add(thisParticle.velocity, bounceVelocity)
            window.particles[k] = thisParticle
        }


        // for top and bottom walls
        if (nextY > 5){
            let collision_direction = [0,-1,0]
            let sd = dot(thisParticle.velocity, collision_direction)
            let fixingFactor = -(1+window.elasticity)*sd
            let bounceVelocity = mul(collision_direction, fixingFactor)
            thisParticle.velocity = add(thisParticle.velocity, bounceVelocity)
            window.particles[k] = thisParticle
        }
        if (nextY < -5){
            let collision_direction = [0,1,0]
            let sd = dot(thisParticle.velocity, collision_direction)
            let fixingFactor = -(1+window.elasticity)*sd
            let bounceVelocity = mul(collision_direction, fixingFactor)
            thisParticle.velocity = add(thisParticle.velocity, bounceVelocity)
            window.particles[k] = thisParticle
        }

        // for front and back walls
        if (nextZ > 5){
            let collision_direction = [0,0,-1]
            let sd = dot(thisParticle.velocity, collision_direction)
            let fixingFactor = -(1+window.elasticity)*sd
            let bounceVelocity = mul(collision_direction, fixingFactor)
            thisParticle.velocity = add(thisParticle.velocity, bounceVelocity)
            window.particles[k] = thisParticle
        }
        if (nextZ < -5){
            let collision_direction = [0,0,1]
            let sd = dot(thisParticle.velocity, collision_direction)
            let fixingFactor = -(1+window.elasticity)*sd
            let bounceVelocity = mul(collision_direction, fixingFactor)
            thisParticle.velocity = add(thisParticle.velocity, bounceVelocity)
            window.particles[k] = thisParticle
        }


    }
}