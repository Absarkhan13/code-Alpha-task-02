let current    = '0';  
let previous   = null;  
let operator   = null; 
let freshEntry = false;
let justEvaled = false; 

const valueEl = document.getElementById('value');
const exprEl  = document.getElementById('expression');

function fmt(n) {
  const s = String(n);
  if (s.length > 12) return parseFloat(n.toPrecision(9)).toString();
  return s;
}

function compute(a, b, op) {
  a = parseFloat(a);
  b = parseFloat(b);
  switch (op) {
    case '+': return a + b;
    case '−': return a - b;
    case '×': return a * b;
    case '÷': return b === 0 ? 'Error' : a / b;
  }
}




function updateDisplay() {
  let display = current;
  if (display !== 'Error') {
    const n = parseFloat(display);
    if (!isNaN(n) && !display.endsWith('.')) {
      display = fmt(n);
    }
  }
  valueEl.textContent = display;
}


function press(action, data) {

  // ── Digit ──
  if (action === 'num') {
    if (justEvaled) { previous = null; operator = null; justEvaled = false; }
    if (current === '0' || freshEntry) {
      current    = (data === '0' && current === '0') ? '0' : data;
      freshEntry = false;
    } else {
      if (current.replace('-', '').length < 12) current += data;
    }
    updateDisplay();

  } else if (action === 'dot') {
    if (justEvaled) { current = '0'; justEvaled = false; previous = null; operator = null; }
    if (freshEntry) { current = '0'; freshEntry = false; }
    if (!current.includes('.')) current += '.';
    updateDisplay();


  } else if (action === 'clear') {
    current    = '0';
    previous   = null;
    operator   = null;
    freshEntry = false;
    justEvaled = false;
    exprEl.textContent = '';
    updateDisplay();

  } else if (action === 'sign') {
    if (current !== '0' && current !== 'Error') {
      current = current.startsWith('-') ? current.slice(1) : '-' + current;
      updateDisplay();
    }

  } else if (action === 'pct') {
    if (current !== 'Error') {
      current = fmt(parseFloat(current) / 100);
      updateDisplay();
    }

 
  } else if (action === 'op') {
    if (current === 'Error') return;

    if (operator && !freshEntry && !justEvaled) {
     
      const result = compute(previous, current, operator);
      exprEl.textContent = fmt(previous) + ' ' + operator + ' ' + fmt(current) + ' ' + data;
      current  = result === 'Error' ? 'Error' : fmt(result);
      previous = current;
    } else {
      exprEl.textContent = (justEvaled ? fmt(parseFloat(current)) : current) + ' ' + data;
      previous = current;
    }

    operator   = data;
    freshEntry = true;
    justEvaled = false;
    updateDisplay();

  } else if (action === 'eq') {
    if (operator && previous !== null && !freshEntry) {
      exprEl.textContent = fmt(previous) + ' ' + operator + ' ' + current + ' =';
      const result = compute(previous, current, operator);
      current    = result === 'Error' ? 'Error' : fmt(result);
      previous   = null;
      operator   = null;
      freshEntry = true;
      justEvaled = true;
      updateDisplay();

    } else if (operator && previous !== null && freshEntry) {
      
      exprEl.textContent = fmt(previous) + ' ' + operator + ' ' + fmt(previous) + ' =';
      const result = compute(previous, previous, operator);
      current    = result === 'Error' ? 'Error' : fmt(result);
      freshEntry = true;
      justEvaled = true;
      updateDisplay();
    }

  } else if (action === 'back') {
    if (current !== 'Error' && !justEvaled) {
      current = current.length > 1 ? current.slice(0, -1) : '0';
      updateDisplay();
    }
  }
}


document.addEventListener('keydown', function (e) {
  const k = e.key;
  if      (k >= '0' && k <= '9')        press('num', k);
  else if (k === '.')                    press('dot');
  else if (k === '+')                    press('op', '+');
  else if (k === '-')                    press('op', '−');
  else if (k === '*')                    press('op', '×');
  else if (k === '/') { e.preventDefault(); press('op', '÷'); }
  else if (k === 'Enter' || k === '=')  press('eq');
  else if (k === 'Escape')              press('clear');
  else if (k === 'Backspace')           press('back');
  else if (k === '%')                   press('pct');
});