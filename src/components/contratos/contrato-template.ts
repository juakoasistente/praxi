export function generarContratoHTML(data: {
  autoescuela_nombre: string
  autoescuela_cif: string
  autoescuela_direccion: string
  alumno_nombre: string
  alumno_dni: string
  permiso: string
  importe_matricula: number
  importe_clases: number
  total: number
  fecha: string
}): string {
  const fechaFormateada = new Date(data.fecha).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return `
<div style="font-family: serif; line-height: 1.6; color: #1a1a1a;">
  <h1 style="text-align: center; font-size: 18px; text-transform: uppercase; margin-bottom: 4px;">
    Contrato de Enseñanza de Conducción
  </h1>
  <p style="text-align: center; font-size: 13px; color: #666; margin-bottom: 24px;">
    Permiso clase ${data.permiso}
  </p>

  <h2 style="font-size: 14px; margin-bottom: 8px;">REUNIDOS</h2>
  <p style="font-size: 13px;">
    De una parte, <strong>${data.autoescuela_nombre}</strong>, con CIF <strong>${data.autoescuela_cif}</strong>,
    y domicilio social en ${data.autoescuela_direccion}, en adelante "LA AUTOESCUELA".
  </p>
  <p style="font-size: 13px;">
    De otra parte, <strong>${data.alumno_nombre}</strong>, con DNI <strong>${data.alumno_dni}</strong>,
    en adelante "EL/LA ALUMNO/A".
  </p>

  <h2 style="font-size: 14px; margin-top: 20px; margin-bottom: 8px;">CLÁUSULAS</h2>

  <p style="font-size: 13px;">
    <strong>PRIMERA. Objeto del contrato.</strong><br/>
    LA AUTOESCUELA se compromete a impartir al ALUMNO/A la formación teórica y práctica necesaria
    para la obtención del permiso de conducción clase <strong>${data.permiso}</strong>, conforme a la
    normativa vigente de la Dirección General de Tráfico (DGT).
  </p>

  <p style="font-size: 13px;">
    <strong>SEGUNDA. Precio y forma de pago.</strong><br/>
    El precio de los servicios contratados es el siguiente:<br/>
    — Matrícula: <strong>${data.importe_matricula.toFixed(2)} €</strong><br/>
    — Clases prácticas: <strong>${data.importe_clases.toFixed(2)} €</strong><br/>
    — <strong>Total: ${data.total.toFixed(2)} €</strong><br/>
    El pago se realizará según las condiciones acordadas entre las partes, pudiendo fraccionarse
    en los plazos que se establezcan. Las tasas de examen de la DGT no están incluidas en este importe.
  </p>

  <p style="font-size: 13px;">
    <strong>TERCERA. Obligaciones de la autoescuela.</strong><br/>
    LA AUTOESCUELA se obliga a:<br/>
    a) Proporcionar profesorado cualificado y habilitado por la DGT.<br/>
    b) Facilitar los medios materiales y vehículos necesarios para la formación práctica.<br/>
    c) Gestionar la tramitación del expediente ante la Jefatura Provincial de Tráfico.<br/>
    d) Programar las clases en horarios acordados con el alumno/a.
  </p>

  <p style="font-size: 13px;">
    <strong>CUARTA. Obligaciones del alumno/a.</strong><br/>
    EL/LA ALUMNO/A se obliga a:<br/>
    a) Asistir a las clases programadas con puntualidad.<br/>
    b) Comunicar las cancelaciones con un mínimo de 24 horas de antelación.<br/>
    c) Cumplir con los pagos en los plazos acordados.<br/>
    d) Aportar la documentación requerida para la tramitación del expediente.
  </p>

  <p style="font-size: 13px;">
    <strong>QUINTA. Cancelación y desistimiento.</strong><br/>
    El alumno/a podrá desistir del contrato en cualquier momento, debiendo abonar las cantidades
    correspondientes a los servicios ya prestados. En caso de baja voluntaria, la matrícula no será
    reembolsable. LA AUTOESCUELA se reserva el derecho a resolver el contrato por impago o
    incumplimiento reiterado del alumno/a.
  </p>

  <p style="font-size: 13px;">
    <strong>SEXTA. Protección de datos.</strong><br/>
    De conformidad con el Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD),
    los datos personales del alumno/a serán tratados con la finalidad exclusiva de gestionar la
    formación contratada y las obligaciones legales derivadas. El alumno/a podrá ejercer sus derechos
    de acceso, rectificación, supresión y portabilidad dirigiéndose a LA AUTOESCUELA.
  </p>

  <p style="font-size: 13px;">
    <strong>SÉPTIMA. Jurisdicción.</strong><br/>
    Para cualquier controversia derivada del presente contrato, ambas partes se someten a los
    juzgados y tribunales del domicilio de LA AUTOESCUELA.
  </p>

  <p style="font-size: 13px; margin-top: 24px;">
    Y en prueba de conformidad, ambas partes firman el presente contrato en ${fechaFormateada}.
  </p>
</div>
  `.trim()
}
