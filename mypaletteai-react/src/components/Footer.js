import footerCss from './global/Footer.module.css';

function Footer() {

	return (
		<div className={footerCss.footerBox}>
			<h4 className={footerCss.text}>
				Copyright 2025. My Palette AI All rights reserved.{' '}
			</h4>
		</div>
	)

}

export default Footer;