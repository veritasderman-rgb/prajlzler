<?php
/**
 * Propojení překladů stránek a hreflang.
 *
 * Každá stránka má tři volitelná pole (ap_translation_cs, ap_translation_de,
 * ap_translation_en) s ID stránky v daném jazyce. Stačí je vyplnit na jedné
 * straně (např. na české stránce vybrat DE a EN překlad), opačný směr se
 * dohledá automaticky. Z těchto polí se vypisují <link rel="alternate"
 * hreflang> a odkazy v přepínači jazyků. Stránky bez překladu hreflang nemají.
 *
 * @package AutoPraizler
 */

declare( strict_types=1 );

defined( 'ABSPATH' ) || exit;

const AP_LANGUAGES = array( 'cs', 'de', 'en' );

/**
 * Registrace meta polí (viditelná i v REST API / blokovém editoru).
 */
function ap_register_translation_meta(): void {
	$labels = array(
		'cs' => __( 'ID české verze stránky', 'autopraizler' ),
		'de' => __( 'ID německé verze stránky', 'autopraizler' ),
		'en' => __( 'ID anglické verze stránky', 'autopraizler' ),
	);

	foreach ( AP_LANGUAGES as $lang ) {
		register_post_meta(
			'page',
			'ap_translation_' . $lang,
			array(
				'type'              => 'integer',
				'single'            => true,
				'default'           => 0,
				'description'       => $labels[ $lang ],
				'show_in_rest'      => true,
				'sanitize_callback' => 'absint',
				'auth_callback'     => static fn (): bool => current_user_can( 'edit_pages' ),
			)
		);
	}
}
add_action( 'init', 'ap_register_translation_meta' );

/**
 * Jazyk stránky: podle šablony (page-de / page-en), jinak podle nejvyššího
 * rodiče se slugem "de" / "en", jinak čeština.
 */
function ap_page_language( int $post_id ): string {
	if ( $post_id <= 0 ) {
		return 'cs';
	}

	$template = (string) get_page_template_slug( $post_id );
	if ( 'page-de' === $template ) {
		return 'de';
	}
	if ( 'page-en' === $template ) {
		return 'en';
	}

	$ancestors = get_post_ancestors( $post_id );
	$top       = empty( $ancestors ) ? $post_id : (int) end( $ancestors );
	$slug      = (string) get_post_field( 'post_name', $top );

	return in_array( $slug, array( 'de', 'en' ), true ) ? $slug : 'cs';
}

/**
 * Jazyk právě zobrazené stránky (nebo podle cesty, když stránka není známá).
 */
function ap_current_language(): string {
	if ( ! is_admin() && did_action( 'wp' ) && is_page() ) {
		return ap_page_language( get_queried_object_id() );
	}
	return ap_language_from_path() ?? 'cs';
}

/**
 * Překlady stránky: pole ['cs' => ID|0, 'de' => ID|0, 'en' => ID|0]
 * včetně stránky samotné pod jejím jazykem.
 *
 * @return array<string, int>
 */
function ap_get_translations( int $post_id ): array {
	static $cache = array();
	if ( isset( $cache[ $post_id ] ) ) {
		return $cache[ $post_id ];
	}

	$result = array_fill_keys( AP_LANGUAGES, 0 );
	$result[ ap_page_language( $post_id ) ] = $post_id;

	// Uzávěr: od výchozí stránky se jde po všech polích (přímých i opačných),
	// dokud se neobjeví nové stránky. Díky tomu se vyřeší i řetězec
	// EN → DE → CS (EN zná jen DE, DE zná jen CS). Strop 6 kol, max. 3 stránky.
	$seen  = array( $post_id => true );
	$queue = array( $post_id );
	for ( $round = 0; $round < 6 && ! empty( $queue ); $round++ ) {
		$next = array();
		foreach ( $queue as $id ) {
			foreach ( ap_translation_links( $id ) as $lang => $linked_id ) {
				if ( isset( $seen[ $linked_id ] ) ) {
					continue;
				}
				$seen[ $linked_id ] = true;
				if ( 0 !== $result[ $lang ] || 'publish' !== get_post_status( $linked_id ) ) {
					continue;
				}
				$result[ $lang ] = $linked_id;
				$next[]          = $linked_id;
			}
		}
		$queue = $next;
	}

	$cache[ $post_id ] = $result;
	return $result;
}

/**
 * Stránky propojené s $post_id jedním krokem: jeho vlastní pole
 * ap_translation_* (jen když jazyk cílové stránky odpovídá poli) a stránky,
 * které na něj odkazují polem pro jeho jazyk.
 *
 * @return array<string, int> jazyk => ID
 */
function ap_translation_links( int $post_id ): array {
	$own   = ap_page_language( $post_id );
	$links = array();

	foreach ( AP_LANGUAGES as $lang ) {
		if ( $lang === $own ) {
			continue;
		}
		$id = (int) get_post_meta( $post_id, 'ap_translation_' . $lang, true );
		if ( $id > 0 && $id !== $post_id && ap_page_language( $id ) === $lang ) {
			$links[ $lang ] = $id;
		}
	}

	$linked = get_posts(
		array(
			'post_type'      => 'page',
			'post_status'    => 'publish',
			'posts_per_page' => 10,
			'fields'         => 'ids',
			'no_found_rows'  => true,
			'meta_key'       => 'ap_translation_' . $own, // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
			'meta_value'     => (string) $post_id,        // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_value
		)
	);
	foreach ( $linked as $linked_id ) {
		$linked_id = (int) $linked_id;
		$lang      = ap_page_language( $linked_id );
		if ( $linked_id !== $post_id && $lang !== $own && ! isset( $links[ $lang ] ) ) {
			$links[ $lang ] = $linked_id;
		}
	}

	return $links;
}

/**
 * <link rel="alternate" hreflang> jen pro stránky, které mají překlad.
 */
function ap_output_hreflang(): void {
	if ( ! is_page() || is_preview() ) {
		return;
	}
	$post_id      = get_queried_object_id();
	$translations = ap_get_translations( $post_id );

	$others = array_filter(
		$translations,
		static fn ( int $id ): bool => $id > 0 && $id !== $post_id
	);
	if ( empty( $others ) ) {
		return;
	}

	foreach ( AP_LANGUAGES as $lang ) {
		if ( $translations[ $lang ] > 0 ) {
			printf(
				'<link rel="alternate" hreflang="%s" href="%s">' . "\n",
				esc_attr( $lang ),
				esc_url( (string) get_permalink( $translations[ $lang ] ) )
			);
		}
	}
	if ( $translations['cs'] > 0 ) {
		printf(
			'<link rel="alternate" hreflang="x-default" href="%s">' . "\n",
			esc_url( (string) get_permalink( $translations['cs'] ) )
		);
	}
}
add_action( 'wp_head', 'ap_output_hreflang', 2 );

/**
 * URL úvodní stránky daného jazyka (/, /de/, /en/).
 */
function ap_language_home_url( string $lang ): string {
	return 'cs' === $lang ? home_url( '/' ) : home_url( '/' . $lang . '/' );
}

/**
 * Když se v šabloně výslovně nevybere šablona, dostanou stránky pod /de/ a
 * /en/ automaticky šablonu page-de / page-en (německá/anglická hlavička,
 * patička a lišta). Rodičovské stránky "de" a "en" ji dostávají už od
 * WordPressu (page-de.html odpovídá slugu "de").
 *
 * @param string[] $templates Hierarchie šablon pro stránku.
 * @return string[]
 */
function ap_page_template_hierarchy( array $templates ): array {
	$post_id = get_queried_object_id();
	if ( $post_id <= 0 || '' !== (string) get_page_template_slug( $post_id ) ) {
		return $templates;
	}
	$lang = ap_page_language( $post_id );
	if ( 'cs' === $lang ) {
		return $templates;
	}
	$index = array_search( 'page.php', $templates, true );
	if ( false === $index ) {
		$templates[] = 'page-' . $lang . '.php';
		return $templates;
	}
	array_splice( $templates, (int) $index, 0, array( 'page-' . $lang . '.php' ) );
	return $templates;
}
add_filter( 'page_template_hierarchy', 'ap_page_template_hierarchy' );
