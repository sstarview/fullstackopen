const PersonList = (props) => {
  return (
    <div>
      {props.person.name} {props.person.number}
    </div>
  );
};

export default PersonList;
