export default function SummaryCard({ title, value, description, icon }) {
  return (
    <article className="summary-card">
      <div className="summary-card-header">
        <span className="summary-card-icon">{icon}</span>
      </div>

      <div>
        <p className="summary-card-title">{title}</p>
        <h2 className="summary-card-value">{value}</h2>
        <p className="summary-card-description">{description}</p>
      </div>
    </article>
  );
}