//Laying out classes with constructors to call 
class Appointment {
    constructor(color) {
        this.color = color;
        this.pets = [];
    }
    addPet(color, name) {
        this.pets.push(new Pet(color, name));
    }
}

class Pet {
    constructor(color, name) {
        this.color = color;
        this.name = name;
    }
}
//mock API to use data 
class AppointmentService {
    static url = 'https://6605f27ed92166b2e3c3083a.mockapi.io/api/v1/PetSitting';

    static getAllAppointments() {
        return $.get(this.url);
    }

    static getAppointment(id) {
        return $.get(this.url + `/${id}`);
    }

    static createAppointment(appointment) {
        return $.post(this.url, appointment);
    }

    static updateAppointment(appointment) {
        return $.ajax({
            url: this.url + `/${appointment._id}`,
            dataType: 'json',
            data: JSON.stringify,
            contentType: 'application/json',
            type: 'PUT'
        });
    }

    static deleteAppointment(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        });
    }
}
//Setting up DOMManager
class DOMManager {
    static appointments;

    static getAllAppointments() {
        AppointmentService.getAllAppointments().then(appointments => this.render(appointments));
    }

    static createAppointment(color) {
        AppointmentService.createAppointment(new Appointment(color))
        .then(() => {
            return AppointmentService.getAllAppointments();
        })
        .then((appointments) => this.render(appointments));
    }

    static deleteAppointment(id) {
        AppointmentService.deleteAppointment(id) 
            .then(() => {
                return AppointmentService.getAllAppointments();
            })
            .then((appointments) => this.render(appointments));
    }

    static addPet(id) {
        for (let appointment of this.appointments) {
            if (appointment._id == id) {
                appointment.pets.push(new Pet($(`#${appointment._id}-pet-color`).val(), $(`#${appointment._id}-pet-name`).val()));
                AppointmentService.updateAppointment(appointment)
                    .then(() => {
                        return AppointmentService.getAllAppointments();
                    })
                    .then((appointments) => this.render(appointments));
            }
        }
    }

    static deletePet(appointmentId, petId) {
        for (let appointment of this.appointments) {
            if (house._id ==houseId) {
                for (let pet of appointment.pets) {
                    if (pet._Id == petId) {
                        appointment.pets.splice(appointment.pets.indexOf(pet), 1);
                        AppointmentService.updateAppointment(appointment)
                        .then(() => {
                            return AppointmentService.getAllAppointments();
                        })
                        .then((appointments) => this.render(appointments));
                    }
                }
            } 
        }
    }
//Static render to write out HTML in my JS file while also using TL to call ID's
static render(appointments) {
    this.appointments = appointments;
    $('#app').empty();
    for (let appointment of appointments) {
        $('#app').prepend(
            `<div id="${appointment._id}" class="card">
                <div class = "card-header">
                <h2>${appointment.name}</h2>
                <button class = "btn btn-danger" onclick="DOMManager.deleteAppointment('${appointment._id}')">Delete</button>
              </div>
              <div class="card-body">
                <div class="card">
                    <div class="row">
                        <div class="col-sm">
                            <input type="text" id="${appointment._id}-pet-color" class="form-control" placeholder="Pet Color">
                        </div>
                        <div class="col-sm">
                        <input type="text" id="${appointment._id}-pet-name" class="form-control" placeholder="Pet Name">
                        </div>
                    </div>
                    <button id="${appointment._id}-new-pet" onclick="DOMManager.addPet('${appointment._id}')" class="btn btn-primary form-control">Add</button>
                </div>
              </div>
            </div> <br>`
         );
         for (let pet of appointment.pets) {
            $(`#${appointment._id}`).find('.card-body').append(
                `<p>
                    <span id="color-${pet._id}"><strong>Color: </strong> ${pet.color}</span>
                    <span id="name-${pet._id}"><strong>Area: </strong> ${pet.name}</span>
                    <button class="btn btn-danger" onclick="DOMManager.deletePet('${appointment._id}', '${pet._id}')">Delete Pet </button>`
            );
         }
        }
    }

}
//using DOMManager to create new appointment
$('#create-new-appointment').click(() => {
    DOMManager.createAppointment($('#new-appointment-color').val());
    $('#new-appointment-color').val('');
});
 //calling my getAllAppointments function to execute code
DOMManager.getAllAppointments();

