import { setNameAction, setFilesAction } from './Actions';

export const showFilesList = name => dispatch => {
	return fetch('http://localhost:3000/api/repos')
		.then(response => {
			return response.json();
		})
		.then(files => {
			const filteredFilesList = files.filter(file => {
				return file.id.toLowerCase().includes(name.toLowerCase());
			});
			dispatch(setFilesAction(filteredFilesList));
			dispatch(setNameAction(name));
		})
		.catch(err => console.log(err));
};

export const findFilesByName = name => dispatch => {
	return fetch('http://localhost:3000/api/repos/task-1/tree/dev/')
		.then(response => {
			console.log(response.json());
			return response.json();
		})
		.then(files => {
			const filteredFilesList = files.filter(file => {
				return file.id.toLowerCase().includes(name.toLowerCase());
			});
			dispatch(setFilesAction(filteredFilesList));
			dispatch(setNameAction(name));
		})
		.catch(err => console.log(err));
};
