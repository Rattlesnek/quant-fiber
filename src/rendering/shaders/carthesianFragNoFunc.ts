export const carthesianFragNoFunc = `
precision highp float;

varying vec2 vUv;
uniform float time;
uniform vec2 range;
uniform vec2 xDomain;
uniform vec2 yDomain;
uniform float circleInvRad;

const int COLORS_SIZE = 4;
const vec3 ERR_COLOR = vec3(0.0, 0.0, 0.0);

const int SAMPLES_S = 4;
const int N_SAMPLES = SAMPLES_S * SAMPLES_S;

const float M_PI = 3.1415926535897932384626433832795;

vec2[N_SAMPLES] supersampling(vec2 coord, float pixSize)
{
    float sampleSize = pixSize / float(SAMPLES_S);
    vec2 leftUp = coord - pixSize / 2.0 + sampleSize / 2.0; 
    
    vec2 samples[N_SAMPLES];
    for (int i = 0; i < SAMPLES_S; i++)
    {
        for (int j = 0; j < SAMPLES_S; j++)
        {
            vec2 sampl = leftUp + vec2(sampleSize * float(j), sampleSize * float(i)); 
            samples[i * SAMPLES_S + j] = sampl;
        }
    }
    return samples;    
}

float atan2(float y, float x)
{
    if (x > 0.0)
    {
        return atan(y / x);
    }
    else if (x < 0.0 && y >= 0.0)
    {
        return atan(y / x) + M_PI;
    }    
    else if (x < 0.0 && y < 0.0)
    {
        return atan(y / x) - M_PI;
    }
    else if (x == 0.0 && y > 0.0)
    {
        return M_PI / 2.0;
    }
    else if (x == 0.0 && y < 0.0)
    {
        return -M_PI / 2.0; 
    }
    return 0.0; // undefined
}

// transform classic uv into carthesian coordinates and use defined domains
vec2 uvToCarthesian(vec2 uv, vec2 xDomain, vec2 yDomain)
{
    float x = xDomain.x + uv.x * (xDomain.y - xDomain.x);
    float y = yDomain.x + uv.y * (yDomain.y - yDomain.x);
    return vec2(x, y);
}

vec2 getOrigin(vec2 xDomain, vec2 yDomain)
{
    float x = xDomain.x + (xDomain.y - xDomain.x) / 2.0;
    float y = yDomain.x + (yDomain.y - yDomain.x) / 2.0;
    return vec2(x, y);
}

vec2 carthesianCircleInversion(vec2 carth, vec2 o, float r)
{
    vec2 dir = carth - o;
    float x = r * r / length(dir);
    return x * normalize(dir) + o;
}

// transform quadrants into polar coordinates and use defined domains
vec2 quadToPolar(vec2 quad, vec2 rDomain, vec2 phiDomain)
{   
    float r = sqrt(dot(quad, quad));
    float extR = r * (rDomain.y - rDomain.x) + rDomain.x;
    // Normalize phi and revert
    float phi = 1.0 - abs(atan2(quad.y, quad.x)) / M_PI; 
    float extPhi = phi * (phiDomain.y - phiDomain.x) + phiDomain.x;
    return vec2(extR, extPhi);
}

vec3 getColor(float value, vec2 range, vec4 colors[COLORS_SIZE])
{
    // Clamp to range
    value = clamp(value, range.x, range.y);
    
    float len = range.y - range.x; 
    float norm = (value - range.x) / len;
    
    // Get two closest colors
    vec3 color = ERR_COLOR;
    for (int i = 0; i < COLORS_SIZE-1; i++)
    {
        vec4 curr = colors[i];
        vec4 next = colors[i+1];
        if (curr.w <= norm && norm <= next.w)
        {
            float btw = (norm - curr.w) / (next.w - curr.w);
            color = mix(curr.xyz, next.xyz, btw);
            break;
        }
    }
    return color;
}

void main()
{
    // Function domain
    // const vec2 xDomain = vec2(-35.0, 35.0);
    // const vec2 yDomain = vec2(-25.0, 25.0);
    
    // Function range
    //const vec2 range = vec2(0, 100); // 100
    
    // Colors
    vec4 colors[COLORS_SIZE] = vec4[](
        vec4(1.0, 1.0, 1.0, 0.0),
        vec4(0.78, 0.16, 0.11, 0.34),
        vec4(0.89, 0.48, 0.21, 0.63),
        vec4(1.0, 1.0, 1.0, 1.0)
    );
    
    // uv - normalized pixel coordinates (from 0 to 1)
    vec2 uv = vUv;
    uv.y = 1.0 - uv.y;
    
    // maxUv - one coordinate with maximal resolution is normalized other is trimmed
    // quadrants - derived from maxUv - point (0.0, 0.0) is in the middle of the picture
    // float maxRes = max(iResolution.x, iResolution.y);
    // vec2 qRes = iResolution.xy / maxRes;
    // vec2 maxUv = fragCoord / maxRes;
    // maxUv.y = qRes.y - maxUv.y;
    // vec2 quadrants = 2.0 * maxUv - qRes;
    // float quadPixSize = 2.0 / maxRes;
    
    // Supersampling
    //vec2 samples[] = supersampling(uv, quadPixSize);
    
    // vec3 totalColor = vec3(0.0);
    // for (int i = 0; i < N_SAMPLES; i++)
    // {
    //     // Calculate coord
    //     //vec2 coord = quadToPolar(samples[i], xDomain, yDomain);
    //     vec2 coord = uvToCarthesian(samples[i], xDomain, yDomain);
    //     coord = carthesianCircleInversion(coord, getOrigin(xDomain, yDomain), 22.0);

    //     float value = function(coord.x, coord.y, time);

    //     totalColor = totalColor + getColor(value, range, colors);
    // }
    // vec3 avgColor = totalColor / float(N_SAMPLES);    

    vec2 coord = uvToCarthesian(uv, xDomain, yDomain);
    //coord = carthesianCircleInversion(coord, getOrigin(xDomain, yDomain), circleInvRad);
    
    float value = function(coord.x, coord.y, time);


    vec3 avgColor = getColor(value, range, colors);

    // Output to screen
    gl_FragColor = vec4(avgColor, 1.0);
}`;
