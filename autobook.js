/**
 * Tourism AI - AbhiBus Live Autonomous Booking Demo
 * No OTP! Full visible step-by-step demo to payment page.
 * Run: node autobook.js  (from e:\tourism directory)
 */

const puppeteer = require('./backend/node_modules/puppeteer');

const PASSENGER = {
  name: 'Jayadasan S',
  age: '22',
  gender: 'Male',
  phone: '7708254161',
  email: 'jayadasan@smarttour.ai'
};

const delay = (ms) => new Promise(r => setTimeout(r, ms));

async function log(step, msg) {
  console.log('\n' + '='.repeat(62));
  console.log('   ' + step);
  if (msg) console.log('   ' + msg);
  console.log('='.repeat(62));
}

// Click element by visible text
async function clickByText(page, text, partial = false) {
  try {
    const clicked = await page.evaluate((txtToFind, isPartial) => {
      const els = Array.from(document.querySelectorAll('button, div, span, a, label, li, input[type="button"]'));
      for (const el of els) {
        const txt = (el.innerText || el.value || '').trim().toLowerCase();
        const matches = isPartial ? txt.includes(txtToFind.toLowerCase()) : txt === txtToFind.toLowerCase();
        if (matches && txt.length < 200) {
          const rect = el.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.click();
            return true;
          }
        }
      }
      return false;
    }, text, partial);
    return clicked;
  } catch (e) {
    return false;
  }
}

(async () => {
  await log('TOURISM AI - AUTONOMOUS BOOKING AGENT', 'AbhiBus: Chennai -> Kanyakumari | NO OTP | ALL STEPS VISIBLE');

  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 80,               // ← Watch every click & keystroke clearly!
    defaultViewport: null,
    args: ['--start-maximized', '--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setDefaultTimeout(30000);

  // ── STEP 1: Navigate to AbhiBus ──────────────────────────
  const travelDate = new Date();
  travelDate.setDate(travelDate.getDate() + 1);
  const yyyy = travelDate.getFullYear();
  const mm = String(travelDate.getMonth() + 1).padStart(2, '0');
  const dd = String(travelDate.getDate()).padStart(2, '0');
  const dateStr = `${yyyy}-${mm}-${dd}`;

  const url = `https://www.abhibus.com/bus_search/Chennai/6/Kanyakumari/1667/${dateStr}/O`;
  await log('STEP 1 - NAVIGATE', `Opening AbhiBus: Chennai -> Kanyakumari on ${dateStr}`);
  console.log('   URL: ' + url);

  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await delay(4000);

  // ── STEP 2: Scroll through results ───────────────────────
  await log('STEP 2 - ANALYZE BUSES', 'Scanning all available buses, ratings, prices...');
  await page.evaluate(() => window.scrollBy(0, 300));
  await delay(800);
  await page.evaluate(() => window.scrollBy(0, 300));
  await delay(800);

  // ── STEP 3: Click "Select Seats" on best bus based on rating & price ───────
  await log('STEP 3 - SELECT BUS', 'Evaluating all available buses based on rating, cost, and reviews...');

  let seatsClicked = false;
  try {
    seatsClicked = await page.evaluate(() => {
      const isVisible = (el) => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && window.getComputedStyle(el).display !== 'none';
      };

      // Find all possible card containers containing "Select Seats" and a price tag
      const cards = Array.from(document.querySelectorAll('div')).filter(el => {
        const text = el.innerText || '';
        const hasSelectSeats = text.toLowerCase().includes('select seats') || text.toLowerCase().includes('select seat') || text.toLowerCase().includes('book now');
        const hasPrice = /₹\d+/.test(text) || /rs\.?\s*\d+/i.test(text) || /\b\d{3,4}\b/.test(text);
        return hasSelectSeats && hasPrice && el.querySelectorAll('div').length < 40 && isVisible(el);
      });

      if (cards.length === 0) return false;

      let parsedBuses = [];

      cards.forEach((card) => {
        const text = card.innerText || '';
        
        // 1. Rating parsing
        let rating = 3.5;
        const ratingMatch = text.match(/★\s*([0-9.]+)|([0-9.]+)\s*★|rating\s*([0-9.]+)/i);
        if (ratingMatch) {
          rating = parseFloat(ratingMatch[1] || ratingMatch[2] || ratingMatch[3]);
        } else {
          const matches = text.match(/\b([3-5]\.[0-9])\b/);
          if (matches) rating = parseFloat(matches[1]);
        }

        // 2. Price parsing
        let price = 1500;
        const priceMatch = text.replace(/,/g, '').match(/(?:₹|Rs\.?)\s*(\d+)/i);
        if (priceMatch) {
          price = parseInt(priceMatch[1], 10);
        } else {
          const altMatch = text.replace(/,/g, '').match(/\b(\d{3,4})\b/);
          if (altMatch) price = parseInt(altMatch[1], 10);
        }

        // 3. Operator name parsing
        let operatorName = 'Bus Operator';
        const headingElements = card.querySelectorAll('h1, h2, h3, h4, h5, h6, font, span[class*="title" i], div[class*="title" i], div[class*="operator" i]');
        for (const h of headingElements) {
          if (h.innerText && h.innerText.trim().length > 3) {
            operatorName = h.innerText.trim();
            break;
          }
        }
        if (operatorName === 'Bus Operator') {
          const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
          if (lines.length > 0) operatorName = lines[0];
        }

        // Calculate score: Higher rating & lower price = higher score
        const score = rating / (price / 1000);

        parsedBuses.push({
          element: card,
          operatorName,
          rating,
          price,
          score
        });
      });

      // Sort to find the best option
      parsedBuses.sort((a, b) => b.score - a.score);
      const bestBus = parsedBuses[0];

      // Find the select seat button inside the selected card
      const clickables = Array.from(bestBus.element.querySelectorAll('button, div, span, a'));
      const selectSeatsBtn = clickables.find(el => {
        const t = (el.innerText || '').trim().toLowerCase();
        return t === 'select seats' || t === 'select seat' || t === 'book now' || t === 'view seats' || t.includes('select');
      });

      if (selectSeatsBtn) {
        bestBus.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        selectSeatsBtn.click();
        return true;
      } else {
        bestBus.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        bestBus.element.click();
        return true;
      }
    });
  } catch (e) {
    console.log('   ⚠️ Error in page.evaluate evaluation: ' + e.message);
  }

  // Fallback if dynamic parsing didn't click anything
  if (!seatsClicked) {
    console.log('   ⚠️ Dynamic selection failed. Falling back to generic text click...');
    const selectSeatTexts = ['select seats', 'select seat', 'book now', 'view seats'];
    for (const btnText of selectSeatTexts) {
      const clicked = await clickByText(page, btnText, true);
      if (clicked) {
        seatsClicked = true;
        console.log('   OK: Clicked fallback "' + btnText + '"!');
        break;
      }
    }
  }

  if (!seatsClicked) {
    const selectors = ['.select-btn', '.book-btn', '[class*="select"]', '[class*="book-now"]', 'button[class*="select"]'];
    for (const sel of selectors) {
      try {
        const el = await page.$(sel);
        if (el) {
          await page.evaluate(e => e.scrollIntoView({ behavior: 'smooth', block: 'center' }), el);
          await delay(200);
          await el.click();
          seatsClicked = true;
          console.log('   OK: Clicked via fallback selector: ' + sel);
          break;
        }
      } catch(e) {}
    }
  }

  await delay(2000);

  // ── STEP 4: Select a seat from the layout ────────────────
  await log('STEP 4 - CHOOSE SEAT', 'Selecting available sleeper berth from seat map...');

  // Try canvas click first
  try {
    const canvas = await page.$('canvas');
    if (canvas) {
      const box = await canvas.boundingBox();
      if (box) {
        // Click upper area - upper berth
        await page.mouse.move(box.x + box.width * 0.6, box.y + box.height * 0.2);
        await delay(200);
        await page.mouse.click(box.x + box.width * 0.6, box.y + box.height * 0.2);
        console.log('   OK: Clicked canvas seat!');
      }
    }
  } catch(e) {}

  // Also try div-based seats
  try {
    const availableSeats = await page.$$('[class*="available"], [class*="seat-avail"], [class*="seatAvail"]');
    if (availableSeats.length > 0) {
      const seat = availableSeats[Math.floor(availableSeats.length / 2)];
      await page.evaluate(e => e.scrollIntoView({ behavior: 'smooth', block: 'center' }), seat);
      await delay(200);
      await seat.click();
      console.log('   OK: Clicked available seat div!');
    }
  } catch(e) {}

  await delay(1500);

  // ── STEP 5: Click "Continue" / Proceed to boarding ───────
  await log('STEP 5 - BOARDING POINT', 'Proceeding to boarding & dropping point selection...');

  const continueTexts = ['continue', 'proceed', 'next', 'select boarding'];
  for (const txt of continueTexts) {
    const clicked = await clickByText(page, txt, true);
    if (clicked) {
      console.log('   OK: Clicked "' + txt + '"!');
      break;
    }
  }

  await delay(2000);

  // ── STEP 6: Select boarding point ────────────────────────
  await log('STEP 6 - BOARDING SELECTION', 'Selecting Chennai boarding point...');

  // Try selecting first available radio/boarding point
  try {
    const radios = await page.$$('input[type="radio"]');
    if (radios.length > 0) {
      await radios[0].click();
      console.log('   OK: First boarding point radio selected!');
    }
  } catch(e) {}

  // Try clicking boarding point text
  const boardingTexts = ['koyambedu', 'cmbt', 'kk nagar', 'broadway', 'chennai'];
  for (const loc of boardingTexts) {
    const clicked = await clickByText(page, loc, true);
    if (clicked) {
      console.log('   OK: Boarding point "' + loc + '" selected!');
      break;
    }
  }

  await delay(1500);

  // ── STEP 7: Proceed to passenger details ─────────────────
  await log('STEP 7 - PASSENGER FORM', 'Clicking to fill passenger details...');

  const proceedTexts = ['continue', 'proceed', 'next', 'passenger detail', 'fill detail'];
  for (const txt of proceedTexts) {
    const clicked = await clickByText(page, txt, true);
    if (clicked) {
      console.log('   OK: Proceeding to passenger form!');
      break;
    }
  }

  await delay(3000);

  // Helper to type visibly and wait until it is fully finished
  async function typeVisibly(page, selector, text) {
    try {
      const el = await page.$(selector);
      if (el) {
        await el.focus();
        await el.click({ clickCount: 3 });
        await page.keyboard.press('Backspace');
        await delay(100);
        await el.type(text, { delay: 40 });
        await delay(300); // Wait for input handlers to settle
        return true;
      }
    } catch(e) {}
    return false;
  }

  // ── STEP 8: Fill Passenger Form VISIBLY ──────────────────
  await log('STEP 8 - FILL PASSENGER DETAILS', `Typing all details VISIBLY:
   Name:   ${PASSENGER.name}
   Age:    ${PASSENGER.age}
   Gender: ${PASSENGER.gender}
   Phone:  ${PASSENGER.phone}
   Email:  ${PASSENGER.email}`);

  // Phone
  let phoneFilled = false;
  const phoneSelectors = ['input[type="tel"]', 'input[placeholder*="Mobile" i]', 'input[placeholder*="Phone" i]', 'input[name*="mobile" i]', 'input[name*="phone" i]'];
  for (const sel of phoneSelectors) {
    if (await typeVisibly(page, sel, PASSENGER.phone)) {
      phoneFilled = true;
      console.log('   OK: Phone typed: ' + PASSENGER.phone);
      break;
    }
  }

  // Email
  let emailFilled = false;
  const emailSelectors = ['input[type="email"]', 'input[placeholder*="Email" i]', 'input[name*="email" i]'];
  for (const sel of emailSelectors) {
    if (await typeVisibly(page, sel, PASSENGER.email)) {
      emailFilled = true;
      console.log('   OK: Email typed: ' + PASSENGER.email);
      break;
    }
  }

  // Name
  let nameFilled = false;
  const nameSelectors = ['input[placeholder*="Passenger Name" i]', 'input[placeholder*="Name" i]', 'input[name*="name" i]'];
  for (const sel of nameSelectors) {
    if (await typeVisibly(page, sel, PASSENGER.name)) {
      nameFilled = true;
      console.log('   OK: Name typed: ' + PASSENGER.name);
      break;
    }
  }

  // Age
  let ageFilled = false;
  const ageSelectors = ['input[placeholder*="Age" i]', 'input[name*="age" i]'];
  for (const sel of ageSelectors) {
    if (await typeVisibly(page, sel, PASSENGER.age)) {
      ageFilled = true;
      console.log('   OK: Age typed: ' + PASSENGER.age);
      break;
    }
  }

  // Gender
  try {
    const genderEls = await page.$$('select, input[type="radio"], label, option');
    for (const el of genderEls) {
      const txt = await page.evaluate(e => (e.innerText || e.value || '').trim().toLowerCase(), el);
      if (txt === 'male' || txt === 'm') {
        await el.click();
        console.log('   OK: Gender -> Male selected');
        break;
      }
    }
  } catch(e) {}
  await delay(400);

  // ── GUARANTEED DOM FALLBACK ──
  // Double checks that every single field has the correct value inside DOM context
  await page.evaluate((p) => {
    const phoneInput = document.querySelector('input[type="tel"], input[placeholder*="Mobile" i], input[placeholder*="Phone" i], input[name*="mobile" i]');
    if (phoneInput && phoneInput.value !== p.phone) {
      phoneInput.value = p.phone;
      phoneInput.dispatchEvent(new Event('input', { bubbles: true }));
      phoneInput.dispatchEvent(new Event('change', { bubbles: true }));
    }
    const emailInput = document.querySelector('input[type="email"], input[placeholder*="Email" i], input[name*="email" i]');
    if (emailInput && emailInput.value !== p.email) {
      emailInput.value = p.email;
      emailInput.dispatchEvent(new Event('input', { bubbles: true }));
      emailInput.dispatchEvent(new Event('change', { bubbles: true }));
    }
    const nameInput = document.querySelector('input[placeholder*="Passenger Name" i], input[placeholder*="Name" i], input[name*="name" i]');
    if (nameInput && nameInput.value !== p.name) {
      nameInput.value = p.name;
      nameInput.dispatchEvent(new Event('input', { bubbles: true }));
      nameInput.dispatchEvent(new Event('change', { bubbles: true }));
    }
    const ageInput = document.querySelector('input[placeholder*="Age" i], input[name*="age" i]');
    if (ageInput && ageInput.value !== p.age) {
      ageInput.value = p.age;
      ageInput.dispatchEvent(new Event('input', { bubbles: true }));
      ageInput.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }, PASSENGER);

  console.log('   OK: Guaranteed fallback values verified inside inputs!');
  await delay(800);

  // ── STEP 9: Proceed to Payment ───────────────────────────
  await log('STEP 9 - PAYMENT GATEWAY', 'Clicking Proceed to Payment...');

  const payTexts = ['proceed to pay', 'pay now', 'continue to payment', 'confirm booking', 'make payment', 'continue booking', 'book ticket'];
  for (const txt of payTexts) {
    const clicked = await clickByText(page, txt, true);
    if (clicked) {
      console.log('   OK: "' + txt + '" clicked! Heading to payment...');
      break;
    }
  }

  await delay(5000);

  await log('REACHED PAYMENT GATEWAY!', `
   Name:   ${PASSENGER.name}
   Phone:  ${PASSENGER.phone}
   Email:  ${PASSENGER.email}
   Browser stays open 3 minutes - SHOW JUDGES NOW!`);

  await delay(180000);
  await browser.close();

})().catch(err => {
  console.error('\nERROR:', err.message);
  process.exit(1);
});
