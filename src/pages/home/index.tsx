import { useRef } from 'preact/hooks';

import preactLogo from '../../assets/preact.svg';
import './style.css';
import { xlsxToJson, createTemplateXlsx } from '../../utils/xlsx';

export default () => {
	const fileInputRef = useRef<HTMLInputElement>();

	const downloadI18nJsonZip = async () => {
		if(fileInputRef?.current) {
			await xlsxToJson(fileInputRef.current.files[0]);
		}
	}

	return (
		<div class='home'>
			<a href='https://preactjs.com' target='_blank'>
				<img src={preactLogo} alt='Preact logo' height='160' width='160' />
			</a>
			<h1>I18n json-xlsx Converter</h1>
			<div>
				<h2>Download xlsx template</h2>
				<button type='button' onClick={createTemplateXlsx}>Download xlsx template</button>
			</div>
			<div>
				<h2>Convert xlsx to json</h2>
			  <input ref={fileInputRef} type='file' />
				<button type='button' onClick={downloadI18nJsonZip}>Download json zip</button>
			</div>
		</div>
	);
};
