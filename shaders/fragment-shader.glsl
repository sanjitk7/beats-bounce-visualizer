#version 300 es
precision highp float;

uniform vec3 lightdir;
uniform vec3 lightcolor;
uniform vec3 halfway;
uniform vec4 sphere_color;

in vec3 fnormal;
in vec4 tempcolor;
in vec2 texCoord;

out vec4 fragColor;

uniform sampler2D image;

void main() {

    // lighting
    vec3 n = normalize(fnormal);
    float lambert = max(dot(lightdir, n),0.0);
    float blinn = pow(max(dot(-halfway, n), 0.0), 150.0);
    
    // color
    vec4 currentColor = sphere_color;
    vec4 background_fog_color = vec4(normalize(vec3(167,166,157)), 1);

    vec4 final_color_before_fog = vec4(currentColor.rgb * (lightcolor * lambert ), float(currentColor.a));

    fragColor = final_color_before_fog;


    
}