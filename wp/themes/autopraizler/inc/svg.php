<?php
/**
 * SVG upload jen pro administrátora, s jednoduchou kontrolou obsahu.
 *
 * WordPress SVG do knihovny médií nepustí. Pro logo a QR kódy ho povolíme
 * uživatelům s oprávněním manage_options (administrátor) a soubor odmítneme,
 * když obsahuje skript nebo jiný aktivní obsah. Toto není plné čištění SVG.
 * Pokud bude SVG nahrávat i někdo jiný než správce, nebo půjde o SVG z cizích
 * zdrojů, doporučený postup je plugin Safe SVG (docs/navrh-sablony.md).
 *
 * @package AutoPraizler
 */

declare( strict_types=1 );

defined( 'ABSPATH' ) || exit;

/**
 * @param array<string, string> $mimes Povolené typy.
 * @return array<string, string>
 */
function ap_allow_svg_mimes( array $mimes ): array {
	if ( current_user_can( 'manage_options' ) ) {
		$mimes['svg'] = 'image/svg+xml';
	}
	return $mimes;
}
add_filter( 'upload_mimes', 'ap_allow_svg_mimes' );

/**
 * WordPress ověřuje skutečný MIME typ přes finfo, u SVG vrací text/xml nebo
 * text/plain a upload odmítne. Pro administrátora a příponu .svg to srovnáme.
 *
 * @param array<string, mixed> $data     ext, type, proper_filename.
 * @param string               $file     Cesta k souboru.
 * @param string               $filename Název souboru.
 * @return array<string, mixed>
 */
function ap_check_svg_filetype( array $data, string $file, string $filename ): array {
	unset( $file );
	if ( ! current_user_can( 'manage_options' ) ) {
		return $data;
	}
	if ( str_ends_with( strtolower( $filename ), '.svg' ) ) {
		$data['ext']  = 'svg';
		$data['type'] = 'image/svg+xml';
	}
	return $data;
}
add_filter( 'wp_check_filetype_and_ext', 'ap_check_svg_filetype', 10, 3 );

/**
 * Základní kontrola obsahu před uložením.
 *
 * @param array<string, mixed> $file Pole $_FILES položky.
 * @return array<string, mixed>
 */
function ap_sanity_check_svg_upload( array $file ): array {
	$name = strtolower( (string) ( $file['name'] ?? '' ) );
	if ( ! str_ends_with( $name, '.svg' ) ) {
		return $file;
	}
	if ( ! current_user_can( 'manage_options' ) ) {
		$file['error'] = __( 'Soubory SVG smí nahrávat jen správce webu.', 'autopraizler' );
		return $file;
	}
	$contents = (string) file_get_contents( (string) $file['tmp_name'] ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
	if ( preg_match( '/<script|javascript:|\son[a-z]+\s*=|<foreignObject|<iframe|<embed|<object|xlink:href\s*=\s*["\']\s*(?!#)/i', $contents ) ) {
		$file['error'] = __( 'SVG obsahuje skript nebo aktivní obsah a nebyl nahrán. Soubor vyčistěte, nebo použijte plugin Safe SVG.', 'autopraizler' );
	}
	return $file;
}
add_filter( 'wp_handle_upload_prefilter', 'ap_sanity_check_svg_upload' );
