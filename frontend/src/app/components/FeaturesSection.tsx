export default function FeaturesSection() {
  return (
    <section style={{ padding: '2rem 1rem', backgroundColor: '#ffffff' }}>
      <h2 style={{ textAlign: 'center' }}>Our Features</h2>
      <ul style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', listStyle: 'none' }}>
        <li>
          <h3>Interactive Lessons</h3>
          <p>Engage in interactive lessons tailored to your level.</p>
        </li>
        <li>
          <h3>Expert Tutors</h3>
          <p>Learn from certified English teachers and tutors.</p>
        </li>
        <li>
          <h3>Flexible Schedule</h3>
          <p>Study at your convenience with on-demand classes.</p>
        </li>
      </ul>
    </section>
  );
}