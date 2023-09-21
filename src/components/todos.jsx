import React, { useState, useEffect } from 'react';
import './todos.css';
import { ref, onValue, push, set, remove } from 'firebase/database';
import { db } from '../firebase';

const TodoList = () => {
	const [todos, setTodos] = useState({});
	const [item, setItem] = useState('');
	const [isCreating, setIsCreating] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [search, setSearch] = useState('');

	useEffect(() => {
		const todosDbRef = ref(db, 'todos');
		return onValue(todosDbRef, (snapshot) => {
			const loadedTodos = snapshot.val() || {};

			setTodos(loadedTodos);
		});
	}, []);

	const newItem = () => {
		setIsCreating(true);
		const addTodosDbRef = ref(db, 'todos');
		push(addTodosDbRef, {
			name: item,
		})
			.then((response) => {
				console.log('Задача добавлена, ответ от сервера', response);
			})
			.finally(() => setIsCreating(false));
	};

	const deleteItem = (id) => {
		setIsDeleting(true);
		const deleteTodosDbRef = ref(db, `todos/${id}`);

		remove(deleteTodosDbRef)
			.then((response) => {
				console.log('Задача удалена, ответ от сервера', response);
			})
			.finally(() => setIsDeleting(false));
	};

	const editingItem = (id, newName) => {
		const editTodosDbRef = ref(db, `todos/${id}`);

		set(editTodosDbRef, {
			name: newName,
		}).then((response) => {
			console.log('Задача изменена, ответ от сервера', response);
		});
	};

	const keyPress = (e) => {
		const code = e.which;
		if (code === 13) {
			newItem();
		}
	};

	return (
		<div className="wrapper">
			<input
				type="text"
				placeholder="Search in the todos..."
				className="input_search"
				onChange={(e) => setSearch(e.target.value)}
			/>
			<input
				value={item}
				className="input"
				type="text"
				placeholder="Enter something..."
				onChange={(e) => setItem(e.target.value)}
				onKeyPress={(e) => keyPress(e)}
			/>
			<button disabled={isCreating} className="enter" onClick={newItem}>
				ENTER
			</button>
			{Object.entries(todos)
				.filter(([id, { name }]) => name.includes(search))
				.map(([id, { name }]) => (
					<div key={id}>
						<div className="item-todo">
							<button
								className="item-delete"
								disabled={isDeleting}
								onClick={() => {
									deleteItem(id);
								}}
							>
								X
							</button>
							<button
								className="item-edit"
								onClick={() => {
									const newName = prompt(
										'Введите новое название задачи',
									);
									if (newName) {
										editingItem(id, newName);
									}
								}}
							>
								изменить
							</button>
							<div>{name}</div>
						</div>
					</div>
				))}
		</div>
	);
};

export default TodoList;
