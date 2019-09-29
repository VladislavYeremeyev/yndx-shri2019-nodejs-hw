import Store from './mini-redux/Store';
import Reducer from './mini-redux/Reducer';
import InputView from './mini-redux/InputView';
import FolderView from './mini-redux/FolderView';

document.addEventListener('DOMContentLoaded', function() {
	const store = new Store(Reducer);
	const inputElement = document.querySelector('.SearchInput');
	const filesTableContainer = document.querySelector('.Grid-Content');
	new InputView(inputElement, store);
	new FolderView(filesTableContainer, store);
});
