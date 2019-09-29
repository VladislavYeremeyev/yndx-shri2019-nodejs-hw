import View from './View';

import { findFilesByName } from './middleware';

class InputView extends View {
	constructor(el, store) {
		super(el, store);
		this._onInput = this._onInput.bind(this);
		this._el.addEventListener('input', this._onInput);
		store.dispatch(findFilesByName(''));
	}

	destroy() {
		super.destroy();
		this._onInput.removeEventListener('input', this._onInput);
	}

	_onInput(event) {
		clearTimeout(this._throttling);

		let store = this._store;
		this._throttling = setTimeout(function() {
			store.dispatch(findFilesByName(event.target.value));
		}, 500);
	}

	render() {
		return '';
	}
}

export default InputView;
