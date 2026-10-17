<?php
/**
 * AutoPraizler – child theme Twenty Twenty-Five.
 *
 * Vše vlastní je rozdělené do inc/*.php. Prefixy: autopraizler_ (nastavení
 * šablony) a ap_ (pomocné funkce, meta, bloky).
 *
 * @package AutoPraizler
 */

declare( strict_types=1 );

defined( 'ABSPATH' ) || exit;

require_once __DIR__ . '/inc/setup.php';        // styly, vzory, styly bloků, vazby bloků
require_once __DIR__ . '/inc/locale.php';       // přepnutí locale pro /de/ a /en/
require_once __DIR__ . '/inc/translations.php'; // propojení překladů, hreflang, blok přepínače
require_once __DIR__ . '/inc/schema.php';       // schema.org AutoRepair
require_once __DIR__ . '/inc/admin.php';        // metabox překladů, menu pro editora, noindex karty
require_once __DIR__ . '/inc/svg.php';          // SVG upload pro administrátora
