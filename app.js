// ==== DOM Elements ====
const billInput = document.getElementById('bill')
const peopleInput = document.getElementById('people')
const tipBtns = document.querySelectorAll('.tip-calculator__tip-btn')
const tipAmount = document.getElementById('tipAmount')
const totalAmount = document.getElementById('totalAmount')
const resetBtn = document.querySelector('.reset-btn')

// ==== State ====
let selectedTip = null

// ==== Helpers ====
function setOutputs(tipPerPerson, totalPerPerson) {
	tipAmount.textContent = tipPerPerson.toFixed(2)
	totalAmount.textContent = totalPerPerson.toFixed(2)
}

function resetOutputs() {
	tipAmount.textContent = '0.00'
	totalAmount.textContent = '0.00'
}

function clearActiveTip() {
	tipBtns.forEach((b) => b.classList.remove('is-active'))
	selectedTip = null
}

// ==== Error UI (only for people = 0) ====
// If you don't have an error element in HTML, this creates one above the people input.
const peopleWrap = peopleInput.closest('.tip-calculator__input-wrap')
let peopleError = document.querySelector('.people-error')

if (!peopleError && peopleWrap) {
	peopleError = document.createElement('p')
	peopleError.className = 'people-error'
	peopleError.textContent = "Can't be zero"
	peopleError.style.display = 'none'
	peopleError.style.color = 'hsl(13, 70%, 60%)'
	peopleError.style.fontSize = '13px'
	peopleError.style.position = 'absolute'
	peopleError.style.right = '0'
	peopleError.style.top = '0'
	peopleWrap.style.position = 'relative'
	peopleWrap.prepend(peopleError)
}

function showPeopleError() {
	if (peopleError) peopleError.style.display = 'block'
	peopleInput.style.borderColor = 'hsl(13, 70%, 60%)'
}

function hidePeopleError() {
	if (peopleError) peopleError.style.display = 'none'
	peopleInput.style.borderColor = 'transparent'
}

// ==== Core Calculation ====
function calculate() {
	const bill = Number(billInput.value)
	const people = Number(peopleInput.value)

	// Error condition requested: people is 0 but we're trying to calculate
	if (people === 0 && (bill > 0 || selectedTip)) {
		showPeopleError()
		resetOutputs()
		return
	} else {
		hidePeopleError()
	}

	// Keep it simple: only calculate when all 3 inputs exist
	if (!bill || !people || !selectedTip) {
		resetOutputs()
		return
	}

	const tipTotal = bill * (selectedTip / 100)
	const total = bill + tipTotal

	const tipPerPerson = tipTotal / people
	const totalPerPerson = total / people

	setOutputs(tipPerPerson, totalPerPerson)
}

// ==== Events ====

// Tip buttons
tipBtns.forEach((btn) => {
	if (btn.dataset.tip === 'custom') return // dummy button

	btn.addEventListener('click', () => {
		clearActiveTip()
		btn.classList.add('is-active')
		selectedTip = Number(btn.dataset.tip)
		calculate()
	})
})

// Inputs
billInput.addEventListener('input', calculate)
peopleInput.addEventListener('input', calculate)

// Reset
resetBtn.addEventListener('click', () => {
	billInput.value = ''
	peopleInput.value = ''
	clearActiveTip()
	hidePeopleError()
	resetOutputs()
})
