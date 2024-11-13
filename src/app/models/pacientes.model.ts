import { Timestamp } from "firebase/firestore";

export interface Paciente {
    id: string;
    cedula: string,
    image: string,
    nombres: string,
    apellidos: string,
    telefono: string,
    edad: string,
    peso: string,
    estatura: string,
    direccion: string,
    telefonoEmergencia: string,
    tipoSangre: string,
    ocupacion: string,
    //patologia: string,
    fechanacimiento: string,  // Aquí está tu variable de tipo Date

    carrera: string,
    semestre: string,

    ///////////ASMA///////////////////////
    asma:string,
    desdeCuando: string,
    tratamientoActual: string,
    ultimaCrisis: string,

    ////////////////HIPERTENCION/////////////////////

    hipertencion: string,
    fechadiagnostico: string,
    tratamientoActualHiper: string

    /////////////DIABETES////////////////////////

    diabetes: string,
    fechadiagnosticodiabete: string,
    tratamientoActualdiabete: string,

    /////////////////////////Quirúrgicos///////////
    Quirurgicos: string,
    descripcion: string,

        /////////////////////////Vacunas Anticovid///////////
        anticovid: string,
        descripcionanticovid: string




}