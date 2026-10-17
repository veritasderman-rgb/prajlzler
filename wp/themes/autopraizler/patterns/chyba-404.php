<?php
/**
 * Title: Stránka 404
 * Slug: autopraizler/chyba-404
 * Inserter: no
 *
 * Markup generuje inc/parts.php z údajů v inc/business.php.
 *
 * @package AutoPraizler
 */

echo ap_part_404( ap_current_language() ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- blokový markup, hodnoty escapuje generátor.
