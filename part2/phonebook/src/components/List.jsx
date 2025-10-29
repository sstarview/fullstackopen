import PersonList from "./PersonList";

const List = (props) => {
  return (
    <>
      {props.personsToShow.map((person) => (
        <PersonList key={person.id} person={person} />
      ))}
    </>
  );
};

export default List;
