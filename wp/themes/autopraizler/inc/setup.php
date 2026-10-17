<?php
/**
 * Základní nastavení šablony: styly, kategorie vzorů, styly bloků, vazby.
 *
 * @package AutoPraizler
 */

declare( strict_types=1 );

defined( 'ABSPATH' ) || exit;

/**
 * Verze šablony (z hlavičky style.css), používá se pro cache-busting.
 */
function autopraizler_version(): string {
	$version = wp_get_theme( 'autopraizler' )->get( 'Version' );
	return is_string( $version ) && '' !== $version ? $version : '0.1.0';
}

/**
 * Nastavení po načtení šablony.
 */
function autopraizler_setup(): void {
	// Stejný stylesheet pro front end i editor (editor ho obalí do .editor-styles-wrapper).
	add_editor_style( 'style.css' );

	// Vzory WordPressu ani vzdálené vzory z wordpress.org Jarda nepotřebuje,
	// v inserteru zůstanou jen vzory této šablony (viz autopraizler_hide_parent_patterns).
	remove_theme_support( 'core-block-patterns' );
}
add_action( 'after_setup_theme', 'autopraizler_setup', 20 );

add_filter( 'should_load_remote_block_patterns', '__return_false' );

/**
 * Styly pro front end. Rodičovský stylesheet (twentytwentyfive-style) načítá
 * Twenty Twenty-Five sama, náš se zařadí za něj.
 */
function autopraizler_enqueue_styles(): void {
	$version = autopraizler_version();

	wp_enqueue_style(
		'autopraizler-style',
		get_stylesheet_uri(),
		array( 'twentytwentyfive-style' ),
		$version
	);

	if ( ap_is_print_card() ) {
		wp_enqueue_style(
			'autopraizler-print-card',
			get_theme_file_uri( 'assets/css/print-card.css' ),
			array( 'autopraizler-style' ),
			$version,
			'print'
		);
		wp_enqueue_script(
			'autopraizler-print',
			get_theme_file_uri( 'assets/js/print.js' ),
			array(),
			$version,
			array(
				'in_footer' => true,
				'strategy'  => 'defer',
			)
		);
	}
}
add_action( 'wp_enqueue_scripts', 'autopraizler_enqueue_styles', 11 );

/**
 * Kategorie vzorů "AutoPraizler" a vlastní blok přepínače jazyků.
 */
function autopraizler_register_blocks_and_patterns(): void {
	register_block_pattern_category(
		'autopraizler',
		array(
			'label'       => __( 'AutoPraizler', 'autopraizler' ),
			'description' => __( 'Karty služeb a recenzí, kroky, FAQ, ceník, kontakt, výzva Zavolat.', 'autopraizler' ),
		)
	);

	register_block_type( get_theme_file_path( 'blocks/language-switcher' ) );
}
add_action( 'init', 'autopraizler_register_blocks_and_patterns' );

/**
 * Styly tlačítek podle návrhu. Výchozí tlačítko je oranžové, "outline" je
 * vestavěný styl WordPressu (nastavený v theme.json), zbytek doplňujeme tady.
 */
function autopraizler_register_block_styles(): void {
	register_block_style(
		'core/button',
		array(
			'name'  => 'dark',
			'label' => __( 'Tmavé', 'autopraizler' ),
		)
	);
	register_block_style(
		'core/button',
		array(
			'name'  => 'outline-light',
			'label' => __( 'Obrysové světlé (na tmavém pozadí)', 'autopraizler' ),
		)
	);
	register_block_style(
		'core/button',
		array(
			'name'  => 'whatsapp',
			'label' => __( 'WhatsApp', 'autopraizler' ),
		)
	);
}
add_action( 'init', 'autopraizler_register_block_styles' );

/**
 * Vazba bloku: "© ROK AutoPraizler M.L." v patičce, aby se rok nemusel
 * každý leden přepisovat ručně.
 */
function autopraizler_register_block_bindings(): void {
	register_block_bindings_source(
		'autopraizler/copyright',
		array(
			'label'              => _x( 'Copyright s aktuálním rokem', 'Popisek vazby bloku', 'autopraizler' ),
			'get_value_callback' => 'autopraizler_copyright_binding',
		)
	);
}
add_action( 'init', 'autopraizler_register_block_bindings' );

/**
 * @param array<string, mixed> $source_args Argumenty vazby (nepoužité).
 */
function autopraizler_copyright_binding( array $source_args ): string {
	unset( $source_args );
	return '© ' . wp_date( 'Y' ) . ' AutoPraizler M.L.';
}

/**
 * Vzory rodičovské šablony schováme z inserteru (zůstanou registrované,
 * protože na ně odkazují šablony Twenty Twenty-Five pro archivy a příspěvky).
 */
function autopraizler_hide_parent_patterns(): void {
	$registry = WP_Block_Patterns_Registry::get_instance();

	foreach ( $registry->get_all_registered() as $pattern ) {
		$name = (string) ( $pattern['name'] ?? '' );
		if ( ! str_starts_with( $name, 'twentytwentyfive/' ) ) {
			continue;
		}
		if ( isset( $pattern['inserter'] ) && false === $pattern['inserter'] ) {
			continue;
		}
		unregister_block_pattern( $name );
		$pattern['inserter'] = false;
		register_block_pattern( $name, $pattern );
	}
}
add_action( 'init', 'autopraizler_hide_parent_patterns', 20 );

/**
 * Šablona "Page No Title" z Twenty Twenty-Five by Jardu jen mátla.
 *
 * @param WP_Block_Template[] $templates Nalezené šablony.
 * @param array<string, mixed> $query    Dotaz (nepoužitý).
 * @param string              $type      wp_template nebo wp_template_part.
 * @return WP_Block_Template[]
 */
function autopraizler_filter_block_templates( array $templates, array $query, string $type ): array {
	unset( $query );
	if ( 'wp_template' !== $type ) {
		return $templates;
	}
	return array_values(
		array_filter(
			$templates,
			static fn ( $template ): bool => ! isset( $template->slug ) || 'page-no-title' !== $template->slug
		)
	);
}
add_filter( 'get_block_templates', 'autopraizler_filter_block_templates', 10, 3 );

/**
 * Favicon ze šablony, dokud není nastavená ikona webu v Nastavení → Obecné.
 */
function autopraizler_default_site_icon( string $url ): string {
	if ( '' !== $url ) {
		return $url;
	}
	return get_theme_file_uri( 'assets/img/favicon.svg' );
}
add_filter( 'get_site_icon_url', 'autopraizler_default_site_icon' );

/**
 * Je zobrazená stránka tisková karta pro recepce?
 *
 * Platí pro stránku se šablonou page-karta-pro-recepce i pro stránku se slugem
 * karta-pro-recepce (WordPress jí šablonu page-karta-pro-recepce.html přiřadí sám).
 */
function ap_is_print_card(): bool {
	if ( is_admin() || ! is_page() ) {
		return false;
	}
	$post = get_queried_object();
	if ( ! $post instanceof WP_Post ) {
		return false;
	}
	return 'page-karta-pro-recepce' === get_page_template_slug( $post )
		|| 'karta-pro-recepce' === $post->post_name;
}
