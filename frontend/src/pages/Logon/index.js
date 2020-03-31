import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
// Link substitui a tag 'a' para que não haja necessidade de recarregar a página

import { FiLogIn } from 'react-icons/fi';

import api from '../../services/api';

import './styles.css';

import heroesImg from '../../assets/heroes.png';
import logoImg from '../../assets/logo.svg';

export default function Logon() {
	const [id, setId] = useState('');
	const history = useHistory();

	async function handleLogon(event) {
		event.preventDefault();

		try {
			const response = await api.post('sessions', { id });

			// Salvar no histórico do navegador
			localStorage.setItem('ongId', id);
			localStorage.setItem('ongName', response.data.name);
			history.push('/profile');
		} catch(err) {
			alert('Falha no login. Tente novamente');
		}
	}

	return (
		<div className="logon-container">
			<section className="form">
				<img src={logoImg} alt="Be The Hero"/>

				<form onSubmit={handleLogon}>
					<h1>Faça seu Logon</h1>

					<input
						placeholder="Sua ID"
						value={id}
						onChange={e => setId(e.target.value)}
					/>
					<button className="button" type="submit">Entrar</button>

					<Link className="back-link" to="/register">
						<FiLogIn size={16} color="#E02041" />
						Não tenho cadastro
					</Link>
				</form>
			</section>

			<img src={heroesImg} alt="Heroes"/>
		</div>
	);
}