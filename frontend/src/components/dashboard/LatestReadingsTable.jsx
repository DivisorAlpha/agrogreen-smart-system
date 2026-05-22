export default function LatestReadingsTable({ readings }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Últimas lecturas</h2>
        <p>Registros recientes enviados por los sensores.</p>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Sensor</th>
              <th>Zona</th>
              <th>Tipo</th>
              <th>Valor</th>
              <th>Estado</th>
              <th>Fecha</th>
            </tr>
          </thead>

          <tbody>
            {readings.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-cell">
                  No hay lecturas registradas.
                </td>
              </tr>
            ) : (
              readings.map((reading) => (
                <tr key={reading.id}>
                  <td>
                    <strong>{reading.sensorCode}</strong>
                    <span>{reading.sensorName}</span>
                  </td>
                  <td>{reading.zoneName}</td>
                  <td>{reading.type}</td>
                  <td>
                    {reading.value} {reading.unit}
                  </td>
                  <td>
                    <span className={`badge ${reading.status === "VALID" ? "success" : "warning"}`}>
                      {reading.status}
                    </span>
                  </td>
                  <td>{formatDate(reading.readingDateTime)}</td>
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