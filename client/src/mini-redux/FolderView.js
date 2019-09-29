import View from './View';

class FolderView extends View {
	constructor(el, store) {
		super(el, store);
	}

	destroy() {
		super.destroy();
	}

	render({ files }) {
		const filesList = files
			.map(file => {
				return `
					<div class="Grid-Row Grid-Row_border_b Grid Grid_m-columns_12">
						<div class="Grid-File Grid-Fraction Grid-Fraction_m-col_2">
							<div class="FileIcon FileIcon_type_folder">
								<svg width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M10.875 1.5H6.375L4.875 0H1.125C0.492188 0 0 0.515625 0 1.125V7.875C0 8.50781 0.492188 9 1.125 9H10.875C11.4844 9 12 8.50781 12 7.875V2.625C12 2.01562 11.4844 1.5 10.875 1.5Z" fill="black"/>
								</svg>
							</div>
							<div class="Grid-FileName Grid-FileName_text_bold">${file}</div>
						</div>
						<div class="Grid-CommitHash Grid-Fraction Grid-Fraction_m-col_2">
							<a href="#" class="Link Link_color_blue">d53dsv</a>
							<div class="Grid-CommitInfo">by Alexey Besedin, 4 s ago</div>
						</div>
						<div class="Grid-CommitMessage Grid-Fraction Grid-Fraction_m-col_4">[vcs] move http to arc</div>
						<div class="Grid-Committer Grid-Fraction Grid-Fraction_m-col_2">
							<span class="AuthorSpan">author</span>
						</div>
						<div class="Grid-UpdateDate Grid-Fraction Grid-Fraction Grid-Fraction_m-col_2 Grid-Fraction_text-align_right">4 s ago</div>
					</div>
					`;
			})
			.join('');

		return filesList ? filesList : '';
	}
}

export default FolderView;
