import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
	apiKey: 'AIzaSyBpwM1-uCELkZF5708R3pjn_dfDDo-iNfU',
	authDomain: 'todo-list-37999.firebaseapp.com',
	projectId: 'todo-list-37999',
	storageBucket: 'todo-list-37999.appspot.com',
	messagingSenderId: '898845843576',
	appId: '1:898845843576:web:6bdcd600a8ee7091660d8d',
	databaseURL:
		'https://todo-list-37999-default-rtdb.europe-west1.firebasedatabase.app/',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
