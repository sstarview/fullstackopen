const PersonList = (props) => {
  return (
    <div>
      {props.person.name} {props.person.number}
      <button onClick={props.onClick}>delete</button>
    </div>
  );
};

export default PersonList;
