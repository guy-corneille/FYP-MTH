// frontend/src/components/EvaluationSummary.jsx
const EvaluationSummary = ({ facilityId }) => {
  const [evaluations, setEvaluations] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/evaluations/?facility=${facilityId}`)
      .then(res => setEvaluations(res.data));
  }, [facilityId]);

  return (
    <table>
      <thead>
        <tr>
          <th>Criteria</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        {evaluations.map(eval => (
          Object.entries(eval.criteria_scores).map(([criteriaId, score]) => (
            <tr key={criteriaId}>
              <td>{criteriaId}</td>
              <td>{score}</td>
            </tr>
          ))
        ))}
      </tbody>
    </table>
  );
};