<?php
/**
 * SVG upload jen pro administrátora, s kontrolou obsahu na aktivní prvky.
 *
 * WordPress SVG do knihovny médií nepustí. Pro logo a QR kódy ho povolíme
 * uživatelům s oprávněním manage_options (administrátor). Kontrola obsahu
 * sedí ve filtru wp_check_filetype_and_ext, kterým prochází každá cesta
 * nahrání (formulář v administraci, REST API, media_sideload_image,
 * wp_handle_sideload), takže soubor se skriptem, událostmi, externími odkazy
 * nebo styly se odmítne všude. Není to plné čištění SVG: pro SVG z cizích
 * zdrojů nebo od jiných uživatelů použít plugin Safe SVG (docs/navrh-sablony.md).
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
 * Obsahuje SVG skript nebo jiný aktivní / externí obsah?
 *
 * Entity se nejdřív dekódují (javascript&#58; apod.), potom se hledají:
 * <script>, on*= události, javascript:, externí href/xlink:href (http, data,
 * //), <style>, @import, url( mimo interní #odkazy, <foreignObject>, <iframe>,
 * <embed>, <object>.
 */
function ap_svg_is_unsafe( string $contents ): bool {
	$decoded = html_entity_decode( $contents, ENT_QUOTES | ENT_HTML5, 'UTF-8' );
	// odstranit NUL a řídicí znaky, kterými se obchází "javascript:"
	$decoded = (string) preg_replace( '/[\x00-\x08\x0B\x0C\x0E-\x1F]/', '', $decoded );

	$pattern = '~'
		. '<\s*script'
		. '|\son[a-z]+\s*='
		. '|javascript\s*:'
		. '|(?:xlink:)?href\s*=\s*["\']?\s*(?:https?:|data:|//|ftp:)'
		. '|<\s*style'
		. '|@import'
		. '|url\(\s*["\']?\s*(?!#)'
		. '|<\s*foreignObject'
		. '|<\s*iframe'
		. '|<\s*embed'
		. '|<\s*object'
		. '~i';

	return 1 === preg_match( $pattern, $decoded );
}

/**
 * Pro .svg: administrátorovi nastaví ext/type (finfo vrací text/xml) a soubor
 * s nebezpečným obsahem odmítne (ext a type false = WordPress upload zamítne).
 *
 * @param array<string, mixed> $data     ext, type, proper_filename.
 * @param string               $file     Cesta k souboru.
 * @param string               $filename Název souboru.
 * @return array<string, mixed>
 */
function ap_check_svg_filetype( array $data, string $file, string $filename ): array {
	if ( ! str_ends_with( strtolower( $filename ), '.svg' ) ) {
		return $data;
	}

	$reject = array(
		'ext'             => false,
		'type'            => false,
		'proper_filename' => false,
	);

	if ( ! current_user_can( 'manage_options' ) ) {
		return $reject;
	}
	$contents = is_readable( $file ) ? (string) file_get_contents( $file ) : ''; // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
	if ( '' === $contents || ap_svg_is_unsafe( $contents ) ) {
		return $reject;
	}

	$data['ext']  = 'svg';
	$data['type'] = 'image/svg+xml';
	return $data;
}
add_filter( 'wp_check_filetype_and_ext', 'ap_check_svg_filetype', 10, 3 );

/**
 * Srozumitelná chybová hláška pro nahrání z administrace (REST a sideload
 * dostanou obecné "Soubor tohoto typu nelze nahrát" z filtru výše).
 *
 * @param array<string, mixed> $file Pole $_FILES položky.
 * @return array<string, mixed>
 */
function ap_svg_upload_message( array $file ): array {
	$name = strtolower( (string) ( $file['name'] ?? '' ) );
	if ( ! str_ends_with( $name, '.svg' ) ) {
		return $file;
	}
	if ( ! current_user_can( 'manage_options' ) ) {
		$file['error'] = __( 'Soubory SVG smí nahrávat jen správce webu.', 'autopraizler' );
		return $file;
	}
	$contents = (string) file_get_contents( (string) $file['tmp_name'] ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
	if ( ap_svg_is_unsafe( $contents ) ) {
		$file['error'] = __( 'SVG obsahuje skript, styl nebo externí odkaz a nebyl nahrán. Soubor vyčistěte, nebo použijte plugin Safe SVG.', 'autopraizler' );
	}
	return $file;
}
add_filter( 'wp_handle_upload_prefilter', 'ap_svg_upload_message' );
add_filter( 'wp_handle_sideload_prefilter', 'ap_svg_upload_message' );
