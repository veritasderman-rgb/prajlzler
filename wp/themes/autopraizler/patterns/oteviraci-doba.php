<?php
/**
 * Title: Otevírací doba
 * Slug: autopraizler/oteviraci-doba
 * Categories: autopraizler
 * Description: Tabulka Po–Čt / Pá / So–Ne. Určeno jako synchronizovaný vzor „Otevírací doba“. Doba zatím podle Googlu, čeká na potvrzení majitele (otázka č. 1).
 * Keywords: otevírací doba, otevřeno, hodiny
 * Viewport Width: 600
 *
 * Řádky se berou z inc/business.php při vložení; po vložení je tabulka kopií
 * v databázi (viz README).
 *
 * @package AutoPraizler
 */

$ap_rows = '';
foreach ( ap_hours_rows( 'cs' ) as $ap_row ) {
	$ap_rows .= '<tr><td>' . esc_html( $ap_row[0] ) . '</td><td>' . esc_html( $ap_row[1] ) . '</td></tr>';
}
?>
<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Otevírací doba</h3>
<!-- /wp:heading -->

<!-- wp:table {"hasFixedLayout":false,"className":"hours"} -->
<figure class="wp-block-table hours"><table><tbody><?php echo $ap_rows; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escapováno výše. ?></tbody></table></figure>
<!-- /wp:table -->

<!-- wp:paragraph {"className":"note"} -->
<p class="note">V sezóně přezouvání (duben, říjen až listopad) se vyplatí zavolat předem.</p>
<!-- /wp:paragraph -->
