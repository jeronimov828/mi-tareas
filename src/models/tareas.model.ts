export interface tareasModel {
    titulo: string;
    descripcion: string;
    fecha_vencimiento: string;
    completada: boolean;
}

export interface tareasModelCrear {
    titulo: string;
    descripcion: string;
    fecha_vencimiento: string;
}

export interface tareasModelEstado {
    completada: boolean;
}