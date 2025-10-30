import { useState, useEffect } from "react";
import Heading from "./components/Heading";
import SearchFilter from "./components/SearchFilter";
import Form from "./components/Form";
import List from "./components/List";
import personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newPerson, setNewPerson] = useState({ name: "", number: "" });
  const [filterValue, setFilterValue] = useState("");

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

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

    const existingPerson = persons.find(
      (person) => person.name.toLowerCase() === newPerson.name.toLowerCase()
    );
    if (existingPerson) {
      const confirm = window.confirm(
        `${existingPerson.name} is already added to phonebook, replace the old number with a new one?`
      );
      if (confirm) {
        const changedPerson = { ...existingPerson, number: newPerson.number };
        personService
          .update(existingPerson.id, changedPerson)
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id === existingPerson.id ? returnedPerson : person
              )
            );
            setNewPerson({ name: "", number: "" });
          });
      }
      return;
    }

    const personObject = {
      name: newPerson.name,
      number: newPerson.number,
    };
    personService.create(personObject).then((returnedPerson) => {
      setPersons(persons.concat(returnedPerson));
      setNewPerson({ name: "", number: "" });
    });
  };

  const deletePerson = (id) => {
    const person = persons.find((person) => person.id === id);
    const confirm = window.confirm(`Delete ${person.name}?`);
    if (confirm) {
      personService.destroy(id).then(() => {
        setPersons(persons.filter((person) => person.id !== id));
      });
    }
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
      <List onClick={deletePerson} personsToShow={personsToShow} />
    </div>
  );
};

export default App;
