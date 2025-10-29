const Form = (props) => {
  return (
    <form onSubmit={props.onSubmit}>
      <div>
        name:{" "}
        <input id="name" onChange={props.onChangeName} value={props.name} />
      </div>
      <div>
        number:{" "}
        <input
          type="tel"
          id="number"
          onChange={props.onChangeNumber}
          value={props.number}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default Form;
