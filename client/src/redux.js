import Store from './mini-redux/Store';
import Reducer from './mini-redux/Reducer';
import InputView from './mini-redux/InputView';
import FolderView from './mini-redux/FolderView';

document.addEventListener('DOMContentLoaded', function() {
	console.log('It works!');
	const store = new Store(Reducer);
	const inputEl = document.querySelector('.SearchInput');
	// const userEl = document.querySelector('.results');
	const tableEl = document.querySelector('.Grid-Content');
	new InputView(inputEl, store);
	// new UserView(userEl, store);
	new FolderView(tableEl, store);
});
