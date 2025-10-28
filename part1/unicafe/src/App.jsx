import { useState } from "react";

const Button = ({ onClick, text }) => {
  return <button onClick={onClick}>{text}</button>;
};

const Text = ({ text }) => {
  return <h1>{text}</h1>;
};

const Statistics = ({ good, neutral, bad, all, average, percentage }) => {
  if (!good && !neutral && !bad) {
    return <p>No feedback given</p>;
  }
  return (
    <>
      <table>
        <tbody>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="all" value={all} />
          <StatisticLine text="average" value={average} />
          <StatisticLine text="positive" value={percentage} />
        </tbody>
      </table>
    </>
  );
};

const StatisticLine = (props) => {
  return (
    <>
      <tr>
        <td>{props.text}</td>
        <td>
          {props.value}
          {props.text === "positive" ? "%" : ""}
        </td>
      </tr>
    </>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const all = good + neutral + bad;
  const average = (good * 1 + neutral * 0 + bad * -1) / all || 0;
  const percentage = (good * 100) / all || 0;

  const handleGoodClick = () => {
    setGood(good + 1);
  };

  const handleNeutralClick = () => {
    setNeutral(neutral + 1);
  };
  const handleBadClick = () => {
    setBad(bad + 1);
  };

  return (
    <>
      <Text text={"give feedback"} />
      <Button onClick={handleGoodClick} text="good" />
      <Button onClick={handleNeutralClick} text="neutral" />
      <Button onClick={handleBadClick} text="bad" />
      <br />
      <Text text={"statistics"}></Text>
      <Statistics
        good={good}
        neutral={neutral}
        bad={bad}
        all={all}
        average={average}
        percentage={percentage}
      />
    </>
  );
};

export default App;
