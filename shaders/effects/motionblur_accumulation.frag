
varying vec4 v_TexCoord;

uniform sampler2D g_Texture0; // {"material":"framebuffer","label":"ui_editor_properties_framebuffer","hidden":true}
uniform sampler2D g_Texture1; // {"material":"previous","label":"Previous framebuffer","hidden":true}
uniform sampler2D g_Texture2; // {"material":"mask","label":"ui_editor_properties_opacity_mask","mode":"opacitymask","default":"util/white","combo":"MASK","paintdefaultcolor":"0 0 0 1"}

uniform float g_Amount; // {"material":"rate","label":"ui_editor_properties_accumulation_rate","default":0.8,"range":[0.01, 1]}

void main() {
	vec4 albedo = texSample2D(g_Texture0, v_TexCoord.xy);
	vec4 pastAlbedo = texSample2D(g_Texture1, v_TexCoord.xy);
	
	float rate = g_Amount;
#if MASK == 1
	float mask = texSample2D(g_Texture2, v_TexCoord.zw).r;
	rate = g_Amount + (1.0 - g_Amount) * (1.0 - mask);
#endif

	gl_FragColor = mix(pastAlbedo, albedo, rate);
}
