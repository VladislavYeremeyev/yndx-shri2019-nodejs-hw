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
					<div class="Grid-Row Grid-Row_border_b Grid.Grid_m-columns_12">
						<div class="Grid-File Grid-Fraction Grid-Fraction_m-col_2">
							<div class="FileIcon FileIcon_type_folder"></div>
							<div class="Grid-FileName Grid-FileName_text_bold">${file}</div>
						<div class="Grid-CommitHash Grid-Fraction Grid-Fraction_m-col_2">
							<a href="#" class="Link Link_color_blue>adasdasdasd</div>
							<div class="Grid-CommitInfo">KEK</div>
						</div>
						<div class="Grid-CommitMessage Grid-Fraction Grid-Fraction_m-col_4">
							KEK
						</div>
						<div class="Grid-Committer Grid-Fraction Grid-Fraction_m-col_2">
							<span class="AuthorSpan">author</span>
						</div>
						<div class="Grid-UpdateDate Grid-Fraction Grid-Fraction Grid-Fraction_m-col_2 Grid-Fraction_text-align_right> date
						</div>
					</div>
					`;
			})
			.join('');

		return filesList ? filesList : '';
	}
}

export default FolderView;
