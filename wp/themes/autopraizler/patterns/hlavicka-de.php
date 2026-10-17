<?php
/**
 * Title: Hlavička DE
 * Slug: autopraizler/hlavicka-de
 * Inserter: no
 *
 * Obsah části šablony "header-de" (menu: Pannenhilfe, Kontakt).
 *
 * @package AutoPraizler
 */

$ap_logo = esc_url( get_theme_file_uri( 'assets/img/autopraizler-logo.svg' ) );
$ap_home = esc_url( home_url( '/de/' ) );
?>
<!-- wp:group {"className":"site-header","layout":{"type":"constrained"}} -->
<div class="wp-block-group site-header">
	<!-- wp:group {"className":"site-header__inner","layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between","verticalAlignment":"center"}} -->
	<div class="wp-block-group site-header__inner">
		<!-- wp:image {"width":"230px","height":"auto","linkDestination":"custom","className":"brand"} -->
		<figure class="wp-block-image brand"><a href="<?php echo $ap_home; ?>"><img src="<?php echo $ap_logo; ?>" alt="AutoPraizler M.L." style="width:230px;height:auto"/></a></figure>
		<!-- /wp:image -->

		<!-- wp:group {"className":"site-header__nav","layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"center"}} -->
		<div class="wp-block-group site-header__nav">
			<!-- wp:navigation {"overlayMenu":"mobile","hasIcon":false,"overlayBackgroundColor":"paper","overlayTextColor":"black","className":"nav","layout":{"type":"flex","justifyContent":"right","flexWrap":"nowrap"}} -->
				<!-- wp:navigation-link {"label":"Pannenhilfe","url":"<?php echo esc_url( home_url( '/de/hilfe/' ) ); ?>","kind":"custom","className":"nav-sos"} /-->
				<!-- wp:navigation-link {"label":"Leistungen","url":"<?php echo esc_url( home_url( '/de/#leistungen' ) ); ?>","kind":"custom"} /-->
				<!-- wp:navigation-link {"label":"Kontakt","url":"<?php echo esc_url( home_url( '/de/kontakt/' ) ); ?>","kind":"custom"} /-->
			<!-- /wp:navigation -->

			<!-- wp:autopraizler/language-switcher /-->

			<!-- wp:buttons {"className":"header-phone"} -->
			<div class="wp-block-buttons header-phone">
				<!-- wp:button {"className":"btn-phone"} -->
				<div class="wp-block-button btn-phone"><a class="wp-block-button__link wp-element-button" href="tel:+420728920290">+420 728 920 290</a></div>
				<!-- /wp:button -->
			</div>
			<!-- /wp:buttons -->
		</div>
		<!-- /wp:group -->
	</div>
	<!-- /wp:group -->
</div>
<!-- /wp:group -->
