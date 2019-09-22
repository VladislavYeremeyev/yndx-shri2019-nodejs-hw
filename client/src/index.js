document.addEventListener('DOMContentLoaded', function() {
	const dropdowns = document.querySelectorAll('.DropdownBlock');

	dropdowns.forEach(block =>
		block.addEventListener('click', function(e) {
			// block.classList.toggle('DropdownBlock_opened');
			if (block.classList.contains('DropdownBlock_opened')) {
				document.body.style.overflow = 'initial';
				block.classList.remove('DropdownBlock_opened');
			} else {
				document.body.style.overflow = 'hidden';
				block.classList.add('DropdownBlock_opened');
			}
			Array.from(dropdowns)
				.filter(elem => elem !== block)
				.forEach(elem => {
					if (elem.classList.contains('DropdownBlock_opened')) {
						elem.classList.remove('DropdownBlock_opened');
					}
				});
			e.stopPropagation();
		})
	);

	window.addEventListener('click', function() {
		Array.from(dropdowns).forEach(elem => {
			if (elem.classList.contains('DropdownBlock_opened')) {
				elem.classList.remove('DropdownBlock_opened');
				document.body.style.overflow = 'initial';
			}
		});
	});

	const tabs = document.querySelectorAll('.TabMenu-Tab');

	tabs.forEach(tab =>
		tab.addEventListener('click', function() {
			let siblings = [...tab.parentElement.children].filter(c => c != tab);
			siblings.forEach(elem => {
				elem.classList.remove('TabMenu-Tab_active');
			});
			tab.classList.add('TabMenu-Tab_active');
		})
	);
});
