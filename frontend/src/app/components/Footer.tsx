export default function Footer() {
  return (
    <footer style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f5f5f5' }}>
      <p>&copy; {new Date().getFullYear()} LearnEnglish. All rights reserved.</p>
    </footer>
  );
}