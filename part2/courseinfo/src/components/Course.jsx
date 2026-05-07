const Header = ({ course }) => (
  <div>
    <h1>{course}</h1>
  </div>
)

const Part = ({ part }) => (
  <tr>
    <td>{part.name}</td>
    <td>{part.exercises}</td>
  </tr>
)

const Content = ({ parts }) => (
  <table>
    <tbody>
      {parts.map(part => (
        <Part key={part.id} part={part} />
      ))}
    </tbody>
  </table>
)

const Total = ({ parts }) => {

  const exercises = parts.map(part => part.exercises)

  const result = exercises.reduce((acc, ex) => acc + ex, 0)

  return (
    <h3>Total of {result} exercises</h3>
  )
}

const Course = ({ course }) => (
  <div>
    <Header course={course.name} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
  </div>
)

export default Course