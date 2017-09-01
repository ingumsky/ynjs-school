
"use strict";

let MyForm = {
	validate: 	validateForm,
	getData: 	getFormData,
	setData: 	setFormData,
	submit: 	submitForm,
};

function validateForm(onSubmit) {

	let fields = getFormFields(); // field objects
	let values = getFormData(); // data taken from fields

	let regexes = { // Regexes to check fields against
		fio: /([\wа-яА-Я]+) ([\wа-яА-Я]+) ([\wа-яА-Я]+)/,
		email: /[\w.%+-]+@(ya\.ru|yandex\.ru|yandex\.ua|yandex\.by|yandex\.kz|yandex\.com)/,
		phone: /\+7\([\d]{3}\)[\d]{3}-[\d]{2}-[\d]{2}/,
	};

	let res = { // result object
		isValid: false,
		errorFields: [], // List of invalid inputs
	};

	Object.keys(values).map(function(x) { // validation itself
		if (!x || !__validateStr(x)) {
			res.errorFields.push(x); 
			fields[x].classList.add('error'); // add an "error" class 
		} else {
			fields[x].classList.remove('error'); // remove an "error" class
		}
	});

	if (!res.errorFields.length) { res.isValid = true; } // validation is passed

	if (onSubmit) { 
		if (res.isValid) { // Checks if there were any failures and if there were none, returns true
			document.getElementById("submitButton").disabled = true;
		}
	}
	return res;

	function __validateStr(str) {
		if (!regexes[str].test(values[str])) { return false; }
		if (str === 'phone' && __strSum(values[str]) > 30) { return false; }
		return true; 
	};

	function __strSum(str) {
		str = str.replace(/\D/g,''); // Really ugly helper 
		let a = str.split(''); 
		return a.reduce(function(tot, num) {
			return Number(tot) + Number(num);
		});
	};
};

function getFormData() {
	let fields = getFormFields();
	return {
		fio: fields.fio.value || null,
		email: fields.email.value || null,
		phone: fields.phone.value || null,
	};
};

function setFormData(data) {
	let fields = getFormFields();
	Object.keys(fields).map(function(x) {
		fields[x].value = data[x] || null;
	});
};

function submitForm() {
	let action = document.getElementById("myForm").action;
	let res = validateForm(true);
	let container = document.getElementById("resultContainer");

	__containerContent(container); // wiping container's style and content off

	if (res.isValid) {
		fetch(action) // fetching response from a server
		.then((resp) => resp.json())
		.then(function(data) {
			if (data.status === "success") {
				__containerContent(container, "success", "Success");
			} else if (data.status === "error") {
				__containerContent(container, "error", data.reason);
			} else if (data.status === "progress") {
				__containerContent(container, "progress", "");
				setTimeout(function(){submitForm()}, data.timeout);
			}
		})
		.catch(function(err) { // if something went wrong with the response
			console.log(new Error(err));
		});
	}

	return false;

	function __containerContent(cont, cl, data) { // helper function to add style/content to the container
		cont.classList.add(cl);
		cont.innerHTML = data || null;
	}
};

function getFormFields() {
	return {
		fio: document.getElementById("fio"),
		email: document.getElementById("email"),
		phone: document.getElementById("phone"),
	};
};