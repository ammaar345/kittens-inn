const express = require("express");

const exphbs = require("express-handlebars");
const bodyParser = require("body-parser"); 	// add this line

const Bookings  = require("./bookings");
const bookings = Bookings();

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false })); // add this line
app.use(bodyParser.json()); // add  this line

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// after you added  this  restart the app
app.get("/", async function (req, res) {

	const kittens = await bookings.getBookings();

	res.render("index", { kittens });

});

app.get("/api/bookings", async function (req, res) {

	const kittens = await bookings.getBookings();

	res.send(kittens);

});

app.post("/filter", async function (req, res) {

	const daysFilter = req.body.daysFilter;
	let filteredData = await bookings.filterBookings(daysFilter);
	res.render("index", { kittens : filteredData});

});

app.post("/booking", async function (req, res) {

	const days = req.body.days && Number(req.body.days);
	const name = req.body.name;
	const arrivingOn = req.body.day;

	if (days && name && arrivingOn) {

		await bookings.addBooking({
			days,
			name,
			arrivingOn
		})
		
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
		
		const kittens = await bookings.getBookings();


		res.render("index", {
			name,
			days,
			kittens,
			daysInvalid,
			arrivingOnInvalid,
			kittenNameInvalid
		});


	}
});

const PORT = process.env.PORT || 3009;

app.listen(PORT, function () {
	console.log("App started on port :" + PORT);
});