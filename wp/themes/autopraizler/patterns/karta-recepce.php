<?php
/**
 * Title: Karta pro recepce (tisk)
 * Slug: autopraizler/karta-recepce
 * Categories: autopraizler
 * Description: Obsah stránky Karta pro recepce: úvod s tlačítkem Vytisknout (netiskne se) a karta A5 na šířku s logem, telefonem a dvěma QR kódy. Použijte se šablonou „Karta pro recepce (tisk)“.
 * Keywords: karta, recepce, tisk, QR
 * Viewport Width: 900
 *
 * Telefon, adresa a otevírací doba z inc/business.php.
 *
 * @package AutoPraizler
 */

$ap_b        = ap_business_data();
$ap_logo     = esc_url( get_theme_file_uri( 'assets/img/autopraizler-logo.svg' ) );
$ap_qr_tel   = esc_url( get_theme_file_uri( 'assets/img/qr-tel.svg' ) );
$ap_qr_hilfe = esc_url( get_theme_file_uri( 'assets/img/qr-hilfe.svg' ) );
$ap_addr     = $ap_b['name'] . ' · ' . $ap_b['street'] . ', ' . $ap_b['city'] . ' (u nádraží / am Bahnhof / near the railway station) · ' . ap_hours_compact( 'de' ) . ' · WhatsApp';
?>
<!-- wp:group {"align":"full","className":"no-print","backgroundColor":"sand","style":{"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|60"}}},"layout":{"type":"constrained","contentSize":"780px"}} -->
<div class="wp-block-group alignfull no-print has-sand-background-color has-background" style="padding-top:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60)">
	<!-- wp:paragraph {"className":"eyebrow"} -->
	<p class="eyebrow">Pro hotely a penziony</p>
	<!-- /wp:paragraph -->

	<!-- wp:heading {"level":1} -->
	<h1 class="wp-block-heading">Karta pro recepce</h1>
	<!-- /wp:heading -->

	<!-- wp:paragraph {"className":"lead"} -->
	<p class="lead">Vytiskněte na A5 (na šířku), zalaminujte a nechte na recepci. Host s problémem naskenuje QR kód a má telefon nebo informace ve svém jazyce.</p>
	<!-- /wp:paragraph -->

	<!-- wp:buttons -->
	<div class="wp-block-buttons">
		<!-- wp:button {"className":"ap-print"} -->
		<div class="wp-block-button ap-print"><a class="wp-block-button__link wp-element-button" href="#tisk">Vytisknout</a></div>
		<!-- /wp:button -->

		<!-- wp:button {"className":"is-style-outline"} -->
		<div class="wp-block-button is-style-outline"><a class="wp-block-button__link wp-element-button" href="<?php echo esc_url( home_url( '/pomoc-v-nouzi/' ) ); ?>">Zpět na Pomoc v nouzi</a></div>
		<!-- /wp:button -->
	</div>
	<!-- /wp:buttons -->
</div>
<!-- /wp:group -->

<!-- wp:group {"className":"card-wrap","style":{"spacing":{"padding":{"top":"32px","bottom":"32px"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group card-wrap" style="padding-top:32px;padding-bottom:32px">
	<!-- wp:group {"className":"print-card","style":{"spacing":{"blockGap":"0"}},"layout":{"type":"default"}} -->
	<div class="wp-block-group print-card">
		<!-- wp:group {"className":"print-card__top","gradient":"orange","layout":{"type":"default"}} -->
		<div class="wp-block-group print-card__top has-orange-gradient-background has-background">
			<!-- wp:image {"className":"print-card__logo"} -->
			<figure class="wp-block-image print-card__logo"><img src="<?php echo $ap_logo; ?>" alt="<?php echo esc_attr( $ap_b['name'] ); ?>"/></figure>
			<!-- /wp:image -->
		</div>
		<!-- /wp:group -->

		<!-- wp:columns {"verticalAlignment":"center","isStackedOnMobile":false,"className":"print-card__body"} -->
		<div class="wp-block-columns are-vertically-aligned-center is-not-stacked-on-mobile print-card__body">
			<!-- wp:column {"verticalAlignment":"center"} -->
			<div class="wp-block-column is-vertically-aligned-center">
				<!-- wp:heading -->
				<h2 class="wp-block-heading">Autopanne? Car trouble? Porucha auta?</h2>
				<!-- /wp:heading -->

				<!-- wp:paragraph {"className":"line"} -->
				<p class="line"><strong>DE</strong> Rufen Sie an, wir helfen Ihnen schnell. Wir sprechen Deutsch.</p>
				<!-- /wp:paragraph -->

				<!-- wp:paragraph {"className":"line"} -->
				<p class="line"><strong>EN</strong> Call us, we will help you quickly. We speak English.</p>
				<!-- /wp:paragraph -->

				<!-- wp:paragraph {"className":"line"} -->
				<p class="line"><strong>CZ</strong> Zavolejte, pomůžeme rychle. Autoservis a pneuservis.</p>
				<!-- /wp:paragraph -->

				<!-- wp:paragraph {"className":"tel"} -->
				<p class="tel"><a href="<?php echo esc_url( $ap_b['phone_url'] ); ?>"><?php echo esc_html( $ap_b['phone_display'] ); ?></a></p>
				<!-- /wp:paragraph -->

				<!-- wp:paragraph {"className":"addr"} -->
				<p class="addr"><?php echo esc_html( $ap_addr ); ?></p>
				<!-- /wp:paragraph -->
			</div>
			<!-- /wp:column -->

			<!-- wp:column {"verticalAlignment":"center","width":"34mm","className":"qrs"} -->
			<div class="wp-block-column is-vertically-aligned-center qrs" style="flex-basis:34mm">
				<!-- wp:image -->
				<figure class="wp-block-image"><img src="<?php echo $ap_qr_tel; ?>" alt="<?php echo esc_attr( 'QR kód: zavolat ' . $ap_b['phone_display'] ); ?>"/><figcaption class="wp-element-caption">Anrufen · Call</figcaption></figure>
				<!-- /wp:image -->

				<!-- wp:image -->
				<figure class="wp-block-image"><img src="<?php echo $ap_qr_hilfe; ?>" alt="QR kód: autopraizler.cz/de/hilfe/"/><figcaption class="wp-element-caption">Info DE · EN</figcaption></figure>
				<!-- /wp:image -->
			</div>
			<!-- /wp:column -->
		</div>
		<!-- /wp:columns -->
	</div>
	<!-- /wp:group -->
</div>
<!-- /wp:group -->
