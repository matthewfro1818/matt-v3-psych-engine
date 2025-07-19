#pragma header

//https://github.com/jamieowen/glsl-blend !!!!
        
float blendOverlay(float base, float blend) {
    return base<0.5?(2.0*base*blend):(1.0-2.0*(1.0-base)*(1.0-blend));
}

vec3 blendOverlay(vec3 base, vec3 blend) {
    return vec3(blendOverlay(base.r,blend.r),blendOverlay(base.g,blend.g),blendOverlay(base.b,blend.b));
}

vec3 blendOverlay(vec3 base, vec3 blend, float opacity) {
    return (blendOverlay(base, blend) * opacity + base * (1.0 - opacity));
}

float blendColorDodge(float base, float blend) {
    return (blend==1.0)?blend:min(base/(1.0-blend),1.0);
}

vec3 blendColorDodge(vec3 base, vec3 blend) {
    return vec3(blendColorDodge(base.r,blend.r),blendColorDodge(base.g,blend.g),blendColorDodge(base.b,blend.b));
}

vec3 blendColorDodge(vec3 base, vec3 blend, float opacity) {
    return (blendColorDodge(base, blend) * opacity + base * (1.0 - opacity));
}

float blendLighten(float base, float blend) {
    return max(blend,base);
}
vec3 blendLighten(vec3 base, vec3 blend) {
    return vec3(blendLighten(base.r,blend.r),blendLighten(base.g,blend.g),blendLighten(base.b,blend.b));
}
vec3 blendLighten(vec3 base, vec3 blend, float opacity) {
    return (blendLighten(base, blend) * opacity + base * (1.0 - opacity));
}

vec3 blendMultiply(vec3 base, vec3 blend) {
    return base*blend;
}
vec3 blendMultiply(vec3 base, vec3 blend, float opacity) {
    return (blendMultiply(base, blend) * opacity + base * (1.0 - opacity));
}

float blendAdd(float base, float blend) {
	return min(base+blend,1.0);
}

vec3 blendAdd(vec3 base, vec3 blend) {
	return min(base+blend,vec3(1.0));
}

vec3 blendAdd(vec3 base, vec3 blend, float opacity) {
	return (blendAdd(base, blend) * opacity + base * (1.0 - opacity));
}

float inv(float val)
{
    return (0.0 - val) + 1.0;
}

vec3 overlayColor = vec3(0.9, 0.5, 0.0);
float overlayAlpha = 0.2;

vec3 satinColor = vec3(0.8*0.05, 0.2*0.05, 0.0);
float satinAlpha = 0.9;

vec3 innerShadowColor = vec3(0.9, 0.5, 0.1);
float innerShadowAlpha = 1.0;
float innerShadowAngle = -2.0;
float innerShadowDistance = 14.0;

uniform vec4 frameBounds;
uniform vec2 frameOffset;

uniform float volcano;

float SAMPLEDIST = 5.0;
        
void main()
{	
    vec2 uv = openfl_TextureCoordv.xy;
    vec4 spritecolor = flixel_texture2D(bitmap, uv);
    vec2 resFactor = 1.0 / openfl_TextureSize.xy;


    vec2 frameUV = vec2(
        (uv.x - frameBounds.x) * ((1.0) / (frameBounds.z - frameBounds.x)),
        (uv.y - frameBounds.y) * ((1.0) / (frameBounds.w - frameBounds.y))
    );
    //frameUV += frameOffset * openfl_TextureSize;
    frameUV -= vec2(0.5, 0.5);
    
    spritecolor.rgb = blendMultiply(spritecolor.rgb, satinColor, satinAlpha);

    //inner shadow
    float offsetX = cos(innerShadowAngle - (volcano*2.0));
    float offsetY = sin(innerShadowAngle - (volcano*2.0));
    vec2 distMult = (innerShadowDistance*resFactor) / SAMPLEDIST;

    for (float i = 0.0; i < SAMPLEDIST; i++) //sample nearby pixels to see if theyre transparent, multiply blend by inverse alpha to brighten the edge pixels
    {
        vec2 offsetUV = uv + vec2(offsetX*(distMult.x*i), offsetY*(distMult.y*i));

        vec4 col = vec4(0.0, 0.0, 0.0, 0.0);
        if (offsetUV.x < frameBounds.x || offsetUV.x > frameBounds.z || offsetUV.y < frameBounds.y || offsetUV.y > frameBounds.w) //outside frame bounds
        {

        }
        else 
        {
            //make sure to use texture2D instead of flixel_texture2D so alpha doesnt effect it
            col = texture2D(bitmap, offsetUV); //sample now
        }
        spritecolor.rgb = blendColorDodge(spritecolor.rgb, innerShadowColor, innerShadowAlpha * inv(col.a)); //mult by the inverse alpha so it blends from the outside
    }

    spritecolor.rgb = blendAdd(spritecolor.rgb, overlayColor, ((volcano*0.5) + 0.8) * abs((frameUV.x*frameUV.x) + (frameUV.y*frameUV.y)));  
    gl_FragColor = spritecolor*spritecolor.a;

    //gl_FragColor = vec4(frameUV.x*0.5, 0.0, 0.0, spritecolor.a);
}