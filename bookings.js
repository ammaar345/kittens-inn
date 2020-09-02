module.exports = function() {

	const pg = require("pg");
	const Pool = pg.Pool;
	const connectionString = process.env.DATABASE_URL || 'postgresql://coder:pg123@localhost:5432/kitten_inn';
	const pool = new Pool({
		connectionString
	});

	async function addBooking(params) {

		const INSERT_QUERY = "insert into booking (name, staying_for, arriving_on) values ($1, $2, $3)";
		await pool.query(INSERT_QUERY, [params.name, params.days, params.arrivingOn]);

	}

	async function getBookings() {
		const kittens = await pool.query(`select id, name, 
			staying_for as days, 
			arriving_on as "arrivingOn" from booking`);

		return kittens.rows;
	}

	async function filterBookings (criteria){
		if (criteria === "three") {
			const LESS_OR_EQL_THAN_3 = `
				select id, name, staying_for as days, 
						arriving_on as "arrivingOn" 
				from booking 
					where staying_for <= 3`;
	
			const result = await pool.query(LESS_OR_EQL_THAN_3);
			return result.rows;
	
		} else if (criteria === "more") {
			const MORE_THAN_3 = `
				select id, name, staying_for as days, 
						arriving_on as "arrivingOn" 
				from booking 
					where staying_for > 3`;
	
			const result = await pool.query(MORE_THAN_3);
			return result.rows;
		}  else {
			return getBookings();
		}
	}

	return  {
		addBooking,
		getBookings,
		filterBookings
	}
}