import React, { useState, useEffect } from 'react';
import './todos.css';

const TodoList = () => {
	const [todos, setTodos] = useState([]);
	const [item, setItem] = useState('');
	const [refreshTodosFlag, setRefreshTodosFlag] = useState(false);
	const [isCreating, setIsCreating] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [search, setSearch] = useState('');

	const refreshTodos = () => setRefreshTodosFlag(!refreshTodosFlag);

	useEffect(() => {
		fetch('http://localhost:2970/todos')
			.then((response) => response.json())
			.then((responseTodos) => {
				setTodos(responseTodos);
			});
	}, [refreshTodosFlag]);

	const newItem = () => {
		setIsCreating(true);
		fetch('http://localhost:2970/todos', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json;charset=utf-8' },
			body: JSON.stringify({
				name: item,
			}),
		})
			.then((rawResponse) => rawResponse.json())
			.then((response) => {
				console.log('Задача добавлена, ответ от сервера', response);
				refreshTodos();
			})
			.finally(() => setIsCreating(false));
	};

	const deleteItem = (id) => {
		setIsDeleting(true);
		fetch(`http://localhost:2970/todos/${id}`, {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json;charset=utf-8' },
		})
			.then((rawResponse) => rawResponse.json())
			.then((response) => {
				console.log('Задача удалена, ответ от сервера', response);
				refreshTodos();
			})
			.finally(() => setIsDeleting(false));
	};

	const editingItem = (id, newName) => {
		fetch(`http://localhost:2970/todos/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json;charset=utf-8' },
			body: JSON.stringify({
				name: newName,
			}),
		})
			.then((rawResponse) => rawResponse.json())
			.then((response) => {
				console.log('Задача изменена, ответ от сервера', response);
				refreshTodos();
			});
	};

	const keyPress = (e) => {
		const code = e.which;
		if (code === 13) {
			newItem();
		}
	};

	const filteredTodos = todos.filter((todo) => {
		return todo.name.toLowerCase().includes(search.toLowerCase());
	});

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
			{filteredTodos.map(({ id, name }) => (
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
								const newName = prompt('Введите новое название задачи');
								if (newName) {
									editingItem(id, newName);
								}
							}}
						>
							изменить
						</button>
						<div>
							{id}. {name}
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default TodoList;
