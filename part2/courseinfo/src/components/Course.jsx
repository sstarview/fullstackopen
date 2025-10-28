import Header from "./Header";
import Content from "./Content";
import Total from "./Total";

const Course = ({ courses }) => {
  return (
    <>
      {courses.map((course) => {
        const total = course.parts.reduce((a, c) => a + c.exercises, 0);
        return (
          <div key={course.id}>
            <Header course={course.name} />
            <Content parts={course.parts} />
            <Total total={total} />
          </div>
        );
      })}
    </>
  );
};

export default Course;
