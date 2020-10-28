
// [COMBO] {"material":"ui_editor_properties_greyscale","combo":"GREYSCALE","type":"options","default":0}

varying vec4 v_TexCoord;

uniform sampler2D g_Texture0; // {"material":"framebuffer","label":"ui_editor_properties_framebuffer","hidden":true}
uniform sampler2D g_Texture1; // {"material":"mask","label":"ui_editor_properties_opacity_mask","mode":"opacitymask","default":"util/white","paintdefaultcolor":"0 0 0 1"}
uniform sampler2D g_Texture2; // {"material":"previous","label":"Prev","hidden":true}

#ifdef HLSL_SM30
uniform vec4 g_Texture0Resolution;
#endif

uniform float g_Amount; // {"material":"strength","label":"ui_editor_properties_strength","default":1.0,"range":[0.01, 5]}

void main() {

	vec2 blurredCoords = v_TexCoord.xy;
	
#ifdef HLSL_SM30
	blurredCoords += 0.75 / g_Texture0Resolution.zw;
#endif

	vec4 blurred = texSample2D(g_Texture0, blurredCoords);
	vec4 albedo = texSample2D(g_Texture2, v_TexCoord.xy);
	
	vec3 delta = albedo.rgb - blurred.rgb;
#if GREYSCALE == 1
	delta = CAST3(dot(vec3(0.11, 0.59, 0.3), delta));
#endif
	vec3 enhanced = albedo.rgb + delta * g_Amount;
	
	float mask = texSample2D(g_Texture1, v_TexCoord.zw).r;
	albedo.rgb = mix(albedo.rgb, enhanced.rgb, mask);
	
	gl_FragColor = albedo;
}
