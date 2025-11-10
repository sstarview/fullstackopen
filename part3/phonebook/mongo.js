const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("At least password is required");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://salman123:${password}@cluster0.nhqfl8u.mongodb.net/phonebookApp?appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });

  person.save().then((result) => {
    console.log(`added ${result.name} number ${result.number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  Person.find({}).then((results) => {
    console.log("phonebook:");
    results.forEach((person) => {
      console.log(person.name, person.number);
    });
    mongoose.connection.close();
  });
}
