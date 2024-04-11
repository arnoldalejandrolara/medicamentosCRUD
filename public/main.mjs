

let dataTable;
let dataTableIsInitialized = false;

const dataTableOptions = {
    //scrollX: "2000px",
    search : true,
    lengthMenu: [5, 10, 15, 20, 100, 200, 500],
    columnDefs: [
        { className: "centered", targets: [0, 1, 2, 3, 4, 5, 6] },
        { orderable: false, targets: [5, 6] },
        { searchable: true, targets: [2] }
        //{ width: "50%", targets: [0] }
    ],
    destroy: true,
    language: {
        lengthMenu: "Mostrar _MENU_ registros por página",
        zeroRecords: "Ningún usuario encontrado",
        info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros",
        infoEmpty: "Ningún usuario encontrado",
        infoFiltered: "(filtrados desde _MAX_ registros totales)",
        search: "Buscar:",
        loadingRecords: "Cargando...",
        // paginate: {
        //     first: "Primero",
        //     last: "Último",
        //     next: "Siguiente",
        //     previous: "Anterior"
        // }
    },
   
};


const initDataTable = async () => {
    if (dataTableIsInitialized) {
        console.log("borrando tabla")
        dataTable.destroy();
    }
    console.log("creando tabla")
    await listUsers();

    dataTable = $("#datatable_users").DataTable(dataTableOptions);

    dataTableIsInitialized = true;
};

const listUsers = async () => {
    console.log("rehaciendo la tabla")
    try {

        const response = await fetch("/obtenerMedicamentos");
        const datos = await response.json();

        let content = ``;
        datos.forEach((data, index) => {
            content += `
                <tr>
                    <td>${data.ID}</td>
                    <td>${data.NombreMedicamento}</td>
                    <td>${data.FechaExpiracion != null ? moment(data.FechaExpiracion).format("YYYY-MM-DD") : 'Sin fecha'}</td>
                    <td>${data.CantidadTabletas}</td>
                    <td>${data.Donado == 1 ? 'Si' : 'No'}</td>
                    <td>${data.FechaDonacion != null ? moment(data.FechaDonacion).format("YYYY-MM-DD") : 'Sin fecha'}</td>
                    <td>
                    <button class="btn btn-sm btn-primary" onclick="editarMedicamento(${data.ID},'${data.NombreMedicamento}','${data.FechaExpiracion}' ,'${data.CantidadTabletas}','${data.Donado}')"><i class="fa-solid fa-pencil"></i></button>
                    <button class="btn btn-sm btn-danger" onclick="eliminarMedicamento(${data.ID})"><i class="fa-solid fa-trash-can"></i></button>                                  
                    </td>
                </tr>`;
        });
        $("#tableBody_users").html(content);
    } catch (ex) {
        alert(ex);
    }
};



$(document).ready(async () => {
    await initDataTable();

});



const exampleModal = document.getElementById('exampleModal')
if (exampleModal) {
  exampleModal.addEventListener('show.bs.modal', event => {
    // Button that triggered the modal
    const button = event.relatedTarget
    // Extract info from data-bs-* attributes
    const recipient = button.getAttribute('data-bs-whatever')
    // If necessary, you could initiate an Ajax request here
    // and then do the updating in a callback.

    // Update the modal's content.
    // const modalTitle = exampleModal.querySelector('.modal-title')
    const modalBodyInput = exampleModal.querySelector('.modal-body input')

    // modalTitle.textContent = `New message to ${recipient}`
    modalBodyInput.value = recipient
  })
}



