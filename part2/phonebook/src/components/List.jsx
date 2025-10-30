import PersonList from "./PersonList";

const List = (props) => {
  return (
    <>
      {props.personsToShow.map((person) => (
        <PersonList
          key={person.id}
          onClick={() => props.onClick(person.id)}
          person={person}
        />
      ))}
    </>
  );
};

export default List;
