const connection = require('../database/connection');

module.exports = {
	async index(request, response) {
		const { page = 1 } = request.query;

		const [count] = await connection('incidents').count();
		// count = { 'count(*)': 10 }

		const incidents = await connection('incidents')
			.join('ongs', 'ongs.id', '=', 'incidents.ong_id')
			.limit(5)
			.offset((page - 1) * 5) // Quantidade de páginas que vai pular
			.select([
				'incidents.*',
				'ongs.name',
				'ongs.email',
				'ongs.whatsapp',
				'ongs.city',
				'ongs.uf'
			]);

		response.header('X-Total-Count', count['count(*)']);

		return response.json(incidents);
	},

	async create(request, response) {
		const { title, description, value } = request.body;
		const ong_id = request.headers.authorization;

		const [id] = await connection('incidents').insert({
			title, description, value, ong_id
		});

		return response.json({ id });
	},

	async delete(request, response) {
		const { id } = request.params;
		const ong_id = request.headers.authorization;

		const incident = await connection('incidents')
			.where('id', id)
			.select('ong_id')
			.first();

		if (incident.ong_id !== ong_id) {
			// 401 não autorizado
			return response.status(401).json({ error: 'Operation not permitted.' });
		}

		await connection('incidents').where('id', id).delete();

		// 204 Resposta com sucesso mas não tem conteúdo para retornar
		return response.status(204).send();
	}
}