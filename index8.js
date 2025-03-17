const puppeteer = require('puppeteer');

async function openBrowser() {
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const browser = await puppeteer.launch({ headless: false }); // เปิด browser แบบมีส่วนหัว
    const page = await browser.newPage(); // สร้าง page ใหม่
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto('https://showdownspace-rpa-challenge.vercel.app/challenge-mui-168af805/'); // ไปที่ URL ที่ต้องการ

    await page.waitForSelector('.chakra-button.css-jut409'); // More specific selector
    const button = await page.$('.chakra-button.css-jut409');

    if (button) {
        await page.waitForSelector('div.css-1f6qb2o'); // More specific selector
        const selectorUl = 'div.css-1f6qb2o ul > li';
        // const elementUl = await page.$$(selectorUl);

        const textArray = await page.evaluate((selectorUl) => {
            return Array.from(document.querySelectorAll(selectorUl))
                .map(el => el.textContent.trim())
        }, selectorUl);

        // await console.log(textArray);
        await button.click();
        for (let i = 0; i < textArray.length; i++) {
            await page.waitForSelector('button.MuiButtonBase-root', { visible: true, timeout: 500 }); // Timeout after 5 seconds
            const buttonYear = await page.$('button.MuiButtonBase-root');
            await buttonYear.click();

            let resultDateTime = textArray[i].split(/[-:\s]/).map(Number);

            console.log('resultDateTime', resultDateTime);


            //หาปี
            await page.waitForSelector('div.MuiYearCalendar-root.css-kiu2gm', { visible: true, timeout: 1000 }); // Timeout after 5 seconds
            const selectorYear = 'div.MuiYearCalendar-root.css-kiu2gm > div.MuiPickersYear-root.css-1t72fib';
            const elementYear = await page.$$(selectorYear);

            const arrayTextyear = await page.evaluate((selectorYear) => {
                return Array.from(document.querySelectorAll(selectorYear))
                    .map(el => el.textContent.trim())
            }, selectorYear);

            for (let j = 0; j < arrayTextyear.length; j++) {
                if (arrayTextyear[j] == resultDateTime[0]) {
                    // await delay(3000);
                    await elementYear[j].click();
                    break;
                }
            }

            //หาเดือน
            const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

            await page.waitForSelector('div.MuiPickersCalendarHeader-labelContainer.css-16j77m4', { visible: true, timeout: 1000 }); // Timeout after 5 seconds
            const selectorMonthCurrent = 'div.MuiPickersCalendarHeader-labelContainer.css-16j77m4 > div.MuiPickersFadeTransitionGroup-root.css-1bx5ylf';
            const textMonth = await page.$eval(selectorMonthCurrent, el => el.textContent.trim());
            const monthCurrent = textMonth.split(' ');
            let indxtMonthCurrent = month.indexOf(monthCurrent[0]);

            await page.waitForSelector('div.MuiPickersArrowSwitcher-root.css-k008qs', { visible: true, timeout: 1000 }); // Timeout after 5 seconds
            const selectorMonth = 'div.MuiPickersArrowSwitcher-root.css-k008qs > button';
            const elementMonth = await page.$$(selectorMonth);
            // console.log('elementMonth', elementMonth);

            while (true) {
                if ((indxtMonthCurrent + 1) == resultDateTime[1]) {
                    break;
                }

                if ((indxtMonthCurrent + 1) > resultDateTime[1]) {
                    // await delay(3000);
                    await elementMonth[0].click();
                    await indxtMonthCurrent--;
                } else {
                    // await delay(3000);
                    await elementMonth[1].click();
                    await indxtMonthCurrent++;
                }
            }

            //หาวัน
            await delay(300);
            await page.waitForSelector('div.MuiDayCalendar-monthContainer.css-i6bazn', { visible: true, timeout: 1000 }); // Timeout after 5 seconds
            const selectorDay = 'div.MuiDayCalendar-monthContainer.css-i6bazn > div.MuiDayCalendar-weekContainer.css-mvmu1r';
            const elementDay = await page.$$(selectorDay);

            let findDay = false;
            for (const eleDay of elementDay) {
                const elementDayButton = await eleDay.$$('button');

                const textDay = await eleDay.$$eval('button', elements =>
                    elements.map(el => el.textContent.trim())
                );

                for (let l = 0; l < textDay.length; l++) {
                    if (textDay[l] == resultDateTime[2]) {
                        elementDayButton[l].click();
                        findDay = true;
                        break;
                    }
                }

                if (findDay) {
                    break;
                }
            }

            //หาชั่วโมง
            const selectorTimeHour = 'div.MuiClock-wrapper > span';
            await page.waitForSelector(selectorTimeHour, { visible: true });
            const elementTimeHour = await page.$$(selectorTimeHour);

            if (elementTimeHour.length > 0) {
                for (const elementHour of elementTimeHour) {
                    // const textHour = await element.evaluate(el => el.textContent.trim());
                    const textHour = await elementHour.evaluate(el => parseInt(el.textContent.trim(), 10));
                    if (textHour === resultDateTime[3]) {
                        elementHour.click();
                        break;
                    }
                    // console.log('Hour:', textHour);
                }
            } else {
                console.log('No elements found!');
            }

            //หานาที
            await delay(300);

            // <span class="MuiClockNumber-root css-1flhz3h" role="option" aria-label="05 minutes" style="transform: translate(45px, 13px);">05</span>
            const selectorTimeMinute = 'div.MuiClock-wrapper > span';
            await page.waitForSelector(selectorTimeMinute, { visible: true });
            const elementTimeMinute = await page.$$(selectorTimeMinute);

            const arrayTimeMinute = await page.evaluate((selectorTimeMinute) => {
                return Array.from(document.querySelectorAll(selectorTimeMinute))
                    .map(el => parseInt(el.textContent.trim(), 10))
                    .filter(num => !isNaN(num)); // Remove NaN values if any
            }, selectorTimeMinute);


            if (elementTimeMinute.length > 0) {

                for (let m = 0; m < elementTimeMinute.length; m++) {

                    if (arrayTimeMinute[m] === resultDateTime[4]) {
                        await elementTimeMinute[m].click();
                        break;

                    } else if (resultDateTime[4] > arrayTimeMinute[m] && resultDateTime[4] < arrayTimeMinute[(m + 1)]) {
                        const differenceNumber = await arrayTimeMinute[(m + 1)] - resultDateTime[4];
                        let differenceNumberNo = await (differenceNumber * 2) * (-1);

                        if (differenceNumber > 2) {
                            differenceNumberNo = await (differenceNumber * 2);
                        }

                        // console.log('differenceNumber xx', differenceNumber);
                        const boundingBox = await elementTimeMinute[m].boundingBox();
                        if (boundingBox) {
                            await page.mouse.move((boundingBox.x + differenceNumberNo), (boundingBox.y + differenceNumberNo));
                            await page.mouse.click((boundingBox.x + differenceNumberNo), (boundingBox.y + differenceNumberNo));
                        }

                        break;
                    } else if ((resultDateTime[4] < arrayTimeMinute[m] && resultDateTime[4] > 0) || (resultDateTime[4] > 55)) {
                        const differenceNumber = resultDateTime[4] - 55;
                        const boundingBox = await elementTimeMinute[10].boundingBox();
                        if (boundingBox) {
                            await page.mouse.move((boundingBox.x + (differenceNumber * 18)), (boundingBox.y + (differenceNumber * 18)));
                            await page.mouse.click((boundingBox.x + (differenceNumber * 18)), (boundingBox.y + (differenceNumber * 18)));
                        }

                        // await delay(5000);
                        break;
                    }
                }
            }
            await page.waitForSelector('button.MuiButtonBase-root', { visible: true, timeout: 2000 });

            const buttons = await page.$$('button.MuiButtonBase-root'); // Get all buttons

            if (buttons.length > 0) {
                await buttons[buttons.length - 1].click(); // Click the last button
                console.log('Last OK button clicked!');
            } else {
                console.log('No buttons found.');
            }
        }
    } else {
        console.log('Button not found!');
    }
}

openBrowser();