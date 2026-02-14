import { Column } from "@components/shared/models/Column.models";

export const PRODUCTS_GRID_COLUMNS: Column[] = [
    {
        name: "logo",
        title: "Logo",
        isImage: true
    },
    {
        name: "name",
        title: "Nombre del Producto"
    },
    {
        name: "description",
        title: "Descripcion",
        icon: "assets/icons/info-cycle.svg",
        alignIcon: 'right'
    },
    {
        name: "date_release",
        title: "Fecha de Liberacion",
        icon: "assets/icons/info-cycle.svg",
        alignIcon: 'right'
    },
    {
        name: "date_revision",
        title: "Fecha de reestructuracion",
        icon: "assets/icons/info-cycle.svg",
        alignIcon: 'right'
    },
    { name: 'actions', title: '', width: '1%' }
];