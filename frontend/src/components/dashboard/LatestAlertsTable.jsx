export default function LatestAlertsTable({ alerts }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Alertas abiertas</h2>
        <p>Eventos recientes que requieren revisión.</p>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Sensor</th>
              <th>Zona</th>
              <th>Nivel</th>
              <th>Mensaje</th>
              <th>Fecha</th>
            </tr>
          </thead>

          <tbody>
            {alerts.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-cell">
                  No hay alertas abiertas.
                </td>
              </tr>
            ) : (
              alerts.map((alert) => (
                <tr key={alert.id}>
                  <td>
                    <strong>{alert.sensorCode}</strong>
                    <span>{alert.sensorName}</span>
                  </td>
                  <td>{alert.zoneName}</td>
                  <td>
                    <span className="badge warning">{alert.level}</span>
                  </td>
                  <td>{alert.message}</td>
                  <td>{formatDate(alert.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function formatDate(value) {
  if (!value) return "Sin fecha";
  return new Date(value).toLocaleString();
}