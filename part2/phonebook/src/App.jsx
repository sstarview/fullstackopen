import { useState } from "react";
import Heading from "./components/Heading";
import SearchFilter from "./components/SearchFilter";
import Form from "./components/Form";
import List from "./components/List";

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456", id: 1 },
    { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", number: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
  ]);
  const [newPerson, setNewPerson] = useState({ name: "", number: "" });
  const [filterValue, setFilterValue] = useState("");

  const handleNameChange = (event) => {
    setNewPerson({
      ...newPerson,
      name: event.target.value,
    });
  };

  const handleNumberChange = (event) => {
    setNewPerson({
      ...newPerson,
      number: event.target.value,
    });
  };

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
  };

  const addPerson = (event) => {
    event.preventDefault();

    const exist = persons.find((person) => person.name === newPerson.name);
    if (exist) {
      alert(`${newPerson.name} is already added to phonebook`);
      return;
    }

    const personObject = {
      name: newPerson.name,
      number: newPerson.number,
      id: persons.length + 1,
    };
    setPersons(persons.concat(personObject));
    setNewPerson({ name: "", number: "" });
  };

  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(filterValue.toLowerCase())
  );

  return (
    <div>
      <Heading text={"Phonebook"} />
      <SearchFilter onChange={handleFilterChange} value={filterValue} />
      <Heading text={"add a new"} />
      <Form
        onSubmit={addPerson}
        name={newPerson.name}
        number={newPerson.number}
        onChangeName={handleNameChange}
        onChangeNumber={handleNumberChange}
      />
      <Heading text={"Numbers"} />
      <List personsToShow={personsToShow} />
    </div>
  );
};

export default App;
