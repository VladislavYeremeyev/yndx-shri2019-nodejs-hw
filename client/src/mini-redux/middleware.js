import { setNameAction, setFilesAction } from './Actions';
import data from './filesData';

export const findFilesByName = name => dispatch => {
	// return fetch('http://localhost:3000/api/repos/task-1/tree/dev/')
	// 	.then(response => response.json())
	// 	.then(files => {
	// 		const filteredFilesList = files.data.filter(file => {
	// 			return file.toLowerCase().includes(name.toLowerCase());
	// 		});
	// 		dispatch(setFilesAction(filteredFilesList));
	// 		dispatch(setNameAction(name));
	// 	})
	// 	.catch(err => console.log(err));

	const filteredFilesList = data.filter(file => {
		return file.name.toLowerCase().includes(name.toLowerCase());
	}).map(file => file.name);
	dispatch(setFilesAction(filteredFilesList));
	dispatch(setNameAction(name));
};
