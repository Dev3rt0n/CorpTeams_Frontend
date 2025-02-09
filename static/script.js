document.addEventListener('DOMContentLoaded', function () {
    const homeLink = document.getElementById('home-link');
    const createEmployeeLink = document.getElementById('create-employee-link');
    const employeeListLink = document.getElementById('employee-list-link');
    const createDepartmentLink = document.getElementById('create-department-link');
    const showDepartmentLink = document.getElementById('department-list-link');
    const createemployeeSection = document.getElementById('create-employee');
    const createDepartmentSection = document.getElementById('create-department');
    const departmentListSection = document.getElementById('show-department');
    const employeeListSection = document.getElementById('show-employee-list');
    const homeSection = document.getElementById('home-show');
    const addemployeeForm = document.getElementById('add-employee-form');
    const addDepartmentForm = document.getElementById('add-department-form');
    const showDepartmentForm = document.getElementById('list_depart');
    const employeeTableBody = document.getElementById('func-table-body');
    const employeeDepartTableBody = document.getElementById('func-dep-table-body');
    const listFuncionario = document.getElementById('list_func');
    const editEmployeeButton = document.getElementById('edit-func');
    const editPostalCode = document.getElementById('cep');
    const editPostalCodeModal = document.getElementById('employee-zip');

    showEditFuncModal();

    function showError(titleError, errorMessage) {
        console.error(titleError, ': ', errorMessage);
        errorModal = new bootstrap.Modal(document.getElementById("errorModal"), {
            keyboard: true
        });
        modalTitle = document.querySelector("#errorModal .modal-title");
        modalBody = document.querySelector("#errorModal .modal-body");
        modalTitle.innerHTML = titleError;
        modalBody.innerHTML = errorMessage;
        errorModal.show();
    }

    // Função para exibir a seção de criação de funcionário e ocultar a seção de lista de funcionários
    function showCreateEmployeeSection() {
        createemployeeSection.classList.remove('d-none');
        employeeListSection.classList.add('d-none');
        createDepartmentSection.classList.add('d-none');
        departmentListSection.classList.add('d-none');
        homeSection.classList.add('d-none');
    }

    // Função para exibir a seção de lista de funcionários e ocultar a seção de criação de funcionário
    function showEmployeeListSection() {
        createemployeeSection.classList.add('d-none');
        createDepartmentSection.classList.add('d-none');
        employeeListSection.classList.remove('d-none');
        departmentListSection.classList.add('d-none');
        homeSection.classList.add('d-none');
        loadFuncTable();
    }

    function showCreateDepartmentSection() {
        createDepartmentSection.classList.remove('d-none');
        employeeListSection.classList.add('d-none');
        createemployeeSection.classList.add('d-none');
        departmentListSection.classList.add('d-none');
        homeSection.classList.add('d-none');
        loadFuncList();
    }

    function showDepartmentListSection() {
        departmentListSection.classList.remove('d-none');
        createemployeeSection.classList.add('d-none');
        employeeListSection.classList.add('d-none');
        createDepartmentSection.classList.add('d-none');
        homeSection.classList.add('d-none');
        loadDepartmentList();
        employeeDepartTableBody.innerHTML = '';
    }

    function showHomeSection() {
        departmentListSection.classList.add('d-none');
        createemployeeSection.classList.add('d-none');
        employeeListSection.classList.add('d-none');
        createDepartmentSection.classList.add('d-none');
        homeSection.classList.remove('d-none');
    }

    // Função para buscar e exibir funcionários
    async function loadFuncTable() {
        return await fetch('http://127.0.0.1:5000/funcionarios')
            .then(response => response.json())
            .then(data => {
                // Limpa a tabela de funcionários existentes
                employeeTableBody.innerHTML = '';

                // Adiciona cada funcionário à tabela
                data.forEach(employee => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${employee.nome}</td>
                        <td>${employee.email}</td>
                        `;
                    colunaAction = document.createElement('td');
                    buttonEdit = document.createElement('button');
                    buttonEdit.setAttribute('class', "btn btn-secondary btn-sm edit-btn");
                    buttonEdit.setAttribute("data-bs-toggle", "modal");
                    buttonEdit.setAttribute("data-bs-target", "#editModal");
                    buttonEdit.setAttribute('data-id', employee.id);
                    buttonEdit.innerText = 'Editar';

                    buttonDelete = document.createElement('button');
                    buttonDelete.setAttribute('class', "btn btn-danger ml-1 btn-sm delete-btn");
                    buttonDelete.setAttribute('data-id', employee.id);
                    buttonDelete.innerText = 'Delete';
                    buttonDelete.addEventListener('click', event => {
                        event.preventDefault();
                        deleteFuncionario(event.target.getAttribute('data-id'));
                    });

                    colunaAction.appendChild(buttonEdit);
                    colunaAction.appendChild(buttonDelete);


                    row.appendChild(colunaAction);
                    employeeTableBody.appendChild(row);
                });
            })
            .catch(error => showError('Erro ao carregar funcionários', error));
    }

    function deleteFuncionario(id) {
        fetch('http://127.0.0.1:5000/funcionarios/' + id, {
            method: 'DELETE'
        })
            .then(response => response.text())
            .then(data => {
                showEmployeeListSection();
            })
            .catch(error => showError('Erro ao deletar funcionário', error));
    }

    function removeFuncionarioDepartamento(departamento) {
        fetch('http://127.0.0.1:5000/funcionarios/' + departamento, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ departamento })
        })
            .catch(error => showError('Erro remover funcionário do departamento', error));
    }

    function showEditFuncModal() {
        var editModal = document.getElementById('editModal');
        editModal.addEventListener('show.bs.modal', function (event) {
            // Button that triggered the modal
            var button = event.relatedTarget;
            // Extract info from data-bs-* attributes
            var id = button.getAttribute('data-id');
            fetch('http://127.0.0.1:5000/funcionarios/' + id, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }
            })
                .then(response => response.json())
                .then(data => {
                    var modalTitle = editModal.querySelector('#editModal .modal-title');
                    var modalEmployeeName = editModal.querySelector('#editModal .modal-body #employee-name');
                    var modalEmployeeEmail = editModal.querySelector('#editModal .modal-body #employee-email');
                    var modalEmployeeZip = editModal.querySelector('#editModal .modal-body #employee-zip');
                    var modalEmployeeAddress = editModal.querySelector('#editModal .modal-body #employee-address');
                    var modalEmployeeNumber = editModal.querySelector('#editModal .modal-body #employee-number');
                    var modalEmployeeNeighborhood = editModal.querySelector('#editModal .modal-body #employee-neighborhood');
                    var modalEmployeeCity = editModal.querySelector('#editModal .modal-body #employee-city');
                    var modalEmployeeState = editModal.querySelector('#editModal .modal-body #employee-state');

                    modalTitle.textContent = 'Editar ' + data.nome;
                    modalEmployeeName.value = data.nome;
                    modalEmployeeEmail.value = data.email;
                    modalEmployeeZip.value = data.cep;
                    modalEmployeeAddress.value = data.rua;
                    modalEmployeeNumber.value = data.numero;
                    modalEmployeeNeighborhood.value = data.bairro;
                    modalEmployeeCity.value = data.cidade;
                    modalEmployeeState.value = data.uf;
                    modalEmployeeName.setAttribute("data-id", id)
                })
                .catch(error => showError('Erro ao editar funcionário', error));
        })
    }

    function loadFuncList() {
        fetch('http://127.0.0.1:5000/funcionarios')
            .then(response => response.json())
            .then(data => {
                // Limpa a lista de funcionários existentes
                listFuncionario.innerHTML = '';

                // Adiciona cada funcionário à lista
                data.forEach(employee => {
                    if (Object.keys(employee.departamento).length === 0) {
                        const option = document.createElement('option');
                        option.setAttribute('value', `${employee.id}`);
                        option.innerText = employee.nome;

                        listFuncionario.appendChild(option);
                    }
                });
            })
            .catch(error => showError('Erro ao buscar funcionários', error));
    }

    function loadDepartmentList() {
        fetch('http://127.0.0.1:5000/departamentos', {
            method: 'GET'
        })
            .then(response => response.json())
            .then(data => {
                // Limpa a tabela de funcionários existentes
                showDepartmentForm.innerHTML = '<option>Selecione um departamento</option>';

                // Adiciona cada funcionário à tabela
                data.forEach(department => {
                    var option = document.createElement('option')
                    option.value = department.id;
                    option.innerText = department.nome;
                    showDepartmentForm.appendChild(option);
                });
            })
            .catch(error => showError('Erro ao buscar funcionários', error));
    }

    editEmployeeButton.addEventListener('click', event => {
        var modalEmployeeName = editModal.querySelector('#editModal .modal-body #employee-name');
        var modalEmployeeEmail = editModal.querySelector('#editModal .modal-body #employee-email');
        var id = modalEmployeeName.getAttribute("data-id");
        var cep = editModal.querySelector('#editModal .modal-body #employee-zip').value;
        var rua = editModal.querySelector('#editModal .modal-body #employee-address').value;
        var numero = editModal.querySelector('#editModal .modal-body #employee-number').value;
        var bairro = editModal.querySelector('#editModal .modal-body #employee-neighborhood').value;
        var cidade = editModal.querySelector('#editModal .modal-body #employee-city').value;
        var uf = editModal.querySelector('#editModal .modal-body #employee-state').value;
        var nome = modalEmployeeName.value;
        var email = modalEmployeeEmail.value;


        fetch('http://127.0.0.1:5000/funcionarios/' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome, email, cep, rua, numero, bairro, cidade, uf
            })
        })
            .then(response => response.text())
            .then(data => {
                // Exibe a seção de lista de funcionários
                showEmployeeListSection();
            })
            .catch(error => showError('Erro ao editar funcionário', error))
            .finally(() => {
                // Fecha modal
                document.querySelector("#editModal > div > div > div.modal-header > button").click()
            });
    });

    // Evento de clique no link "Funcionários"
    createEmployeeLink.addEventListener('click', event => {
        event.preventDefault();
        showCreateEmployeeSection();
    });

    // Evento de clique no link "Criar Departamento"
    createDepartmentLink.addEventListener('click', event => {
        event.preventDefault();
        showCreateDepartmentSection();
    });

    // Evento de clique no link "Lista de funcionários"
    employeeListLink.addEventListener('click', event => {
        event.preventDefault();
        loadFuncTable();
        showEmployeeListSection();
    });

    // Evento de clique no link "Lista de funcionários"
    showDepartmentLink.addEventListener('click', event => {
        event.preventDefault();
        showDepartmentListSection();
    });

    // Evento de clique no link "Lista de funcionários"
    homeLink.addEventListener('click', event => {
        event.preventDefault();
        showHomeSection();
    });
    homeLink.click();

    // Adiciona um novo funcionário ao enviar o formulário
    addemployeeForm.addEventListener('submit', event => {
        event.preventDefault();

        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const rua = document.getElementById('rua').value;
        const cep = document.getElementById('cep').value;
        const numero = document.getElementById('numero').value;
        const bairro = document.getElementById('bairro').value;
        const cidade = document.getElementById('cidade').value;
        const uf = document.getElementById('uf').value;

        // Envia os dados do novo funcionário para a API
        fetch('http://127.0.0.1:5000/funcionarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome, email, rua, cep, numero, bairro, cidade, uf
            })
        })
            .then(data => {
                // Limpa os campos do formulário após adicionar o funcionário com sucesso
                document.getElementById('nome').value = '';
                document.getElementById('email').value = '';
                document.getElementById('rua').value = '';
                document.getElementById('rua').disabled = false;
                document.getElementById('bairro').value = ''
                document.getElementById('bairro').disabled = false;
                document.getElementById('cidade').value = '';
                document.getElementById('cidade').disabled = false;
                document.getElementById('uf').value = '';
                document.getElementById('uf').disabled = false;

                // Exibe a seção de lista de formulários após adicionar o funcionário
                showEmployeeListSection();
            })
            .catch(error => showError('Erro ao adicionar funcionário', error));
    });

    // Adiciona um novo departamento ao enviar o formulário
    addDepartmentForm.addEventListener('submit', event => {
        event.preventDefault();

        const nome = document.getElementById('nome_departamento').value;
        const options = document.querySelectorAll('#list_func option');
        var list_func = [];

        for (var i = 0; i < options.length; i++) {
            if (options[i].selected)
                list_func.push(options[i].value)
        }
        // Envia os dados do departamento para a API
        fetch('http://127.0.0.1:5000/departamentos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome, list_func })
        })
            .then(response => response.text())
            .then(data => {
                // Limpa os campos do formulário
                document.getElementById('nome_departamento').value = '';
                document.getElementById('list_func').value = '';
                showCreateDepartmentSection();
            })
            .catch(error => showError('Erro ao adicionar departamento', error));
    });

    showDepartmentForm.addEventListener('change', event => {
        event.preventDefault();

        // Verifica se valor do campo é um número
        if (!isNaN(parseInt(showDepartmentForm.value))) {
            // Envia os dados do departamento para a API
            fetch('http://127.0.0.1:5000/departamentos/' + showDepartmentForm.value, {
                method: 'GET'
            })
                .then(response => response.json())
                .then(data => {
                    // Limpa a tabela de funcionários existentes
                    employeeDepartTableBody.innerHTML = '';
                    // Adiciona cada funcionário à tabela
                    data.funcionarios.forEach(employee => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${employee.nome}</td>
                            <td>${employee.email}</td>
                        `;
                        colunaAction = document.createElement('td');

                        buttonDelete = document.createElement('button');
                        buttonDelete.setAttribute('class', "btn btn-danger btn-sm delete-btn");
                        buttonDelete.setAttribute('data-id', employee.id);
                        buttonDelete.innerText = 'Delete';
                        buttonDelete.addEventListener('click', event => {
                            event.preventDefault();
                            removeFuncionarioDepartamento(event.target.getAttribute('data-id'));
                            event.target.parentNode.parentNode.remove();
                        });

                        colunaAction.appendChild(buttonDelete);
                        row.appendChild(colunaAction);
                        employeeDepartTableBody.appendChild(row);
                    });
                })
                .catch(error => showError('Erro ao adicionar departamento', error));
        } else {
            employeeDepartTableBody.innerHTML = '';
        }
    });

    editPostalCode.addEventListener('keyup', event => {
        const regPattern = /\D/i;
        editPostalCode.value = editPostalCode.value.replace(regPattern, "");
    });

    editPostalCode.addEventListener('blur', event => {
        fetch(`https://viacep.com.br/ws/${editPostalCode.value}/json`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.erro === "true") {
                    throw new Error
                }
                document.getElementById('rua').value = data.logradouro;
                document.getElementById('rua').disabled = true;
                document.getElementById('bairro').value = data.bairro;
                document.getElementById('bairro').disabled = true;
                document.getElementById('cidade').value = data.localidade;
                document.getElementById('cidade').disabled = true;
                document.getElementById('uf').value = data.uf;
                document.getElementById('uf').disabled = true;
                editPostalCode.classList.remove("is-invalid");
            })
            .catch(error => {
                document.getElementById('rua').value = '';
                document.getElementById('rua').disabled = false;
                document.getElementById('bairro').value = ''
                document.getElementById('bairro').disabled = false;
                document.getElementById('cidade').value = '';
                document.getElementById('cidade').disabled = false;
                document.getElementById('uf').value = '';
                document.getElementById('uf').disabled = false;
                editPostalCode.classList.add("is-invalid");

            })
    });

    editPostalCodeModal.addEventListener('keyup', event => {
        const regPattern = /\D/i;
        editPostalCodeModal.value = editPostalCodeModal.value.replace(regPattern, "");
    });

    editPostalCodeModal.addEventListener('blur', event => {
        fetch(`https://viacep.com.br/ws/${editPostalCodeModal.value}/json`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.erro === "true") {
                    throw new Error
                }
                document.getElementById('employee-address').value = data.logradouro;
                document.getElementById('employee-address').disabled = true;
                document.getElementById('employee-neighborhood').value = data.bairro;
                document.getElementById('employee-neighborhood').disabled = true;
                document.getElementById('employee-city').value = data.localidade;
                document.getElementById('employee-city').disabled = true;
                document.getElementById('employee-state').value = data.uf;
                document.getElementById('employee-state').disabled = true;
                editPostalCodeModal.classList.remove("is-invalid");
            })
            .catch(error => {
                document.getElementById('employee-address').value = '';
                document.getElementById('employee-address').disabled = false;
                document.getElementById('employee-neighborhood').value = ''
                document.getElementById('employee-neighborhood').disabled = false;
                document.getElementById('employee-city').value = '';
                document.getElementById('employee-city').disabled = false;
                document.getElementById('employee-state').value = '';
                document.getElementById('employee-state').disabled = false;
                editPostalCodeModal.classList.add("is-invalid");

            })
    });
});