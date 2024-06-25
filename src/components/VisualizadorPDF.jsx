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

const VisualizadorPDF = ({
    nombreEstudiante,
    fechaAprobacion,
    tema,
    fechaCreacion,
    avance,
    actividades,
    anexo,
    nombreDocente,
}) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Image src={encabezado} />
            <View style={styles.section}>
                <Text style={styles.header}>Anexo {anexo}</Text>
                <Text style={styles.header}>
                    FACULTAD DE INGENIERÍA EN SISTEMAS, ELECTRÓNICA E INDUSTRIAL
                    CARRERA DE TECNOLOGÍAS DE LA INFORMACIÓN
                </Text>
                <Text style={styles.header}>
                    INFORME MENSUAL DEL AVANCE DEL TRABAJO DE TITULACIÓN{" "}
                </Text>
                <View style={styles.tituloFila}>
                    <Text style={styles.subtitulos}>FECHA: </Text>
                    <Text style={styles.text}>{fechaCreacion}</Text>
                </View>
                <View style={styles.tituloFila}>
                    <Text style={styles.subtitulos}>
                        NOMBRE DEL ESTUDIANTE:{" "}
                    </Text>
                    <Text style={styles.text}>{nombreEstudiante}</Text>
                </View>
                <View style={styles.tituloFila}>
                    <Text style={styles.subtitulos}>
                        MODALIDAD DE TITULACIÓN:{" "}
                    </Text>
                    <Text style={styles.text}>PROYECTO DE INVESTIGACIÓN</Text>
                </View>
                <View style={styles.tituloFila}>
                    <Text style={styles.subtitulos}>
                        TEMA DEL TRABAJO DE TITULACIÓN:{" "}
                    </Text>
                    <Text style={styles.text}>{tema}</Text>
                </View>
                <View>
                    <Text style={styles.subtitulos}>
                        FECHA DE APROBACIÓN DE LA PROPUESTA DEL PERFIL DEL
                        TRABAJO DE TITULACIÓN POR EL CONSEJO DIRECTIVO:{" "}
                    </Text>
                    <Text style={styles.text}>{fechaAprobacion}</Text>
                </View>

                <View style={styles.tituloFila}>
                    <Text style={styles.subtitulos}>
                        PORCENTAJE DE AVANCE DE ACUERDO AL CRONOGRAMA:{" "}
                    </Text>
                    <Text style={styles.text}>{avance}</Text>
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
                            <Text style={styles.tableCell}>Descripción</Text>
                        </View>
                    </View>
                    {actividades.map((actividad, index) => (
                        <View style={styles.tableRow} key={index} wrap={false}>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>
                                    {actividad.fecha_actividad}
                                </Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>
                                    {actividad.descripcion}
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

export default VisualizadorPDF;
