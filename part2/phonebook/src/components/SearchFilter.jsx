const SearchFilter = ({ onChange, value }) => {
  return (
    <div>
      filter shown with <input id="filter" onChange={onChange} value={value} />
    </div>
  );
};

export default SearchFilter;
