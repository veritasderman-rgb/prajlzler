<?php
/**
 * Administrace: metabox překladů, menu pro roli Editor, noindex tiskové karty.
 *
 * @package AutoPraizler
 */

declare( strict_types=1 );

defined( 'ABSPATH' ) || exit;

/* -------------------------------------------------------------------------
 * Metabox "Překlady stránky"
 * ---------------------------------------------------------------------- */

function ap_add_translations_meta_box(): void {
	add_meta_box(
		'ap-translations',
		__( 'Překlady stránky (CZ / DE / EN)', 'autopraizler' ),
		'ap_render_translations_meta_box',
		'page',
		'side',
		'default'
	);
}
add_action( 'add_meta_boxes_page', 'ap_add_translations_meta_box' );

function ap_render_translations_meta_box( WP_Post $post ): void {
	$labels = array(
		'cs' => __( 'Česky (CZ)', 'autopraizler' ),
		'de' => __( 'Deutsch (DE)', 'autopraizler' ),
		'en' => __( 'English (EN)', 'autopraizler' ),
	);
	$own = ap_page_language( $post->ID );

	wp_nonce_field( 'ap_translations_' . $post->ID, 'ap_translations_nonce' );

	echo '<p class="description">' . esc_html__( 'Vyberte stejnou stránku v ostatních jazycích. Stačí vyplnit na jedné straně, druhý směr se dohledá sám. Z tohoto nastavení se tvoří přepínač jazyků a hreflang.', 'autopraizler' ) . '</p>';

	foreach ( AP_LANGUAGES as $lang ) {
		if ( $lang === $own ) {
			continue;
		}
		$field = 'ap_translation_' . $lang;
		$value = (int) get_post_meta( $post->ID, $field, true );

		echo '<p><label for="' . esc_attr( $field ) . '"><strong>' . esc_html( $labels[ $lang ] ) . '</strong></label><br>';
		wp_dropdown_pages(
			array(
				'name'              => $field,
				'id'                => $field,
				'selected'          => $value,
				'exclude'           => $post->ID,
				'show_option_none'  => __( '— bez překladu —', 'autopraizler' ),
				'option_none_value' => 0,
				'post_status'       => array( 'publish', 'draft', 'pending', 'private' ),
			)
		);
		echo '</p>';
	}
}

function ap_save_translations_meta_box( int $post_id, WP_Post $post ): void {
	if ( 'page' !== $post->post_type || wp_is_post_autosave( $post_id ) || wp_is_post_revision( $post_id ) ) {
		return;
	}
	// Uložení z blokového editoru přes REST nemá nonce metaboxu: nic nemazat.
	if ( ! isset( $_POST['ap_translations_nonce'] ) ) {
		return;
	}
	check_admin_referer( 'ap_translations_' . $post_id, 'ap_translations_nonce' );
	if ( ! current_user_can( 'edit_page', $post_id ) ) {
		return;
	}

	foreach ( AP_LANGUAGES as $lang ) {
		$field = 'ap_translation_' . $lang;
		if ( ! isset( $_POST[ $field ] ) ) {
			continue;
		}
		$value = absint( wp_unslash( $_POST[ $field ] ) );
		if ( $value > 0 && $value !== $post_id ) {
			update_post_meta( $post_id, $field, $value );
		} else {
			delete_post_meta( $post_id, $field );
		}
	}
}
add_action( 'save_post_page', 'ap_save_translations_meta_box', 10, 2 );

/* -------------------------------------------------------------------------
 * Role Editor (Jarda) a Site Editor
 *
 * Jarda má roli Editor. Ta ve WordPressu nemá oprávnění edit_theme_options,
 * takže Site Editor (Vzhled → Editor), šablony (wp_template) a části šablon
 * (hlavička, patička, lišta) jsou pro něj nedostupné už ve výchozím stavu,
 * stejně jako nastavení šablony a theme.json. Stránky edituje přes
 * edit_pages, synchronizované vzory (wp_block) přes edit_posts.
 *
 * U blokové šablony je ale správa vzorů schovaná uvnitř Site Editoru, takže
 * editorovi přidáme do menu přímý odkaz na seznam vzorů (edit.php?post_type=wp_block),
 * který funguje i bez Site Editoru. Druhý krok je pojistka: kdyby role někdy
 * oprávnění edit_theme_options dostala (plugin, ruční úprava), Site Editor
 * se pro ne-administrátory stejně nezobrazí.
 * ---------------------------------------------------------------------- */

function ap_editor_menu(): void {
	if ( current_user_can( 'edit_theme_options' ) || ! current_user_can( 'edit_posts' ) ) {
		return;
	}
	add_menu_page(
		__( 'Vzory', 'autopraizler' ),
		__( 'Vzory', 'autopraizler' ),
		'edit_posts',
		'edit.php?post_type=wp_block',
		'',
		'dashicons-layout',
		21
	);
}
add_action( 'admin_menu', 'ap_editor_menu' );

function ap_block_site_editor_for_non_admins(): void {
	global $pagenow;
	if ( 'site-editor.php' === $pagenow && ! current_user_can( 'manage_options' ) ) {
		wp_die(
			esc_html__( 'Úpravy šablony (hlavička, patička, barvy) dělá správce webu. Stránky a vzory upravíte v menu Stránky a Vzory.', 'autopraizler' ),
			'',
			array( 'response' => 403 )
		);
	}
}
add_action( 'admin_init', 'ap_block_site_editor_for_non_admins' );

/* -------------------------------------------------------------------------
 * noindex pro tiskovou kartu pro recepce
 * ---------------------------------------------------------------------- */

/**
 * @param array<string, bool|string> $robots Direktivy pro meta robots.
 * @return array<string, bool|string>
 */
function ap_robots_print_card( array $robots ): array {
	if ( ap_is_print_card() ) {
		$robots['noindex'] = true;
		$robots['follow']  = true;
		unset( $robots['max-image-preview'] );
	}
	return $robots;
}
add_filter( 'wp_robots', 'ap_robots_print_card' );
