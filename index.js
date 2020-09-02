const express = require("express");

const exphbs = require("express-handlebars");
const bodyParser = require("body-parser"); 	// add this line
const app = express();
const pg = require("pg");
const Pool = pg.Pool;
const connectionString = process.env.DATABASE_URL || 'postgresql://codex:pg123@localhost:3009/kitten_inn';

const pool = new Pool({
    connectionString
  });
  async function queryDB() {
	
	const param1 = "value";

	let results = await pool.query('select field1, field2 from your_table where id = $1', [param1]);
	
	return results;

}
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false })); // add this line
app.use(bodyParser.json()); // add  this line

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

const kittens = [

];

// after you added  this  restart the app
app.get("/", function (req, res) {
	res.render("index", { kittens });
});



app.post("/filter", function (req, res) {

	const daysFilter = req.body.daysFilter;

	let filteredData = kittens;
	if (daysFilter === "three") {
		filteredData = kittens.filter(function(kitten) {
			return kitten.days <= 3;
		});
	} else if (daysFilter === "more") {
		filteredData = kittens.filter(function(kitten) {
			return kitten.days > 3;
		});
	}

	res.render("index", { kittens : filteredData	 });
});

app.post("/booking", function (req, res) {

	const days = req.body.days && Number(req.body.days);
	const name = req.body.name;
	const arrivingOn = req.body.day;

	if (days && name && arrivingOn) {
		kittens.push({
			id : kittens.length+1,
			days,
			name,
			arrivingOn
		});
		res.redirect("/");

	} else {

		function validate(value, result) {
			if (!value) {
				return result;
			}
			return {};
		}

		const daysInvalid = validate(days, {
			style: "is-invalid",
			message: "Enter a valid day"
		});

		const kittenNameInvalid = validate(name, {
				style: "is-invalid",
				message: "Enter a valid day"
			});

		const arrivingOnInvalid = validate(arrivingOn, {
				style: "is-invalid",
				message: "Please select a arrival day"
			});


		res.render("index", {
			name,
			days,
			kittens,
			daysInvalid,
			arrivingOnInvalid,
			kittenNameInvalid
		});


	}




})

// app.post("/counter", function(req, res) {

// });

const PORT = process.env.PORT || 3009;

app.listen(PORT, function () {
	console.log("App started on port :" + PORT);
});