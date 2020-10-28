
// [COMBO] {"material":"ui_editor_properties_blend_mode","combo":"BLENDMODE","type":"imageblending","default":2}
// [COMBO] {"material":"ui_editor_properties_write_alpha","combo":"WRITEALPHA","type":"options","default":0}

#include "common_blending.h"

varying vec4 v_TexCoord;

uniform float g_Multiply; // {"material":"multiply","label":"ui_editor_properties_multiply","default":1,"range":[0.0, 10.0]}
uniform float g_AlphaMultiply; // {"material":"alpha","label":"ui_editor_properties_alpha","default":1,"range":[0.0, 1.0]}

#if OPACITYMASK == 1
varying vec2 v_TexCoordOpacity;
#endif

uniform sampler2D g_Texture0; // {"material":"framebuffer","label":"ui_editor_properties_framebuffer","hidden":true}
uniform sampler2D g_Texture1; // {"default":"util/white","label":"ui_editor_properties_blend_texture","material":"blend","mode":"rgbmask"}

uniform sampler2D g_Texture2; // {"combo":"OPACITYMASK","default":"util/white","label":"ui_editor_properties_opacity_mask","material":"mask","mode":"opacitymask","paintdefaultcolor":"0 0 0 1"}


void main() {
	vec4 albedo = texSample2D(g_Texture0, v_TexCoord.xy);
	vec4 mask = texSample2D(g_Texture1, v_TexCoord.zw);
	float blend = mask.a * g_Multiply;
	
#if OPACITYMASK == 1
	blend *= texSample2D(g_Texture2, v_TexCoordOpacity).r;
#endif

	albedo.rgb = ApplyBlending(BLENDMODE, albedo.rgb, mask.rgb, blend);
	
#if WRITEALPHA
	albedo.a = mask.a * g_AlphaMultiply;
#endif

	gl_FragColor = albedo;
}
