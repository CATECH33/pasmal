const { chromium } = require('./node_modules/playwright')
const shot = (name) => `${name}.png`
const BASE = 'https://pasmal.vercel.app'

;(async () => {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  page.setDefaultTimeout(25000)
  const consoleErrors = []
  page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()) })

  /* 1. load */
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1800)
  await page.screenshot({ path: shot('h1_loaded') })
  console.log('✅ Page loaded')

  /* 2. find input */
  const loc = page.locator('input[placeholder="Paris, Lyon, Bordeaux…"]').first()
  await loc.waitFor({ state: 'visible' })
  console.log('✅ Location input found in hero')

  /* 3. before focus */
  await page.screenshot({ path: shot('h2_before_focus') })

  /* 4. focus → animated ring */
  await loc.click()
  await page.waitForTimeout(350)
  await page.screenshot({ path: shot('h3_focused') })
  console.log('✅ Focused')

  /* 5. type "Lyon" → dropdown */
  await loc.type('Lyon', { delay: 70 })
  await page.waitForTimeout(500)
  await page.screenshot({ path: shot('h4_dropdown') })
  const hasDropdown = await page.locator('button:has-text("Lyon")').first().isVisible().catch(() => false)
  console.log(hasDropdown ? '✅ Dropdown visible' : '❌ Dropdown not visible')

  /* 6. select */
  if (hasDropdown) {
    await page.locator('button:has-text("Lyon")').first().click({ force: true })
    await page.waitForTimeout(700)
  }
  await page.screenshot({ path: shot('h5_selected') })
  const val = await loc.inputValue()
  console.log('Input after select:', val, val === 'Lyon' ? '✅' : '❌')

  /* 7. console errors */
  console.log('JS errors:', consoleErrors.length === 0 ? 'none ✅' : consoleErrors.slice(0,3).join(' | '))

  /* 8. keyboard nav */
  await loc.click(); await loc.fill('')
  await page.waitForTimeout(150)
  await loc.type('Mar', { delay: 70 })
  await page.waitForTimeout(400)
  await page.keyboard.press('ArrowDown')
  await page.waitForTimeout(150)
  await page.keyboard.press('Enter')
  await page.waitForTimeout(400)
  const val2 = await loc.inputValue()
  await page.screenshot({ path: shot('h6_keyboard') })
  console.log('Keyboard nav result:', val2, val2 ? '✅' : '❌')

  /* 9. clear btn */
  const clearBtn = page.locator('button.rounded-full').first()
  if (await clearBtn.isVisible().catch(() => false)) {
    await clearBtn.click({ force: true })
    await page.waitForTimeout(300)
    const val3 = await loc.inputValue()
    console.log('After clear:', val3 === '' ? 'empty ✅' : `"${val3}" ❌`)
  }
  await page.screenshot({ path: shot('h7_clear') })

  await browser.close()
})()
