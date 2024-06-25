/* eslint-disable react/prop-types */
import {
  Page,
  Image,
  Text,
  View,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";
import encabezado from "../assets/encabezadoPDF.png";

const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  // Formateamos el mes y el día para asegurarnos de que tienen dos dígitos
  const formattedMonth = month.toString().padStart(2, "0");
  const formattedDay = day.toString().padStart(2, "0");

  return `${year}-${formattedMonth}-${formattedDay}`;
};
// Estilos para el documento PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "white",
    padding: 30,
  },
  section: {
    marginBottom: 10,
    padding: 10,
    borderBottom: "1px solid #000",
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "50%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#bdbdbd",
    padding: 5,
  },
  tableCol: {
    width: "50%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    padding: 5,
  },
  tableCell: {
    margin: 5,
    fontSize: 10,
  },
  header: {
    fontSize: 11,
    marginBottom: 10,
    textAlign: "center",
  },
  tituloFila: {
    flexDirection: "row",
    marginBottom: 5,
  },
  subtitulos: {
    fontSize: 11,
    fontWeight: "bold",
  },
  text: {
    fontSize: 11,
  },
  firma: {
    fontSize: 11,
    fontWeight: "bold",
    textAlign: "center",
  },
  firmaContainer: {
    marginTop: 40,
  },
});



const PDFAnexo11 = ({ estudiante,fecha_informe_100, nombreDocente, actividades = [] }) => {
  const groupActivitiesByMonth = (activities) => {
    const grouped = activities.reduce((acc, activity) => {
      let date = new Date(activity.fecha_actividad);

      date.setDate(date.getDate() + 1); // Sumar un día para corregir el problema
      const month = date.getMonth() + 1; // Los meses en JavaScript son 0-indexados, así que añadimos 1
      const year = date.getFullYear();
      const key = `${month < 10 ? "0" + month : month}-${year}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(activity);
      return acc;
    }, {});

    return Object.keys(grouped).map((key, index, array) => {
      const activitiesInMonth = grouped[key];
      const [month, year] = key.split("-");
      const firstDay = index === 0 ? new Date(estudiante.titulacion.fecha_aprobacion).getDate()+1 : 1;
      const lastDay = index === array.length - 1 ? new Date(fecha_informe_100).getDate() : new Date(year, month, 0).getDate(); // Obtener el último día del mes actual correctamente o la fecha de informe
      const dateRange = `Del ${firstDay} al ${lastDay} de ${new Date(
        year,
        month - 1
      ).toLocaleString("default", { month: "long", year: "numeric" })}`;

      const activityDescriptions = activitiesInMonth
        .map((a) => "• " + a.descripcion)
        .join("\n");

      return { key, dateRange, activityDescriptions };
    });
  };

  const groupedActivities = groupActivitiesByMonth(actividades);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Image src={encabezado} />
        <View style={styles.section}>
          <Text style={styles.header}>Anexo 11</Text>
          <Text style={styles.header}>
            INFORME FINAL DEL AVANCE DEL TRABAJO DE TITULACIÓN
          </Text>
          <Text style={styles.header}>
            FACULTAD DE INGENIERÍA EN SISTEMAS, ELECTRÓNICA E INDUSTRIAL CARRERA
            DE TECNOLOGÍAS DE LA INFORMACIÓN
          </Text>
          <View style={styles.tituloFila}>
            <Text style={styles.subtitulos}>FECHA: </Text>
            <Text style={styles.text}>{getCurrentDate()}</Text>
          </View>
          <View style={styles.tituloFila}>
            <Text style={styles.subtitulos}>NOMBRE DEL ESTUDIANTE: </Text>
            <Text
              style={styles.text}
            >{`${estudiante.persona.nombre} ${estudiante.persona.apellido}`}</Text>
          </View>
          <View style={styles.tituloFila}>
            <Text style={styles.subtitulos}>MODALIDAD DE TITULACIÓN: </Text>
            <Text style={styles.text}>PROYECTO DE INVESTIGACIÓN</Text>
          </View>
          <View style={styles.tituloFila}>
            <Text style={styles.subtitulos}>
              TEMA DEL TRABAJO DE TITULACIÓN:{" "}
            </Text>
            <Text style={styles.text}>{estudiante.titulacion.tema}</Text>
          </View>
          <View>
            <Text style={styles.subtitulos}>
              FECHA DE APROBACIÓN DE LA PROPUESTA DEL PERFIL DEL TRABAJO DE
              TITULACIÓN POR EL CONSEJO DIRECTIVO:{" "}
            </Text>
            <Text style={styles.text}>
              {estudiante.titulacion.fecha_aprobacion}
            </Text>
          </View>
          <View style={styles.tituloFila}>
            <Text style={styles.subtitulos}>
              PORCENTAJE DE AVANCE DE ACUERDO AL CRONOGRAMA:{" "}
            </Text>
            <Text style={styles.text}>100%</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.header}>Actividades:</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCell}>Fecha</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCell}>Actividad</Text>
              </View>
            </View>
            {groupedActivities.map((group, index) => (
              <View style={styles.tableRow} key={index} wrap={false}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{group.dateRange}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {group.activityDescriptions}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.firmaContainer}>
          <Text style={styles.firma}>_____________________________</Text>
          <Text style={styles.firma}>ING. {nombreDocente} </Text>
          <Text style={styles.firma}>TUTOR TRABAJO TITULACIÓN </Text>
        </View>
      </Page>
    </Document>
  );
};

export default PDFAnexo11;
