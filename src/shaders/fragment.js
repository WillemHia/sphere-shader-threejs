const textFragmentShader = /* glsl */`
uniform vec3 uDeepColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vElevation;
void main(){

    float mixStrength = vElevation*uColorMultiplier+uColorOffset; //混合强度
    vec3 color = mix(uSurfaceColor, uDeepColor,mixStrength); //混合颜色
    gl_FragColor = vec4(color, 1.0);
}
`

export default textFragmentShader;