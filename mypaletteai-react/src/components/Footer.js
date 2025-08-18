import footerCss from './global/Footer.module.css';

function Footer() {

	return (
		<div className={footerCss.footerBox}>
			<h3 className={footerCss.text}>
				Copyright 2025. My Palette AI All rights reserved.{' '}
			</h3>
		</div>
	)

}

export default Footer;